
import { BrowserTypes, DesktopAgent } from '@finos/fdc3';
import { GenericFdc3ActionRequest } from '../types';


type Fdc3StrategyExecutor = (fdc3Agent: DesktopAgent, fdc3Message: GenericFdc3ActionRequest) => Promise<void>;


const fdc3RaiseIntentStrategyExecutor: Fdc3StrategyExecutor = async (fdc3Agent: DesktopAgent, fdc3Message: GenericFdc3ActionRequest): Promise<void> => {
  console.log('%cfdc3RaiseIntentStrategyExecutor', 'font-weight:bold;');
  console.log('fdc3Agent:');
  console.log(fdc3Agent);
  console.log('fdc3Message:');
  console.log(fdc3Message);

  //TODO - Review this experimental 'firstOrDefault' functionality
  //The intention is to allow an AI Agent to target a single existing running instance of an app
  const useFirstOrDefault = true;

  const payload = fdc3Message.payload as BrowserTypes.RaiseIntentRequestPayload;
  let resolution;
  if (useFirstOrDefault && payload.app && !payload.app.instanceId) {
    // 'firstOrDefault' behaviour - need to target a raised intent at the first instance of the given app
    console.log(`Using 'firstOrDefault' behaviour`);
    const instances = await fdc3Agent.findInstances({ appId: payload.app.appId });
    if (instances.length > 0) {
      resolution = fdc3Agent.raiseIntent(payload.intent, payload.context, instances[0]);
    } else {
      throw new Error(`fdc3RaiseIntentStrategyExecutor - Cannot use firstOrDefault behaviour with raiseIntent because no existing running instances of appId '${payload.app.appId}' could be found`);
    }
  } else {
    // Standard behaviour - simply target a raised intent at the specified app identifier
    resolution = fdc3Agent.raiseIntent(payload.intent, payload.context, payload.app);
  }

  //TODO - Need to think about return value from this function. We could return the result of the fdc3Agent.raiseIntent invocation.
  //But what would the platform app even do with it, given that the originator was actually the AI agent?
  //This needs more thought.
}


const fdc3OpenStrategyExecutor: Fdc3StrategyExecutor = async (fdc3Agent: DesktopAgent, fdc3Message: GenericFdc3ActionRequest): Promise<void> => {
  //TODO - Explore solutions to the problem of invoking window.open without an associated user gesture
  //See comment in createFdc3OpenResource() function in packages/server for more details
  const payload = fdc3Message.payload as BrowserTypes.OpenRequestPayload;
  await fdc3Agent.open(payload.app, payload.context);
  //TODO - As with fdc3RaiseIntentStrategyExecutor, need to think about return value from this function also.
}


const fdc3BroadcastStrategyExecutor: Fdc3StrategyExecutor = async (fdc3Agent: DesktopAgent, fdc3Message: GenericFdc3ActionRequest): Promise<void> => {
  const payload = fdc3Message.payload as BrowserTypes.BroadcastRequestPayload;
  await fdc3Agent.broadcast(payload.context);
}


const fdc3StrategyExecutors = new Map<BrowserTypes.RequestMessageType, Fdc3StrategyExecutor>();
fdc3StrategyExecutors.set('raiseIntentRequest', fdc3RaiseIntentStrategyExecutor);
fdc3StrategyExecutors.set('openRequest', fdc3OpenStrategyExecutor);
fdc3StrategyExecutors.set('broadcastRequest', fdc3BroadcastStrategyExecutor);

export const getFdc3StrategyExecutor = (fdc3StrategyType: BrowserTypes.RequestMessageType): Fdc3StrategyExecutor => {
  console.log('%cgetFdc3StrategyExecutor', 'font-weight:bold;');
  console.log(`Getting FDC3 strategy executor for type '${fdc3StrategyType}'...`);
  const fdc3StrategyExecutor = fdc3StrategyExecutors.get(fdc3StrategyType);
  if (!fdc3StrategyExecutor) {
    throw new Error(`Implementation for fdc3StrategyType '${fdc3StrategyType}' could not be found`);
  }
  return fdc3StrategyExecutor;
};

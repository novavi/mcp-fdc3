import { DesktopAgent } from '@finos/fdc3';
import { getFdc3StrategyExecutor } from './executors/fdc3StrategyExecutors';
import { Fdc3ApiMimeType, Fdc3ApiUri, GenericFdc3ActionRequest, McpResource } from './types';

export function isMcpFdc3Resource(mcpResource: McpResource): boolean {
  return ((mcpResource) && (mcpResource.uri === Fdc3ApiUri) && (mcpResource.mimeType === Fdc3ApiMimeType) && (!!mcpResource.text));
}

export async function handleMcpFdc3Resource(fdc3Agent: DesktopAgent, mcpResource: McpResource): Promise<void> {
  console.log('%chandleMcpFdc3Resource', 'font-weight:bold;');
  console.log(`mcpResource.uri: ${mcpResource.uri}`);
  console.log(`mcpResource.mimeType: ${mcpResource.mimeType}`);
  console.log('mcpResource.text:');
  console.log(mcpResource.text);

  let fdc3Message: GenericFdc3ActionRequest | null = null;
  try {
    fdc3Message = JSON.parse(mcpResource.text) as GenericFdc3ActionRequest;
  } catch (e) {
    console.error('Failure obtaining FDC3 message when parsing MCP resource text:', e);
  }
  if (fdc3Message) {
    const fdc3StrategyExecutor = getFdc3StrategyExecutor(fdc3Message.type);
    await fdc3StrategyExecutor(fdc3Agent, fdc3Message);
  }
}

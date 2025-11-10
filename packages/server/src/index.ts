import { AppIdentifier, Context, BrowserTypes } from '@finos/fdc3';
import {
  MimeType,
  Fdc3MessageTextContent,
  Base64BlobContent,
  Fdc3ResourceContentPayload,
  CreateFdc3ResourceOptions,
} from './types';

export type {
  CreateFdc3ResourceOptions,
  Fdc3ResourceContentPayload,
} from './types';

export type Fdc3Resource = {
  type: 'resource';
  resource: Fdc3MessageTextContent | Base64BlobContent;
  annotations?: Record<string, unknown>;
  _meta?: Record<string, unknown>;
};

/**
 * Creates a generic Fdc3Resource.
 * This is the object that should be included in the 'content' array of a toolResult.
 * @param options Configuration for the FDC3 resource.
 * @returns a Fdc3Resource.
 */
export function createGenericFdc3Resource(options: CreateFdc3ResourceOptions): Fdc3Resource {
  if (options?.uri !== 'fdc3://api-method-request') {
    throw new Error("MCP-FDC3 library: URI must be 'fdc3://api-method-request' when content.type is 'fdc3ApiMethodRequest'.");
  }
  if (options?.content?.type !== 'fdc3ApiMethodRequest') {
    throw new Error(`MCP-FDC3 library: Invalid content.type specified: ${options.content.type}`);
  }
  if (typeof options?.content?.fdc3MessageJson !== 'string') {
    throw new Error(`MCP-FDC3 library: content.fdc3MessageJson must be provided as a JSON string when content.type is 'fdc3ApiMethodRequest'.`);
  }

  let resource: Fdc3Resource['resource'];
  switch (options.encoding) {
    case 'text':
      resource = {
        uri: options.uri,
        mimeType: 'application/vnd.mcp-fdc3.fdc3-api-method-request' as MimeType,
        text: options?.content?.fdc3MessageJson,
        // ...getAdditionalResourceProps(options),
      };
      break;
    case 'blob':
      throw new Error('blob encoding not implemented yet');
      break;
    default: {
      throw new Error(`MCP-FDC3 library: Invalid encoding type: ${options.encoding}`);
    }
  }

  return {
    type: 'resource',
    resource: resource,
    ...(options.embeddedResourceProps ?? {}),
  };
}

export function createFdc3RaiseIntentResource(intent: string,
                                              context: Context,
                                              app?: AppIdentifier): Fdc3Resource {
  const fdc3Message: BrowserTypes.RaiseIntentRequest = {
    type: 'raiseIntentRequest',
    payload: {
      app,
      context,
      intent,
    },
    meta: {
      requestUuid: (globalThis as any).crypto?.randomUUID(),
      source: undefined, //TODO - This needs more thought. What does 'originating app identity' actually mean in the context of an intent created by an MCP server and subsequently raised by the platform app?
      timestamp: new Date(),
    },
  };
  return createGenericFdc3Resource({
    uri: 'fdc3://api-method-request',
    content: {
      type: 'fdc3ApiMethodRequest',
      fdc3MessageJson: JSON.stringify(fdc3Message),
    },
    encoding: 'text',
  });
}

import { BrowserTypes } from '@finos/fdc3';

//TODO - Consider moving/consolidating some of these types to a new 'shared' library to avoid duplication
//Then consume in both the packages/client and packages/server libaries

export const Fdc3ApiUri = 'fdc3://api-method-request';

export const Fdc3ApiMimeType = 'application/vnd.mcp-fdc3.fdc3-api-method-request';

export interface McpResource {
  uri: typeof Fdc3ApiUri;
  mimeType: typeof Fdc3ApiMimeType;
  text: string; // FDC3 message JSON content
  blob?: never;
  _meta?: Record<string, unknown>;
};

export interface GenericFdc3ActionRequest {
  meta: any;
  payload: any;
  type: BrowserTypes.RequestMessageType;
}

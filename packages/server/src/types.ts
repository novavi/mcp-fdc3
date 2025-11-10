import type { EmbeddedResource, Resource } from '@modelcontextprotocol/sdk/types.js';

export type URI = 'fdc3://api-method-request';

export type MimeType = 'application/vnd.mcp-fdc3.fdc3-api-method-request';

export type Fdc3MessageTextContent = {
  uri: URI;
  mimeType: MimeType;
  text: string; // FDC3 message JSON content
  blob?: never;
  _meta?: Record<string, unknown>;
};

export type Base64BlobContent = {
  uri: URI;
  mimeType: MimeType;
  blob: string; //  Base64 encoded FDC3 message JSON content
  text?: never;
  _meta?: Record<string, unknown>;
};

export type Fdc3ResourceContentPayload = {
  type: 'fdc3ApiMethodRequest';
  fdc3MessageJson: string
}

export interface CreateFdc3ResourceOptions {
  uri: URI;
  content: Fdc3ResourceContentPayload;
  encoding: 'text' | 'blob';
  uiMetadata?: UIResourceMetadata;
  metadata?: Record<string, unknown>;
  resourceProps?: Fdc3ResourceProps;
  embeddedResourceProps?: EmbeddedFdc3ResourceProps;
}

export type Fdc3ResourceProps = Omit<Partial<Resource>, 'uri' | 'mimeType'>;
export type EmbeddedFdc3ResourceProps = Omit<Partial<EmbeddedResource>, 'resource' | 'type'>;

export const UIMetadataKey = {
  PREFERRED_FRAME_SIZE: 'preferred-frame-size',
  INITIAL_RENDER_DATA: 'initial-render-data',
} as const;

export type UIResourceMetadata = {
  [UIMetadataKey.PREFERRED_FRAME_SIZE]?: [string, string];
  [UIMetadataKey.INITIAL_RENDER_DATA]?: Record<string, unknown>;
};

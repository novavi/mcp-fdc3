// import { createFdc3Resource } from '../../../../packages/server/dist/mcp-fdc3-server.esm.js';
import { createFdc3Resource } from '@mcp-fdc3/server/dist/mcp-fdc3-server.esm.js';
import { tickerMappingData } from '../mock-data/index.js';

export const getTrades = async ({ companyName }: { companyName: string }): Promise</* TODO - Use proper type here */any> => {
  // Create the FDC3 resource to be returned to the client (this is the only part specific to MCP-FDC3)
  const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
  const company = tickerMappingData.find((c: any) => c.name.toLowerCase().includes(sanitizedCompanyName));
  console.log(`companyName: ${companyName}; sanitizedCompanyName: %{sanitizedCompanyName}; company.name: ${company?.name}; company.ticker: ${company?.ticker}`);
  if (company) {
    const fdc3Message: /* TODO - Use proper type from @finos/fdc3 package here */any = {
      type: 'raiseIntentRequest',
      payload: {
        app: {
          appId: 'frontend-app-blotter'
        },
        context: {
          type: 'fdc3.instrument',
          name: company?.name,
          id: {
            ticker: company?.ticker
          }
        },
        intent: 'ViewInstrument'
      }
    };
    const uiResource = createFdc3Resource({
      uri: 'fdc3://api-method-request',
      content: {
        type: 'fdc3ApiMethodRequest',
        fdc3MessageJson: JSON.stringify(fdc3Message),
      },
      encoding: 'text',
    });
    return {
      content: [
        {
          type: 'text',
          text: `Trades retrieved for ${companyName}`,
        },
        uiResource,
      ],
    };
  } else {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Failed to lookup company for company name '${companyName}'`,
        },
        // isError: true,
      ],
    };
  }
};

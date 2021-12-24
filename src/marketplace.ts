import fetch from 'node-fetch';

const extensionQueryApi =
  'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';

export enum ExtensionQuerySortByOptions {
  lastUpdated = 1,
  publishedDate = 10,
}

export interface ExtensionQueryOptions {
  pageNumber: number;
  pageSize: number;
  sortBy: keyof typeof ExtensionQuerySortByOptions;
  direction: number;
  criteria: Array<{ filterType: number; value: string }>;
}

export interface UpdatedExtensionsQueryOptions {
  pageNumber: number;
  pageSize: number;
}

export interface ExtensionSlugQueryOptions {
  extensionSlug: string;
}

export interface ExtensionIdQueryOptions {
  extensionId: string;
}

const defaultOptions: ExtensionQueryOptions = {
  pageNumber: 1,
  pageSize: 100,
  sortBy: 'lastUpdated',
  direction: 2,
  criteria: [],
};

export interface ExtensionQueryResult {
  publisher: {
    publisherId: string;
    publisherName: string;
    displayName: string;
    flags: string;
  };
  extensionId: string;
  extensionName: string;
  displayName: string;
  flags: string;
  lastUpdated: string;
  publishedDate: string;
  releaseDate: string;
  shortDescription?: string;
  versions: Array<{
    version: string;
    flags: string;
    lastUpdated: string;
    files: Array<{
      assetType: string;
      source: string;
    }>;
    properties: Array<{
      key: string;
      value: string;
    }>;
    assetUri: string;
    fallbackAssetUri: string;
  }>;
  categories: string[];
  tags: string[];
  statistics?: Array<{
    statisticName: string;
    value: number;
  }>;
  installationTargets: Array<{
    target: string;
    targetVersion: string;
  }>;
  deploymentType: number;
}

export const query = async (
  opts: Partial<ExtensionQueryOptions> = {},
): Promise<ExtensionQueryResult[]> => {
  const { pageNumber, pageSize, sortBy, direction, criteria } = {
    ...defaultOptions,
    ...opts,
  };

  const res = await fetch(extensionQueryApi, {
    method: 'POST',
    headers: {
      Accept: 'application/json;api-version=5.2-preview.1;excludeUrls=true',
      'Content-Type': 'application/json',
      'User-Agent': '', // node-fetch sets the user-agent, causing the marketplace api to return an error.
    },
    body: JSON.stringify({
      assetTypes: null,
      filters: [
        {
          criteria,
          direction,
          pageSize,
          pageNumber,
          sortBy: ExtensionQuerySortByOptions[sortBy],
          sortOrder: 0,
          pagingToken: null,
        },
      ],
      flags: 870,
    }),
  });

  if (!res.ok) {
    throw new Error(`Marketplace API response status '${res.statusText}'`);
  }

  const data = await res.json();
  return data.results[0].extensions;
};

export const queryUpdatedExtensions = async (
  opts: UpdatedExtensionsQueryOptions,
) => {
  try {
    const results = query({
      ...opts,
      direction: 2,
      sortBy: 'lastUpdated',
      criteria: [
        {
          filterType: 8,
          value: 'Microsoft.VisualStudio.Code',
        },
        {
          filterType: 10,
          value: 'target:"Microsoft.VisualStudio.Code" ',
        },
        {
          filterType: 12,
          value: '37888',
        },
        {
          filterType: 5,
          value: 'Themes',
        },
      ],
    });
    return results;
  } catch (err) {
    throw new Error(
      `MarketplaceAPI.queryUpdatedExtensions failed: ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
};

export const queryExtensionId = async (extensionId: string) => {
  try {
    const results = await query({
      direction: 2,
      criteria: [
        {
          filterType: 4,
          value: extensionId,
        },
      ],
    });
    return results;
  } catch (err) {
    throw new Error(
      `MarketplaceAPI.queryExtensionId failed for ${extensionId}: ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
};

export const queryExtensionSlug = async (extensionSlug: string) => {
  try {
    const results = await query({
      direction: 2,
      criteria: [
        {
          filterType: 7,
          value: extensionSlug,
        },
      ],
    });
    return results;
  } catch (err) {
    throw new Error(
      `MarketplaceAPI.queryExtensionSlug failed for ${extensionSlug}: ${
        err instanceof Error ? err.message : err
      }`,
    );
  }
};

import fetch from 'node-fetch';


// ---

type GetInstallationListResponse = Array<{
  id: number,
  account: {
    login: string,
    // ...
  },
  // ...
}>;
export const getInstallations = async (token: string): Promise<GetInstallationListResponse> => {
  const resp = await fetch('https://api.github.com/app/installations', {
    headers: {
      'accept': 'application/vnd.github+json',
      'authorization': `Bearer ${token}`,
    },
  });

  if (resp.status !== 200) {
    throw resp.status;
  }

  return await resp.json() as GetInstallationListResponse;
};


// ---

type GetInstallationAccessTokenResponse = {
  token: string,
  // ...
}
export const getInstallationAccessToken = async (token: string, installationId: string): Promise<GetInstallationAccessTokenResponse> => {
  const resp = await fetch('https://api.github.com/app/installations/{installationId}/access_tokens'.replace('{installationId}', installationId), {
    headers: {
      'accept': 'application/vnd.github+json',
      'authorization': `Bearer ${token}`,
    },
    method: 'POST',
  });

  if (resp.status !== 201) {
    console.debug(`ERR: response status: ${resp.status}`);
    throw resp.status;
  }

  return await resp.json() as GetInstallationAccessTokenResponse;
};


// ---

type GetInstallationReposResponse = {
  "total_count": number,
  "repositories": Array<{
    "id": number,
    "name": string,
    "full_name": string,
    "private": boolean,
    "html_url": string,
    "description": string,
    "url": string,
    "is_template": false,
    "topics": string[],
    // ...
  }>,
  // ...
};
export const getInstallationRepos = async (installationToken: string): Promise<GetInstallationReposResponse> => {
  const resp = await fetch('https://api.github.com/installation/repositories', {
    headers: {
      'accept': 'application/vnd.github+json',
      'authorization': `Bearer ${installationToken}`,
    },
  });

  if (resp.status !== 200) {
    throw resp.status;
  }

  return await resp.json() as GetInstallationReposResponse;
};

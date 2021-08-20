import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { Node } from './generated/graphql';
import { octokit } from './octokit';

export const closePullRequest = async ({ id }: Node): Promise<void> => {
  const request = {
    mutation: {
      closePullRequest: {
        __args: {
          input: {
            pullRequestId: id,
          },
        },
        clientMutationId: true,
      },
    },
  };

  await octokit(jsonToGraphQLQuery(request));
};

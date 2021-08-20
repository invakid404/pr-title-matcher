import { graphql } from '@octokit/graphql';

import { Context } from './context';

export const octokit = graphql.defaults({
  headers: {
    authorization: `token ${Context.token}`,
  },
});

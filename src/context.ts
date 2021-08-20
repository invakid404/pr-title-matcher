import * as core from '@actions/core';
import * as github from '@actions/github';

export const Context = {
  repo: github.context.repo,
  token: process.env.GITHUB_TOKEN,
  configPath: core.getInput('configPath', { required: true }),
  githubWorkspace: process.env.GITHUB_WORKSPACE,
  jira: {
    host: core.getInput('jiraHost', { required: true }),
    username: core.getInput('jiraUsername', { required: true }),
    password: core.getInput('jiraPassword', { required: true }),
  },
  actions: {
    badTitle: core.getInput('actionOnBadTitle'),
    badTicket: core.getInput('actionOnBadTicket'),
    badBranch: core.getInput('actionOnBadBranch'),
  },
};

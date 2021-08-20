import * as core from '@actions/core';
import * as github from '@actions/github';

(async (): Promise<void> => {
  if (!github.context.payload.pull_request) {
    core.info('No pull request found, exiting.');

    return;
  }

  const { title } = github.context.payload.pull_request;

  const regexPattern = core.getInput('regex', { required: true });
  const regexFlags = core.getInput('flags');

  const regex = new RegExp(regexPattern, regexFlags);

  const res = regex.exec(title);
  if (!res) {
    core.setFailed("PR title doesn't match!");

    return;
  }

  Object.entries(res.groups ?? {}).forEach(([groupName, groupVal]) =>
    core.setOutput(groupName, groupVal),
  );
})();

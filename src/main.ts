import * as core from '@actions/core';
import * as github from '@actions/github';

import { addLabelByName } from './labels';

(async (): Promise<void> => {
  if (!github.context.payload.pull_request) {
    core.info('No pull request found, exiting.');

    return;
  }

  const { node_id: id, title } = github.context.payload.pull_request;

  const regexPattern = core.getInput('regex', { required: true });
  const regexFlags = core.getInput('flags');

  const label = core.getInput('label');
  core.info(`label ${label}`);

  const regex = new RegExp(regexPattern, regexFlags);

  const res = regex.exec(title);
  if (!res) {
    if (label) {
      core.info(`adding label to ${id}`);
      await addLabelByName({ id }, label);
    }

    core.setFailed("PR title doesn't match!");

    return;
  }

  Object.entries(res.groups ?? {}).forEach(([groupName, groupVal]) =>
    core.setOutput(groupName, groupVal),
  );
})();

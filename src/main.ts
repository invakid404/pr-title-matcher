import * as core from '@actions/core';
import * as github from '@actions/github';

import { addLabelByName, removeLabelByName } from './labels';

(async (): Promise<void> => {
  if (!github.context.payload.pull_request) {
    core.info('No pull request found, exiting.');

    return;
  }

  const { node_id: id, title, labels } = github.context.payload.pull_request;

  const regexPattern = core.getInput('regex', { required: true });
  const regexFlags = core.getInput('flags');

  const label = core.getInput('label');

  const regex = new RegExp(regexPattern, regexFlags);

  const res = regex.exec(title);
  if (!res) {
    if (label) {
      await addLabelByName({ id }, label);
    }

    core.setFailed("PR title doesn't match!");

    return;
  }

  Object.entries(res.groups ?? {}).forEach(([groupName, groupVal]) =>
    core.setOutput(groupName, groupVal),
  );

  const hasLabel =
    label && labels.some((curr: { name: string }) => curr.name === label);

  if (hasLabel) {
    await removeLabelByName({ id }, label);
  }
})();

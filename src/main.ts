import * as core from '@actions/core';
import * as github from '@actions/github';

import { cleanup, discardAction, init, performAction } from './actions';
import { getRule, TicketParams, TitleParams } from './config';
import { isTicketValid } from './jira';

(async (): Promise<void> => {
  if (!github?.context?.payload?.pull_request) {
    return;
  }

  const {
    node_id: pr_id,
    title,
    head: { ref: branchName },
    labels,
  } = github.context.payload.pull_request;

  try {
    init();

    const titleRule = getRule('bad-title');
    const titleParams = titleRule?.params as TitleParams;

    const titleRegex = new RegExp(titleParams?.pattern);
    const titleMatch = titleRegex.exec(title);

    if (!titleMatch) {
      await performAction(pr_id, titleRule.action);

      return;
    }

    discardAction(titleRule.action);

    const ticketName = titleMatch.groups?.ticket;
    if (!ticketName) {
      return;
    }

    const ticketRule = getRule('bad-ticket');
    const ticketParams = ticketRule?.params as TicketParams;

    const ticketValid = await isTicketValid(
      ticketName,
      ticketParams.requiredFields ?? [],
    );

    if (!ticketValid) {
      await performAction(pr_id, ticketRule.action);

      return;
    }

    discardAction(ticketRule.action);

    const branchRule = getRule('bad-branch');
    if (!branchName.includes(ticketName)) {
      await performAction(pr_id, branchRule.action);

      return;
    }

    discardAction(branchRule.action);
  } catch (err) {
    core.setFailed(err);
  } finally {
    await cleanup(
      pr_id,
      labels.map((label: { name: string }) => label.name),
    );
  }
})();

import JiraApi from 'jira-client';

import { Context } from './context';

export const jira = new JiraApi({
  protocol: 'https',
  apiVersion: '2',
  strictSSL: true,
  ...Context.jira,
});

export const isTicketValid = async (
  ticketName: string,
  requiredFields: string[],
): Promise<boolean> => {
  try {
    const issue = await jira.findIssue(ticketName);

    return true;
  } catch (err) {
    return false;
  }
};

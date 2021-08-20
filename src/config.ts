import * as fs from 'fs';
import path from 'path';

import { Context } from './context';

export interface Config {
  rules: RulesConfig;
}

export type RulesConfig = {
  [key in RuleKey]: Rule;
};

export type RuleKey = 'default' | 'bad-title' | 'bad-ticket' | 'bad-branch';

export interface Rule {
  params?: TitleParams | TicketParams;
  action: Action;
}

export interface Action {
  type: 'label' | 'close' | 'noop';
  options?: LabelOptions;
}

export interface TitleParams {
  pattern: string;
}

export interface TicketParams {
  requiredFields?: string[];
}

export interface LabelOptions {
  labelName: string;
}

let config: Config;

export const getConfig = (): Config => {
  if (config) {
    return config;
  }

  if (!Context.githubWorkspace) {
    throw new Error('Github workspace path unknown!');
  }

  const configPath = path.resolve(Context.githubWorkspace, Context.configPath);
  const configContent = fs.readFileSync(configPath);

  return (config = JSON.parse(configContent.toString()));
};

export const getRule = (rule: RuleKey): Rule => {
  const { rules } = getConfig();

  return rules[rule] ?? rules['default'] ?? { action: { type: 'noop' } };
};

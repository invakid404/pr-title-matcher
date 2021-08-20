import * as core from '@actions/core';

import { Action, getConfig, LabelOptions } from './config';
import { addLabelByName, removeLabelByName } from './labels';
import { closePullRequest } from './prs';

export interface State {
  labels: Record<string, number>;
}

let state: State;

export const init = (): void => {
  const config = getConfig();

  state = {
    labels: Object.values(config.rules).reduce((acc, rule) => {
      switch (rule.action.type) {
        case 'label': {
          const labelOptions = rule.action.options as LabelOptions;
          const oldAmount = acc[labelOptions.labelName] ?? 0;

          acc[labelOptions.labelName] = oldAmount + 1;

          break;
        }
        default:
      }

      return acc;
    }, {} as Record<string, number>),
  };
};

export const cleanup = async (id: string, labels: string[]): Promise<void> => {
  await Promise.all(
    labels
      .filter((label) => state.labels[label] <= 0)
      .map(async (label) => {
        await removeLabelByName({ id }, label);
      }),
  );
};

export const performAction = async (
  id: string,
  action: Action,
): Promise<void> => {
  switch (action.type) {
    case 'label': {
      const labelOptions = action.options as LabelOptions;
      const labelName = labelOptions?.labelName;

      if (labelName) {
        await addLabelByName({ id }, labelName);
      }

      break;
    }
    case 'close': {
      await closePullRequest({ id });

      break;
    }
    case 'noop': {
      break;
    }
    default: {
      core.info(`Unknown action "${action}"!`);
    }
  }
};

export const discardAction = (action: Action): void => {
  switch (action.type) {
    case 'label': {
      const labelOptions = action.options as LabelOptions;
      const labelName = labelOptions?.labelName;

      if (labelName) {
        --state.labels[labelName];
      }

      break;
    }
    default:
  }
};

import { IIntlState } from './intl/reducers';
import { IRuntimeState } from './runtime/reducers';
import { IUIState } from './ui/reducers';
import { IUserState } from './user/reducers';

export {
  IIntlState,
  IRuntimeState,
  IUIState,
  IUserState,
};

export interface IState {
  routing?: any;
  ui?: IUIState;
  user?: IUserState;
  runtime?: IRuntimeState;
  intl?: IIntlState;
}

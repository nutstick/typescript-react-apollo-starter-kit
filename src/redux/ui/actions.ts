import {
  LEFT_SIDEBAR_TOGGLE,
  RIGHT_SIDEBAR_TOGGLE,
  SET_LEFT_SIDEBAR_EXPAND,
  SET_RIGHT_SIDEBAR_EXPAND,
  SET_SIDEBAR_EXPAND,
} from './constants';

export interface ISetSidebarExpand {
  type: SET_SIDEBAR_EXPAND;
  payload: string;
}

export interface IRightSidebarExpand {
  type: SET_RIGHT_SIDEBAR_EXPAND;
  payload: boolean;
}

export interface IRightSidebarToggle {
  type: RIGHT_SIDEBAR_TOGGLE;
}

export interface ILeftSidebarExpand {
  type: SET_LEFT_SIDEBAR_EXPAND;
  payload: boolean;
}

export interface ILeftSidebarToggle {
  type: LEFT_SIDEBAR_TOGGLE;
}

export type UIAction = ISetSidebarExpand | IRightSidebarExpand | IRightSidebarToggle
  | ILeftSidebarExpand | ILeftSidebarToggle;

export function setSidebarExpand(expand): ISetSidebarExpand {
  return {
    type: SET_SIDEBAR_EXPAND,
    payload: expand,
  };
}

export function rightSidebarExpand(expanded): IRightSidebarExpand {
  return {
    type: SET_RIGHT_SIDEBAR_EXPAND,
    payload: expanded,
  };
}

export function rightSidebarToggle(): IRightSidebarToggle {
  return {
    type: RIGHT_SIDEBAR_TOGGLE,
  };
}

export function leftSidebarExpand(expanded): ILeftSidebarExpand {
  return {
    type: SET_LEFT_SIDEBAR_EXPAND,
    payload: expanded,
  };
}

export function leftSidebarToggle(): ILeftSidebarToggle {
  return {
    type: LEFT_SIDEBAR_TOGGLE,
  };
}

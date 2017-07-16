import {
  LEFT_SIDEBAR_EXPAND,
  LEFT_SIDEBAR_TOGGLE,
  RIGHT_SIDEBAR_TOGGLE,
  SET_FLOATING_BUTTON_ACTIVE,
  SET_FLOATING_BUTTON_DEACTIVE,
  SET_FLOATING_BUTTON_TARGET,
  SET_RIGHT_SIDEBAR_EXPAND,
  SET_SIDEBAR_EXPAND,
} from './constants';

export function setFloatingButtonActive() {
  return {
    type: SET_FLOATING_BUTTON_ACTIVE,
  };
}
export function setFloatingButtonDeactive() {
  return {
    type: SET_FLOATING_BUTTON_DEACTIVE,
  };
}

interface ISetFloatingButtonTarget {
  url?: string;
  icon: string;
}

export function setFloatingButtonTarget({ url, icon }: ISetFloatingButtonTarget) {
  return {
    type: SET_FLOATING_BUTTON_TARGET,
    payload: {
      url,
      icon,
    },
  };
}

export function setSidebarExpand(expand) {
  return {
    type: SET_SIDEBAR_EXPAND,
    payload: expand,
  };
}

export function rightSidebarExpand(expanded) {
  return {
    type: SET_RIGHT_SIDEBAR_EXPAND,
    payload: expanded,
  };
}

export function rightSidebarToggle() {
  return {
    type: RIGHT_SIDEBAR_TOGGLE,
  };
}

export function leftSidebarExpand() {
  return {
    type: LEFT_SIDEBAR_EXPAND,
  };
}

export function leftSidebarToggle() {
  return {
    type: LEFT_SIDEBAR_TOGGLE,
  };
}

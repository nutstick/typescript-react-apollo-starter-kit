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

export interface IUIState {
  floatingButton: {
    to: string,
    icon: string,
    show: boolean,
  };
  sidebar: {
    expand: {
      left: boolean,
      right: boolean,
    };
  };
}

export const uiReducers = function ui(state: IUIState = null, action) {
  if (state === null) {
    return {
      floatingButton: {
        to: null,
        icon: null,
        show: false,
      },
      sidebar: {
        expand: {
          left: true,
          right: false,
        },
      },
    };
  }

  switch (action.type) {
    case SET_FLOATING_BUTTON_ACTIVE: {
      return {
        ...state,
        floatingButton: {
          show: true,
          to: state.floatingButton.to,
          icon: state.floatingButton.icon,
        },
      };
    }

    case SET_FLOATING_BUTTON_DEACTIVE: {
      return {
        ...state,
        floatingButton: {
          show: false,
          to: state.floatingButton.to,
          icon: state.floatingButton.icon,
        },
      };
    }

    case SET_FLOATING_BUTTON_TARGET: {
      const { url, icon } = action.payload;
      return {
        ...state,
        floatingButton: {
          show: state.floatingButton.show,
          to: url,
          icon,
        },
      };
    }

    case SET_SIDEBAR_EXPAND: {
      return {
        ...state,
        sidebar: {
          expand: {
            left: action.payload === 'left',
            right: action.payload === 'right',
          },
        },
      };
    }

    case LEFT_SIDEBAR_EXPAND: {
      return {
        ...state,
        sidebar: {
          expand: {
            left: true,
            right: state.sidebar.expand.right,
          },
        },
      };
    }

    case LEFT_SIDEBAR_TOGGLE: {
      return {
        ...state,
        sidebar: {
          expand: {
            left: true,
            right: state.sidebar.expand.right,
          },
        },
      };
    }

    case SET_RIGHT_SIDEBAR_EXPAND: {
      return {
        ...state,
        sidebar: {
          expand: {
            left: state.sidebar.expand.left,
            right: action.payload,
          },
        },
      };
    }

    case RIGHT_SIDEBAR_TOGGLE: {
      return {
        ...state,
        sidebar: {
          expand: {
            left: state.sidebar.expand.left,
            right: !state.sidebar.expand.right,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};

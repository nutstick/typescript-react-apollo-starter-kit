import { UIAction } from './actions';
import {
  LEFT_SIDEBAR_TOGGLE,
  RIGHT_SIDEBAR_TOGGLE,
  SET_LEFT_SIDEBAR_EXPAND,
  SET_RIGHT_SIDEBAR_EXPAND,
  SET_SIDEBAR_EXPAND,
} from './constants';

export interface UIState {
  sidebar: {
    expand: {
      left: boolean,
      right: boolean,
    };
  };
}

export const uiReducers = function ui(state: UIState = null, action: UIAction) {
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

    case SET_LEFT_SIDEBAR_EXPAND: {
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

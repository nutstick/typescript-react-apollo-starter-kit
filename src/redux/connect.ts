// tslint:disable:interface-name
// tslint:disable:callable-types
import { ComponentClass, StatelessComponent } from 'react';
import { connect, Dispatch } from 'react-redux';
import * as Redux from 'redux';
import { IState } from './reducers';

interface MapStateToProps<TStateProps, TOwnProps> {
  (state: IState, ownProps: TOwnProps): TStateProps;
}

interface MapStateToPropsFactory<TStateProps, TOwnProps> {
  (initialState: IState, ownProps: TOwnProps): MapStateToProps<TStateProps, TOwnProps>;
}

type MapStateToPropsParam<TStateProps, TOwnProps> =
  MapStateToProps<TStateProps, TOwnProps> | MapStateToPropsFactory<TStateProps, TOwnProps>;

interface MapDispatchToPropsFunction<TDispatchProps, TOwnProps> {
  (dispatch: Dispatch<IState>, ownProps: TOwnProps): TDispatchProps;
}

type MapDispatchToProps<TDispatchProps, TOwnProps> =
  MapDispatchToPropsFunction<TDispatchProps, TOwnProps> | TDispatchProps;

interface MapDispatchToPropsFactory<TDispatchProps, TOwnProps> {
  (dispatch: Dispatch<IState>, ownProps: TOwnProps): MapDispatchToProps<TDispatchProps, TOwnProps>;
}

type MapDispatchToPropsParam<TDispatchProps, TOwnProps> =
  MapDispatchToProps<TDispatchProps, TOwnProps> | MapDispatchToPropsFactory<TDispatchProps, TOwnProps>;

function connectToAppState<TStateProps, TDispatchProps, TOwnProps>(
  mapProps: MapStateToPropsParam<TStateProps, TOwnProps>,
  mapDispatch?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
) {
  return connect<TStateProps, TDispatchProps, TOwnProps>(mapProps, mapDispatch);
}

export {
    connectToAppState as connect,
};

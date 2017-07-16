import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as s from './BottomFloatingButton.css';

interface IBottomFloatingButton extends React.Props<any> {
  show: boolean;
  onClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
  to?: string;
}

class BottomFloatingButton extends React.Component<IBottomFloatingButton> {
  public render() {
    const { show, onClick, to } = this.props;
    return (
      <div className={cx(s.float, { [s.show]: show })}>
        {
          to ? <Link className={s.actionButton} to={to}></Link> :
          <a className={s.actionButton}
            href="#"
            onClick={this.props.onClick}
          >
            {this.props.children}
          </a>
        }
      </div>
    );
  }
}

export default withStyles(s)(BottomFloatingButton);

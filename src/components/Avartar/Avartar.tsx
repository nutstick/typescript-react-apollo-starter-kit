import * as cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as React from 'react';
import * as s from './Avartar.css';

interface IAvatarProps {
  alt?: string;
  className?: string;
  size?: number;
  src: string;
}

interface IDefaultStyle {
  height: number;
  width: number;
}

class Avartar extends React.Component<IAvatarProps, any> {
  style: IDefaultStyle;
  public constructor(props) {
    super(props);
    this.style = {
      height: this.props.size || 200,
      width: this.props.size || 200,
    };
  }
  public render() {
    return (
      <div className={cx(s.wrapper, s.circle, this.props.className)} style={this.style}>
        <img
          className={s.circle}
          src={this.props.src}
          alt={this.props.alt}
          style={this.style}
        />
      </div>
    );
  }
}

export default withStyles(s)(Avartar);

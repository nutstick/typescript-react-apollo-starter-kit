import * as React from 'react';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

interface ILinkProps extends React.Props<any> {
  className?: string;
  to: string;
  onClick?(e: any): void;
}

export default class Link extends React.Component<ILinkProps, void> {
  static defaultProps = {
    onClick: null,
  };

  private handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    // history.push(this.props.to);
  }

  public render() {
    const { to, children, ...props } = this.props;
    return <a href={to} {...props} onClick={this.handleClick}>{children}</a>;
  }
}

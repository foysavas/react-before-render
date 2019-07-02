import React from "react";

export default function beforeRender({
  load,
  loadingComponent,
  shouldReload,
  propTypes,
  contextTypes,
  wrappers,
  onRejected
}) {
  return WrappedComponent => {
    class BeforeRender extends React.Component {
      constructor(props) {
        super(props);
        this.state = { readyToRender: false };
      }

      componentWillMount() {
        if (load) {
          const res = load({ props: this.props, context: this.context });
          if (res && res.then) {
            res.then(() => this.setState({ readyToRender: true }));
          } else {
            this.setState({ readyToRender: true });
          }
        }
      }

      componentWillReceiveProps(nextProps) {
        if (load && shouldReload && shouldReload(this.props, nextProps)) {
          this.setState({ readyToRender: false });
          const res = load({ props: nextProps, context: this.context });
          if (res && res.then) {
            res.then(
              () => this.setState({ readyToRender: true }),
              error => {
                if (onRejected) {
                  return onRejected(error);
                } else {
                  throw error;
                }
              }
            );
          } else {
            this.setState({ readyToRender: true });
          }
        }
      }

      render() {
        const loader = loadingComponent
          ? React.createElement(loadingComponent, this.props)
          : null;
        return this.state.readyToRender ? (
          <WrappedComponent {...this.props} />
        ) : (
          loader
        );
      }
    }

    BeforeRender.displayName = `beforeRender(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    if (propTypes) {
      BeforeRender.propTypes = propTypes;
    } else {
      BeforeRender.propTypes = WrappedComponent.propTypes;
    }

    if (contextTypes) {
      BeforeRender.contextTypes = contextTypes;
    } else {
      BeforeRender.contextTypes = WrappedComponent.contextTypes;
    }

    if (wrappers) {
      if (Array.isArray(wrappers)) {
        return wrappers.reverse().reduce((acc, fn) => fn(acc), BeforeRender);
      } else {
        return wrappers(BeforeRender);
      }
    } else {
      return BeforeRender;
    }
  };
}

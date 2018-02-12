# react-before-render

Let's you:

* load data by resolving a promise before a react component renders
* specify a loading component to display before renders
* reload data conditionally when props change
* integrate other react HOCs like react-router and react-redux

```
import { beforeRender } from 'react-before-render';
// ...

export default beforeRender({
  propTypes: {
    propNeeded: PropType.object
  },
  contextTypes: {
    contextNeeded: PropType.object
  },
  wrappers: [OrderedHOCsToApply],
  load: ({ props, context }) => {
    return somePromiseResolvedBeforeRender;
  },
  shouldReload: (props, nextProps) => {
    return props.thing !== nextProps.thing;
  },
  loadingComponent: LoadingComponentToShowBeforeRender,
})(SomeReactComponent);
```

Example usage with react-router v4, react-redux, and decorator syntax:

```
@beforeRender({
  contextTypes: {
    store: PropTypes.object.isRequired
  },
  propTypes: {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  },
  wrappers: [withRouter],
  load: ({props, context}) => {
    const store = context.store;
    return store.dispatch(getSession());
  },
  shouldReload: (props, nextProps) => {
    return props.match.params.id !== nextProps.match.params.id;
  },
  loadingComponent: LoadingSpinner
})
@withRouter
@connect(() => (), {})
export default class Example extends React.Component {
  // ...
}
```

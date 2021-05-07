import { beforeRender } from "../src/index";
import PropTypes from "prop-types";
import React from "react";
import TestRenderer from "react-test-renderer";

class ExampleClassComponent extends React.Component {
  render() {
    return <div>rendered</div>;
  }
}

function ExampleFunctionalComponent({}) {
  return <div>rendered</div>;
}

class Loading extends React.Component {
  render() {
    return <div>loading</div>;
  }
}

const ExampleBeforeRenderConfig = {
  propTypes: {
    waitTime: PropTypes.number,
  },
  contextTypes: {
    // store: PropTypes.object
  },
  load: ({ props, context }) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, props.waitTime * 1000);
    });
  },
  shouldReload: (props, nextProps) => {
    return false;
    // return props.id !== nextProps.id;
  },
  loadingComponent: Loading,
};

test("Should work for React Class Components", () => {
  const WrappedExampleClassComponent = beforeRender(ExampleBeforeRenderConfig)(
    ExampleClassComponent
  );

  const plain_r = TestRenderer.create(<ExampleClassComponent />).toJSON();
  const waiting_r = TestRenderer.create(
    <WrappedExampleClassComponent waitTime={10} />
  ).toJSON();
  const nowait_r = TestRenderer.create(
    <WrappedExampleClassComponent waitTime={0} />
  ).toJSON();
  expect(plain_r.children[0] === "rendered");
  expect(waiting_r.children[0] === "loading");
  expect(nowait_r.children[0] === "rendered");
});

test("Should work for React Functional Components", () => {
  const WrappedExampleFunctionalComponent = beforeRender(
    ExampleBeforeRenderConfig
  )(ExampleFunctionalComponent);

  const plain_r = TestRenderer.create(<ExampleFunctionalComponent />).toJSON();
  const waiting_r = TestRenderer.create(
    <WrappedExampleFunctionalComponent waitTime={10} />
  ).toJSON();
  const nowait_r = TestRenderer.create(
    <WrappedExampleFunctionalComponent waitTime={0} />
  ).toJSON();
  expect(plain_r.children[0] === "rendered");
  expect(waiting_r.children[0] === "loading");
  expect(nowait_r.children[0] === "rendered");
});

import React, { Component } from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "lodash.debounce";

export default class ScaleBox extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentClass: PropTypes.string,
    maxScale: PropTypes.number,
    baseWidth: PropTypes.number
  };

  static defaultProps = {
    wrapperClass: "",
    contentClass: ""
  };

  constructor() {
    super();
    this.recentScales = React.createRef();
    this.recentScales.current = [];
    this.state = {
      wrapperSize: { width: 0, height: 0 },
      contentSize: { width: 0, height: 0 },
      scale: 1
    };
  }

  sizeChanged = new ResizeObserver(
    debounce((entries, observer) => {
      this.refreshScale();
    }),
    100
  );

  componentDidMount() {
    const { wrapper } = this.refs;
    this.sizeChanged.observe(wrapper);

    this.refreshScale();
  }

  componentWillUnmount() {
    this.sizeChanged.disconnect();
  }

  refreshScale() {
    let { wrapper, content } = this.refs;
    if (!(wrapper && content)) {
      return;
    }
    let actualContent = content.children[0];

    let contentSize = {
      width: actualContent.offsetWidth,
      height: actualContent.offsetHeight
    };
    let wrapperSize = {
      width: wrapper.clientWidth,
      height: wrapper.clientHeight
    };
    const { maxScale } = this.props;

    let scale = wrapperSize.width / this.props.baseWidth;
    if (maxScale) {
      scale = Math.min(scale, maxScale);
    }

    if (
      this.recentScales.current.includes(scale) ||
      scale === this.state.scale
    ) {
      return;
    }

    if (this.recentScales.current.length > 10) {
      this.recentScales.current.shift();
    }
    this.recentScales.current.push(this.state.scale);

    this.setState({ contentSize: contentSize, scale: scale });
  }
  render() {
    const { scale } = this.state;
    const { children, wrapperClass, contentClass } = this.props;
    return (
      <div ref="wrapper" className={wrapperClass}>
        <div
          ref="container"
          style={{
            height: this.state.contentSize.height * this.state.scale + "px"
          }}
        >
          <div
            ref="content"
            className={contentClass}
            style={{
              width: this.props.baseWidth + "px",
              transform: "scale(" + scale + ")",
              transformOrigin: "0px 0px"
            }}
          >
            {React.Children.only(children)}
          </div>
        </div>
      </div>
    );
  }
}

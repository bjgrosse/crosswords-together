import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ere from 'element-resize-event';
import ResizeObserver from 'resize-observer-polyfill';


export default class ScaleBox extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentClass: PropTypes.string,
    maxScale: PropTypes.number,
    baseWidth: PropTypes.number
  };

  static defaultProps = {
    wrapperClass: '',
    contentClass: '',
  };

  constructor() {
    super();

    this.state = {
      wrapperSize: { width: 0, height: 0 },
      contentSize: { width: 0, height: 0 },
      scale: 1,
    };
  }

  sizeChanged = new ResizeObserver((entries, observer) => {
    const { wrapper, content } = this.refs;
    const actualContent = content.children[0];


    console.log("content width", actualContent.offsetWidth);
    console.log("wrapper width", wrapper.offsetWidth);


    this.updateState({
      ...this.state,
      contentSize: { width: actualContent.offsetWidth, height: actualContent.offsetHeight },
      wrapperSize: { width: wrapper.offsetWidth , height: wrapper.offsetHeight },
    });
  });

  componentDidMount() {
    const { wrapper, content } = this.refs;
    const actualContent = content.children[0];


    console.log("content width", actualContent.offsetWidth);
    console.log("wrapper width", wrapper.offsetWidth);

    this.sizeChanged.observe(wrapper);
    this.sizeChanged.observe(actualContent);
    // ere(actualContent, () => {
    //   console.log("content width", actualContent.offsetWidth);
    //   this.updateState({
    //     ...this.state,
    //     contentSize: { width: actualContent.offsetWidth, height: actualContent.offsetHeight },
    //   });
    // });

    // ere(wrapper, () => {
    //   console.log("wrapper width", wrapper.offsetWidth);
    //   this.updateState({
    //     ...this.state,
    //     wrapperSize: { width: wrapper.offsetWidth, height: wrapper.offsetHeight },
    //   });
    // });


    this.updateState({
      ...this.state,
      contentSize: { width: actualContent.offsetWidth, height: actualContent.offsetHeight },
      wrapperSize: { width: wrapper.offsetWidth, height: wrapper.offsetHeight },
    });
  }

  componentWillUnmount() {
    this.sizeChanged.disconnect();
  }
  updateState(newState) {
    const { maxScale } = this.props;
    const { wrapperSize, contentSize } = newState;

    let scale = ((wrapperSize.width) / this.props.baseWidth);

    if (Math.abs(scale - this.state.scale) < 0.05 && this.props.baseWidth * this.state.scale < wrapperSize.width) {
      return;
    }

    if (maxScale) {
      scale = Math.min(scale, maxScale);
    }

    this.setState({
      ...newState,
      scale,
    });
  }

  render() {
    const { scale, contentSize } = this.state;
    const { children, wrapperClass, contentClass } = this.props;
    return (
      <div ref="wrapper" className={wrapperClass}>
        <div ref="container" style={{height: this.state.contentSize.height * this.state.scale + 'px'}}>
          <div ref="content" className={contentClass} style={{ width: this.props.baseWidth + 'px', transform: 'scale(' + scale + ')', transformOrigin: '0px 0px', transition: 'transform 0.1s ease 0s' }}>
            {React.Children.only(children)}
          </div>
        </div>
      </div>

    );
  }
}

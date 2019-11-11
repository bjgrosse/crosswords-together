import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ere from 'element-resize-event';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce'

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
    
    
    this.updateState = debounce(this.updateState, 100).bind(this);
  }

  sizeChanged = new ResizeObserver((entries, observer) => {
    const { wrapper, content } = this.refs;
    const actualContent = content.children[0];

    this.updateState({
      ...this.state,
      contentSize: { width: actualContent.offsetWidth, height: actualContent.offsetHeight },
      wrapperSize: { width: wrapper.offsetWidth , height: wrapper.offsetHeight },
    });
  });

  componentDidMount() {
    const { wrapper, content } = this.refs;
    const actualContent = content.children[0];


    this.sizeChanged.observe(wrapper);
    //this.sizeChanged.observe(actualContent);
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
    const minIncrement = 0.05;

    let scale = ((wrapperSize.width- 5) / this.props.baseWidth);

    const increment = Math.abs(this.state.scale - scale);

    if (increment < minIncrement) {
      if (this.props.baseWidth * this.state.scale < wrapperSize.width) {
        return;
      } else {
        scale = this.state.scale - minIncrement 
      }

      //scale = this.state.scale - minIncrement 
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

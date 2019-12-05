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
    this.recentScales = React.createRef()
    this.recentScales.current = []
    this.state = {
      wrapperSize: { width: 0, height: 0 },
      contentSize: { width: 0, height: 0 },
      scale: 1,
    };


    //this.updateScale = debounce(this.updateScale, 10).bind(this);
  }

  sizeChanged = new ResizeObserver(debounce((entries, observer) => {
    this.refreshScale()
  }), 100);

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

    this.refreshScale()
  }

  componentWillUnmount() {
    this.sizeChanged.disconnect();
  }

  refreshScale() {
    let { wrapper, content } = this.refs;
    if (!(wrapper && content)) {
      return 
    }
    let actualContent = content.children[0];


    let contentSize = { width: actualContent.offsetWidth, height: actualContent.offsetHeight }
    let wrapperSize = { width: wrapper.clientWidth, height: wrapper.clientHeight }
    const { maxScale } = this.props;

    let scale = ((wrapperSize.width) / this.props.baseWidth);
    if (maxScale) {
      scale = Math.min(scale, maxScale);
    }

    if (this.recentScales.current.includes(scale) || scale === this.state.scale) {
      return
    }
    
    console.log(scale)
    if (this.recentScales.current.length > 10) { 
      this.recentScales.current.shift()
    }
    this.recentScales.current.push(this.state.scale)

    this.updateScale({contentSize: contentSize, scale: scale})
  }


  updateScale(newState) {
       // // If this preferred scale is going to cause us to overflow the 
    // // parent container in either direction, then we need to make adjustments
    // // for the width of the scroll bar(s) that will be appearing
    // let overY = (this.state.contentSize.height * scale) >= wrapperSize.height
    // let overX = (this.state.contentSize.width * scale) >= wrapperSize.width
    // if (overY || overX) {
    //     // If it's going to overflow height, then we need to account for vertical scroll bar
    //     if (overY && !vscrollVisible) {
    //       scale = ((wrapperSize.width-14) / this.props.baseWidth);
    //     } else if (!hscrollVisible) {          
    //       overY = (this.state.contentSize.height * scale) >= wrapperSize.height-14
    //       if (overY && !vscrollVisible) {
    //         scale = ((wrapperSize.width-14) / this.props.baseWidth);
    //       }
    //     }

    //     overY = (this.state.contentSize.height * scale) >= wrapperSize.height
    //     overX = (this.state.contentSize.width * scale) >= wrapperSize.width
    //    //scale = ((wrapperSize.width-16) / this.props.baseWidth);
    // }

    // const increment = Math.abs(this.state.scale - scale);

    // if (increment < minIncrement) {
    //   if (this.props.baseWidth * this.state.scale <= wrapperSize.width) {
    //     return;
    //   } else {
    //     scale = this.state.scale - minIncrement 
    //   }

    //   //scale = this.state.scale - minIncrement 
    // }

 

    this.setState(newState);
  }

  render() {
    const { scale, contentSize } = this.state;
    const { children, wrapperClass, contentClass } = this.props;
    return (
      <div ref="wrapper" className={wrapperClass}>
        <div ref="container" style={{ height: this.state.contentSize.height * this.state.scale + 'px' }}>
          <div ref="content" className={contentClass} style={{ width: this.props.baseWidth + 'px', transform: 'scale(' + scale + ')', transformOrigin: '0px 0px' }}>
            {React.Children.only(children)}
          </div>
        </div>
      </div>

    );
  }
}

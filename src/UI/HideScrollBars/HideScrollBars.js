import React, { useRef, useState, useEffect } from "react";

const HideScrollBars = React.memo(props => {
  const ref = useRef();
  const [currentStyle, setCurrentstyle] = useState({});

  useEffect(() => {
    setCurrentstyle({ marginRight: "-14px" });
  }, []);

  return (
    <div ref={ref} className={props.className} style={currentStyle}>
      {props.children}
    </div>
  );
});

export default HideScrollBars;

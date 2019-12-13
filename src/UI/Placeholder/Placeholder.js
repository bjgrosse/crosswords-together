import React, { useRef, useEffect, useMemo } from "react";

const Placeholder = React.memo(props => {
  const ref = useRef();

  useEffect(() => {
    if (props.onDomNodeLoaded) {
      props.onDomNodeLoaded(ref.current);
    }

    return () => {
      if (props.onDomNodeUnloaded) {
        props.onDomNodeUnloaded(ref.current);
      }
    };
  });

  return (
    <div key="placeholder" ref={ref}>
      {props.children}
    </div>
  );
});
export default Placeholder;

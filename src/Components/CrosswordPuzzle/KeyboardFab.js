import React from "react";
import Fab from "@material-ui/core/Fab";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import styled from "styled-components";
const StyledFab = styled(Fab)`
  && {
    position: absolute !important;
    right: 20px;
    bottom: 20px;
    z-index: 2;
  }
`;
const KeyboardFab = props => {
  return (
    props.show && (
      <StyledFab
        color="primary"
        size="medium"
        aria-label="keyboard"
        onClick={props.handleClick}
      >
        <KeyboardIcon />
      </StyledFab>
    )
  );
};
export default KeyboardFab;

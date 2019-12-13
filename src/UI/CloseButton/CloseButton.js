import React from "react";
import { IconButton } from "../MaterialComponents/MaterialComponents";

import CloseIcon from "@material-ui/icons/Close";

const component = props => {
  return (
    <IconButton {...props} size={props.size} onClick={props.handleClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default component;

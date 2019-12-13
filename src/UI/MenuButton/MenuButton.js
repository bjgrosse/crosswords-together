import React, { useContext, useState, useRef } from "react";
import Menu from "@material-ui/core/Menu";

const MenuButton = props => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef();
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = event => {
    if (props.onItemClick) {
      props.onItemClick(event);
    }

    if (props.closeOnSelect) {
      handleClose();
    }
  };

  return (
    <>
      {props.renderButton(toggleOpen, anchorRef)}
      <Menu
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        {...props.MenuProps}
      >
        {props.renderMenuItems(handleClick)}
      </Menu>
    </>
  );
};

export default MenuButton;

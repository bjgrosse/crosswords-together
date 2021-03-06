import React, { useState, useRef, useEffect } from "react";

import MenuIcon from "@material-ui/icons/Menu";
import BackIcon from "@material-ui/icons/ArrowBack";

import Menu from "./AppMenu";
import { Div } from "../UI/StyledComponents/StyledComponents";
import { AppBar, AppBarTitle } from "../Theme/AppFrameComponents";
import { IconButton } from "../UI/MaterialComponents/MaterialComponents";

export default function(props) {
  const [state, setState] = useState({ isMenuOpen: false });

  const contentRef = useRef();
  const actionsRef = useRef();

  function goBack() {
    if (props.contextBar && props.contextBar.handleBack) {
      props.contextBar.handleBack();
    } else {
      props.handleBack();
    }
  }
  function closeMenu() {
    setState({ isMenuOpen: false });
  }
  function showMenu() {
    setState({ isMenuOpen: true });
  }

  useEffect(() => {
    if (props.setContentNodeRef && contentRef.current) {
      props.setContentNodeRef(contentRef.current);
    }
    if (props.setActionsNodeRef && actionsRef.current) {
      props.setActionsNodeRef(actionsRef.current);
    }
  });

  // If we're displaying in "contextual mode"
  if (props.config) {
    if (props.config.hideAppBar) {
      return <div />;
    }
    return (
      <div>
        <AppBar position="static">
          {props.config.showMenu && (
            <IconButton size="small" aria-label="menu" onClick={showMenu}>
              <MenuIcon />
            </IconButton>
          )}
          {props.config.showBackButton && (
            <IconButton size="small" aria-label="menu" onClick={goBack}>
              <BackIcon />
            </IconButton>
          )}
          <Div grow ref={contentRef}>
            <AppBarTitle>
              {props.config.textRender !== undefined
                ? props.config.textRender()
                : props.config.text}
            </AppBarTitle>
          </Div>
          <Div flex row ref={actionsRef}></Div>
        </AppBar>

        <Menu
          isOpen={state.isMenuOpen}
          closeMenu={closeMenu}
          menuItems={props.menuItems}
        />
      </div>
    );
  }

  return null;
}

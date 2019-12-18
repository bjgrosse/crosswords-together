import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import ColorLensIcon from "@material-ui/icons/Brush";
import CheckIcon from "@material-ui/icons/Check";
import { colors, playerColors } from "Theme/Colors";
import { IconButton, ColorMenuItem } from "UI/MaterialComponents";
import { Div } from "UI/StyledComponents";
import Avatar from "@material-ui/core/Avatar";
import MenuButton from "UI/MenuButton/MenuButton";
import AppContext from "AppFrame/AppContext";

const ColorButton = styled.div`
  background: radial-gradient(
    ellipse at center,
    ${props => (props.useLightTheme ? "white" : "rgb(51,51,51)")} 0%,
    ${props => props.playerColor} 150%
  );
  border-radius: 2px;
  cursor: pointer;
  align-self: center;
  vertical-align: middle;
`;
const PlayerColorPicker = props => {
  const context = useContext(AppContext);
  const getColor = name => {
    return colors[name][context.appState.useLightTheme ? 300 : 900];
  };

  const handleColorChange = event => {
    let newColor = event.target.id;
    props.player.setColor(newColor);
  };
  return (
    <MenuButton
      closeOnSelect
      onItemClick={handleColorChange}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 200,
            width: 200
          }
        },
        MenuListProps: {
          component: "div",
          style: {
            display: "flex",
            flexFlow: "row wrap"
          }
        }
      }}
      renderButton={(toggleOpen, ref) => (
        <ColorButton
          useLightTheme={context.appState.useLightTheme}
          onClick={toggleOpen}
          playerColor={getColor(props.player.color)}
        >
          <ColorLensIcon
            htmlColor={
              context.appState.useLightTheme
                ? "rgb(51,51,51,.5)"
                : "rgb(255,255,255,.5)"
            }
            fontSize="1.3rem"
            size="small"
            ref={ref}
            style={{ verticalAlign: "middle" }}
          />
        </ColorButton>
      )}
      renderMenuItems={handleClick =>
        Object.keys(playerColors).map(name => (
          <ColorMenuItem
            key={name}
            id={name}
            value={name}
            style={{ width: "12.5%", padding: 0 }}
            itemColor={colors[name][context.appState.useLightTheme ? 300 : 900]}
            onClick={handleClick}
          >
            <CheckIcon
              style={{ pointerEvents: "none" }}
              htmlColor={
                props.player.color === name
                  ? "white"
                  : colors[name][context.appState.useLightTheme ? 300 : 900]
              }
            />
            }
          </ColorMenuItem>
        ))
      }
    />
  );
};
export default PlayerColorPicker;

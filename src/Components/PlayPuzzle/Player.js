import React, { useContext, useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckIcon from "@material-ui/icons/Check";
import PersonIcon from "@material-ui/icons/Person";
import MailIcon from "@material-ui/icons/Mail";
import styled from "styled-components";
import { colors, playerColors } from "Theme/Colors";
import { IconButton, ColorMenuItem } from "UI/MaterialComponents";
import { useTheme } from "@material-ui/core/styles";
import AppContext from "AppFrame/AppContext";
import MenuItem from "@material-ui/core/MenuItem";
import MenuButton from "UI/MenuButton/MenuButton";

const Action = styled(ListItemSecondaryAction)`
    display: block;
    opacity: 0
    transition: opacity .3s cubic-bezier(0.0, 0.0, 0.2, 1);
    &:hover  {
        opacity: 1
 }
`;
const Item = styled(ListItem)`
  &:hover + ${Action} {
    display: block;
    opacity: 1;
  }
`;

const MyAvatar = styled(Avatar)`
  && {
    margin-right: ${props => props.theme.spacing(1)}px;
    width: 24px;
    height: 24px;
    background: ${props => props.color};
  }
`;

const Text = styled(ListItemText)`
  font-style: ${props => (props.pending ? "italic" : undefined)};
  color: ${p => p.theme.palette.text.primary};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const Player = props => {
  const getColor = name => {
    return colors[name][context.appState.useLightTheme ? 300 : 900];
  };
  const theme = useTheme();
  const context = useContext(AppContext);
  const [color, setColor] = useState(props.player.color);
  const handleColorChange = event => {
    let newColor = event.target.id;
    setColor(newColor);
    props.player.setColor(newColor);
  };
  return (
    <Item dense>
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
          <MyAvatar color={getColor(color)} onClick={toggleOpen}>
            {props.player.pending ? (
              <MailIcon size="small" ref={ref} />
            ) : (
              <PersonIcon
                htmlColor={
                  context.appState.useLightTheme
                    ? "white"
                    : theme.palette.primary.dark
                }
                size="small"
                ref={ref}
              />
            )}
          </MyAvatar>
        )}
        renderMenuItems={handleClick =>
          Object.keys(playerColors).map(name => (
            <ColorMenuItem
              key={name}
              id={name}
              value={name}
              style={{ width: "12.5%", padding: 0 }}
              itemColor={
                colors[name][context.appState.useLightTheme ? 300 : 900]
              }
              onClick={handleClick}
            >
              <CheckIcon
                style={{ pointerEvents: "none" }}
                htmlColor={
                  color === name
                    ? "white"
                    : colors[name][context.appState.useLightTheme ? 300 : 900]
                }
              />
              }
            </ColorMenuItem>
          ))
        }
      />
      <Text {...props} title={props.player.name}>
        {props.player.name}
      </Text>
      {/* 
      {(props.player.isCurrentUser || props.puzzle.canManagePlayers) && (
        <Action>
          <IconButton size="small" edge="end" aria-label="delete">
            <MenuIcon />
          </IconButton>
        </Action>
      )} */}
    </Item>
  );
};
export default Player;

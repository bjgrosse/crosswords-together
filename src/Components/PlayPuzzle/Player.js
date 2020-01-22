import React, { useContext } from "react";
import { observer } from "mobx-react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import PersonIcon from "@material-ui/icons/Person";
import MailIcon from "@material-ui/icons/Mail";
import styled from "styled-components";
import { colors } from "Theme/Colors";
import { useTheme } from "@material-ui/core/styles";
import AppContext from "AppFrame/AppContext";

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
const Player = observer(props => {
  const getColor = name => {
    return colors[name][context.appState.useLightTheme ? 300 : 900];
  };
  const theme = useTheme();
  const context = useContext(AppContext);

  return (
    <Item dense>
      <MyAvatar color={getColor(props.player.color)}>
        {props.player.pending ? (
          <MailIcon size="small" />
        ) : (
          <PersonIcon
            htmlColor={
              context.appState.useLightTheme
                ? "white"
                : theme.palette.primary.dark
            }
            size="small"
          />
        )}
      </MyAvatar>
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
});
export default Player;

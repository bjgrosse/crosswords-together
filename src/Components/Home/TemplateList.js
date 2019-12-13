import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/OpenInBrowser";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Typography from "@material-ui/core/Typography";
import { observer } from "mobx-react";
import { Div, Paper, SubTitle1 } from "UI/StyledComponents/StyledComponents";
import CreateNewTemplate from "../EditTemplate/CreateNewTemplate";
import { levelColors } from "Theme/Colors";
import { Avatar } from "UI/MaterialComponents/MaterialComponents";
import styled from "styled-components";

const LevelLabel = styled.span`
  background: ${p => levelColors[p.level][100]};
  color: ${p => levelColors[p.level][600]};
  border-radius: 10px;
  font-style: italic;
  margin-left: 8px;
  padding-left: 6px;
  padding-right: 6px;
  font-size: 0.9rem;
`;
const TemplateListItem = props => {
  const history = useHistory();
  function navigateTo(path) {
    history.push(path);
  }

  return (
    <ListItem
      button
      alignItems="flex-start"
      onClick={() => navigateTo(`/start-puzzle/${props.id}`)}
    >
      <ListItemAvatar>
        <Avatar
          bgcolor={levelColors[props.level][200]}
          color={levelColors[props.level][800]}
        >
          <Div fontSize=".9rem" fontWeight="bold">
            {props.size}
          </Div>
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Div flex alignStart>
            <Div grow fontWeight="Bold" variant="body" color="text.primary">
              {props.title}
            </Div>
            <LevelLabel level={props.level}>{props.level}</LevelLabel>
          </Div>
        }
        secondary={
          <React.Fragment>
            <Typography component="span" variant="body2" color="textPrimary">
              {props.source}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
};

export default observer(props => {
  const [showCreateNew, setShowCreateNew] = useState(false);

  const history = useHistory();

  if (showCreateNew) {
    return <CreateNewTemplate handleCancel={() => setShowCreateNew(false)} />;
  }

  return (
    <Div>
      <Div flex alignCenter mt={1} mb={0.5}>
        <Div grow>
          <SubTitle1 mt={0} mb={0}>
            {props.templates.length === 0
              ? "No matching puzzles found"
              : props.templates.length +
                " puzzle" +
                (props.templates.length > 1 ? "s" : "") +
                " found"}
          </SubTitle1>
        </Div>
        <Button startIcon={<AddIcon />} onClick={() => setShowCreateNew(true)}>
          Create
        </Button>
      </Div>
      <Paper>
        <List component="nav" aria-labelledby="nested-list-subheader">
          {props.templates.map((item, index) => [
            <TemplateListItem key={item.id} {...item} />,
            index < props.templates.length - 1 && (
              <Divider key={index} component="li" />
            )
          ])}
        </List>
      </Paper>
    </Div>
  );
});

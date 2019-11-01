import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import LoadingContainer from '../AppFrame/LoadingContainer';
import CircularProgress from '@material-ui/core/CircularProgress';

import db from '../Database/Database'
import "./PuzzleList.css";

export default function (props) {

  const [myPuzzles, setMyPuzzles] = useState(null);

  const loadPuzzles = () => {
     return db.getMyPuzzles().then(puzzles => {
       console.log(puzzles);
      setMyPuzzles(puzzles)
     } );
  }

  
  const history = useHistory();
  function navigateTo(path) {
      history.push(path);
  }
  
  return (

    <LoadingContainer provideWorkPromise={loadPuzzles}>
      <ListItem button className="AddButton">
        <ListItemAvatar>
          <Avatar>
            <AddIcon  size="large" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Start a new puzzle..."
        />
      </ListItem>
      <Divider component="div" />

      {myPuzzles &&
        <List
          component="nav"
          aria-labelledby="nested-list-subheader" subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <Typography variant="h5" gutterBottom color="primary">My puzzles...</Typography>
            </ListSubheader>
          }>
          {myPuzzles.map(item => (
            <>
              <ListItem button alignItems="flex-start" onClick={() => navigateTo(`/puzzle/${item.id}`)}>
                <ListItemAvatar>

                  <CircularProgress variant="static" value={75} />
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {item.players.map(user => user.displayName).join(", ")}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          ))}
        </List>
      }

    </LoadingContainer>
  )
}
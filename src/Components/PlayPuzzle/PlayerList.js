import React from "react";
import { observer } from "mobx-react";
import Divider from "@material-ui/core/Divider";
import Player from "./Player";
import AddPlayer from "./AddPlayer";
import AddIcon from "@material-ui/icons/AddCircle";
import List from "@material-ui/core/List";
import { Button } from "UI/MaterialComponents";
import { Div } from "UI/StyledComponents";

const PlayerList = observer(props => {
  const [state, setState] = React.useState({
    addPlayerOpen: false
  });

  const addPlayer = () => {
    setState({ addPlayerOpen: true });
  };

  const handleClose = () => {
    setState({ addPlayerOpen: false });
  };
  return (
    <>
      <List disablePadding>
        {props.puzzle.players.map(x => (
          <Player key={x.id} player={x} puzzle={props.puzzle} />
        ))}
        {props.puzzle.canInvitePlayers && (
          <>
            <Divider />
            <Div p={1}>
              <Button
                fullWidth
                onClick={addPlayer}
                variant="contained"
                color="secondary"
                startIcon={<AddIcon htmlColor="text.secondary" size="small" />}
              >
                Invite friends
              </Button>
            </Div>
          </>
        )}
      </List>
      <AddPlayer
        puzzle={props.puzzle}
        open={state.addPlayerOpen}
        handleClose={handleClose}
      />
    </>
  );
});

export default PlayerList;

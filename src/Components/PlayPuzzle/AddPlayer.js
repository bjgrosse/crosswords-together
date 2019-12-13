import React, { useContext, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AppDialog from "AppFrame/AppDialog";
import LoadingContainer from "AppFrame/LoadingContainer";
import CopyIcon from "@material-ui/icons/FileCopy";
import useSafeHandler from "Utility/useSafeHandler";
import { IconButton } from "UI/MaterialComponents";
import { Div } from "UI/StyledComponents";
import * as clipboard from "clipboard-polyfill";

const AddPlayer = props => {
  const [link, setLink] = useState();
  const [linkCopied, setLinkCopied] = useState();

  const handleClose = () => {
    props.handleClose();
  };

  const handleCopy = useSafeHandler(async () => {
    clipboard.writeText(link).then(() => setLinkCopied(true));
  });

  const getLinkId = () => {
    return props.puzzle.getInviteLink().then(link => {
      setLink("https://crosswordstogether.com/i/" + link);
    });
  };

  return (
    <AppDialog
      open={props.open}
      handleCancel={handleClose}
      aria-labelledby="form-dialog-title"
      text="Copy this link and send it to your friends"
      actions={
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      }
    >
      <LoadingContainer
        provideWorkPromise={getLinkId}
        message="Generating invitation..."
      >
        <Div fullWidth flex>
          <Div grow>
            <TextField
              autoFocus
              margin="dense"
              id="link"
              type="text"
              fullWidth
              value={link}
              helperText={linkCopied ? "Link copied" : null}
            />
          </Div>
          <Div>
            <IconButton onClick={handleCopy}>
              <CopyIcon color="secondary" />
            </IconButton>
          </Div>
        </Div>
      </LoadingContainer>
    </AppDialog>
  );
};

export default AddPlayer;

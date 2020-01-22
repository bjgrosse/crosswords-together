import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "./AppBar";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import useSafeHandler from "Utility/useSafeHandler";
const AppDialog = props => {
  const { open } = props;
  const history = useHistory();
  const isOpen = useRef(props.open);

  const handleCancel = useSafeHandler(() => {
    props.handleCancel();
  });

  useEffect(() => {
    if (open) {
      isOpen.current = true;
      window.history.pushState({}, null, null);
      window.onpopstate = e => {
        if (isOpen.current) {
          isOpen.current = false;
          handleCancel();
        }
      };
    }
  }, [open, handleCancel]);

  const handleExit = useSafeHandler(() => {
    if (isOpen.current) {
      history.goBack();
    }
  });

  return (
    <Dialog
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={handleCancel}
      onExit={handleExit}
      aria-labelledby="dialog-title"
    >
      {props.title && (
        <DialogTitle id="dialog-title">{props.title}</DialogTitle>
      )}

      {props.fullScreen && <AppBar contextBar={props.contextBar} />}

      <DialogContent>
        {props.text && <DialogContentText>{props.text}</DialogContentText>}
        {props.children}
      </DialogContent>
      {(!props.hideActions || props.actions !== undefined) && (
        <DialogActions>
          {props.actions ? (
            props.actions
          ) : (
            <>
              <Button color="primary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button color="primary" onClick={props.handleSave}>
                {props.saveText || "Save"}
              </Button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
export default AppDialog;

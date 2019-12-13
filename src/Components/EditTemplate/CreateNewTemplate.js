import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react";
import SetDimensionsDialog from "./SetDimensionsDialog";

const CreateNewTemplate = observer(props => {
  const [dialogOpen, setDialogOpen] = useState(true);
  const history = useHistory();

  function handleSaveDimensions(rows, columns) {
    history.push(`/new-template/${rows}/${columns}`);
    setDialogOpen(false);
  }

  function handleCancel() {
    setDialogOpen(false);
    props.handleCancel();
  }

  // if (dimensions) {
  //     return (
  //         <AppDialog contextBar={contextBar}>
  //             <EditTemplate rows={dimensions[0]} columns={dimensions[1]} />
  //         </AppDialog>
  //     )
  // }

  return (
    <div>
      <SetDimensionsDialog
        open={dialogOpen}
        handleSave={handleSaveDimensions}
        handleCancel={handleCancel}
      />
    </div>
  );
});
export default CreateNewTemplate;

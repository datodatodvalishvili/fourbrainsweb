import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

export default function Confirmation({ open, setOpen,successCallback }) {

  const handleSuccess = () => {
    handleClose();
    successCallback();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography variant="h5">
            Are you sure you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleSuccess}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

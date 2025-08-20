import React from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

const DeleteConfirmDialog = ({ open = false, onClose, onConfirm, fileKey }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="delete-confirmation-description"
        className="border-2 border-black dark:border-white rounded-none"
      >
        <DialogHeader>
          <DialogTitle className="text-lg text-black dark:text-white">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-black dark:text-white">
            This action cannot be undone. It will permanently delete your file.
          </DialogDescription>
        </DialogHeader>

        <p
          id="delete-confirmation-description"
          className="text-sm text-gray-800 dark:text-gray-200"
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold break-all">"{fileKey}"</span>?
        </p>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            className="border border-black dark:border-white rounded-sm"
            onClick={() => {
              onConfirm();
              onClose(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;

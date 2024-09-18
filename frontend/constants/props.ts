import { UseConfirmTypes } from "@/hooks/use-confirm";

export const deleteNodeDialogProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message:
    "This action cannot be undone. This will delete your node, but you can add a new node later.",
  confirmButtonLabel: "Yes, delete node",
  type: "alert",
};

export const exitWorkflowProps: UseConfirmTypes = {
  title: "Are you absolutely sure?",
  message:
    "This action cannot be undone. Make sure you save the workflow before exiting",
  confirmButtonLabel: "Yes, exit",
  type: "alert",
};


export const fileUploadProps: UseConfirmTypes = {
  title: "Upload File and execute workflow?",
  message: "You have to upload 1 csv file to execute workflow",
  confirmButtonLabel: "Yes, Execute",
  type: "default",
};

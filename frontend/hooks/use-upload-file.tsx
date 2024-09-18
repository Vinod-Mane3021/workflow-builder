import { FileCard } from "@/components/file-card";
import { FileUploader } from "@/components/file-uploader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type UseConfirmTypes = {
  title?: string;
  message: string;
  confirmButtonLabel?: string;
  type?: "default" | "alert";
};

type UseConfirmReturnType = [() => JSX.Element, () => Promise<File>];

type PromiseType = { resolve: (value: File) => void } | null;

export const useUploadFile = ({
  title = "Are you absolutely sure?",
  message,
  confirmButtonLabel = "Confirm",
  type,
}: UseConfirmTypes): UseConfirmReturnType => {
  const [promise, setPromise] = useState<PromiseType>(null);
  const [files, setFiles] = useState<File[] | null>([]);
  const [error, setError] = useState("");

  const confirm = (): Promise<File> => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
    setFiles(null);
    setError("");
  };

  const handleConfirm = () => {
    if (files && files.length > 0) {
      promise?.resolve(files[0]);
      handleClose();
    } else {
      setError("File not uploaded");
    }
  };

  const handleCancel = () => {
    // promise?.resolve(null);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <AlertDialog open={promise !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="w-full">
              {(!files || files.length == 0) && (
                <FileUploader
                  maxSize={4 * 1024 * 1024}
                  onValueChange={setFiles}
                />
              )}
              {files && files.length > 0 && (
                <FileCard file={files[0]} onRemove={() => setFiles(null)} />
              )}
              {error && <p>{error}</p>}

              <div className="w-full flex gap-x-2 self-center bg-green-700 pt-6">
                <Button
                  className="w-full"
                  onClick={handleCancel}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  onClick={handleConfirm}
                  variant={type}
                >
                  {confirmButtonLabel}
                </Button>
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return [ConfirmationDialog, confirm];
};

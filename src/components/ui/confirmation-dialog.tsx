import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./alert-dialog";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extraContent?: React.ReactNode;
};

export const ConfirmationDialog = ({
  title,
  description,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  extraContent,
}: ConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {extraContent}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

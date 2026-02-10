import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormFormFields } from "../form/FormFormFields";
import { FormFields } from "@repo/types";

interface DialogFormFieldsProps {
  open: boolean;
  setOpen: () => void;
  initialData?: FormFields;
  onSubmit?: (data: FormFields) => void;
}

export function DialogFormFields({
  open,
  setOpen,
  initialData,
  onSubmit,
}: DialogFormFieldsProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit" : "Create"} Form Field
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update" : "Create new"} form field
          </DialogDescription>
        </DialogHeader>
        <FormFormFields
          initialData={initialData}
          onSubmit={onSubmit}
          id={initialData?.id}
        />
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCategories } from "../form/formCategories";
import { CategoriesRequest } from "@repo/types";

interface CategoriesDialogProps {
  onSubmit: (req: CategoriesRequest) => void;
  isPending: boolean;
}

export function CategoriesDialog({
  isPending,
  onSubmit,
}: CategoriesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Categories</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Categories</DialogTitle>
          <DialogDescription>Create Variant Categories</DialogDescription>
        </DialogHeader>
        <FormCategories isPending={isPending} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

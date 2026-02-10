import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { FormFields } from "@repo/types";
import { Ellipsis, Loader2 } from "lucide-react";
import { DialogFormFields } from "./DialogFormFields";

interface FormFieldsTableProps {
  formFields?: FormFields[];
  onUpdate: (data: FormFields) => void;
  onDelete: (id: number) => void;
  pendingId?: number;
}

export function FormFieldsTable({
  formFields,
  onUpdate,
  onDelete,
  pendingId,
}: FormFieldsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [dataFormFields, setDataFormFields] = useState<FormFields | null>(null);

  if (!formFields) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (formFields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No form fields available
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleEdit = (formFields: FormFields) => {
    setDataFormFields(formFields);
    setOpen(true);
  };

  const handleUpdateSubmit = (updatedData: FormFields) => {
    onUpdate(updatedData);
    setOpen(false);
    setDataFormFields(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Options</TableHead>
            {formFields.some((field) => field.product_name) && (
              <TableHead>Product</TableHead>
            )}
            <TableHead className="w-[70px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formFields.map((field) => {
            const isLoading = pendingId === field.id;

            return (
              <TableRow
                key={field.id}
                className={isLoading ? "opacity-50" : ""}
              >
                <TableCell className="tabular-nums">
                  {field.order ?? "-"}
                </TableCell>
                <TableCell className="font-medium">{field.label}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{field.type}</Badge>
                </TableCell>
                <TableCell>
                  {field.value ? (
                    <span>{field.value}</span>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No value
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {field.values_option ? (
                    <span className="text-sm">{field.values_option}</span>
                  ) : (
                    <span className="text-muted-foreground italic">-</span>
                  )}
                </TableCell>
                {formFields.some((f) => f.product_name) && (
                  <TableCell>{field.product_name || "-"}</TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={isLoading}
                      className="hover:bg-accent rounded-md p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Ellipsis className="size-5" />
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEdit(field)}
                        disabled={isLoading}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(field.id)}
                        disabled={isLoading}
                        className="text-destructive focus:text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {open && dataFormFields && (
        <DialogFormFields
          open={open}
          setOpen={() => setOpen(false)}
          initialData={dataFormFields}
          onSubmit={handleUpdateSubmit}
        />
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete form field?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              form field.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

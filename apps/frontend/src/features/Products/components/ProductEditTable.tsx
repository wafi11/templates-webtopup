import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/utils/FormatTimestamp";
import { Product } from "@repo/types";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

interface ProductEditTableProps {
  item: Product;
  onSave: (item: Product) => void;
  onDelete: (id: number) => void;
  savePending: boolean;
  deletedPending: boolean;
}

export function ProductEditTable({
  item,
  deletedPending,
  onDelete,
  onSave,
  savePending,
}: ProductEditTableProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Product>(item);

  const isPending = savePending || deletedPending;

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(item);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(item);
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      onDelete(item.id);
    }
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell className="font-mono text-sm">{item.id}</TableCell>
        <TableCell>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="h-8"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.sub_name || ""}
            onChange={(e) =>
              setEditData({ ...editData, sub_name: e.target.value || null })
            }
            className="h-8"
            placeholder="Sub Name"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.code || ""}
            onChange={(e) =>
              setEditData({ ...editData, code: e.target.value || null })
            }
            className="h-8"
            placeholder="Code"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Input
            value={editData.slug}
            onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
            className="h-8"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Textarea
            value={editData.description || ""}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value || null })
            }
            className="h-16 min-h-8"
            placeholder="Description"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editData.order}
            onChange={(e) =>
              setEditData({ ...editData, order: parseInt(e.target.value) || 0 })
            }
            className="h-8 w-20"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Switch
            checked={editData.is_active}
            onCheckedChange={(checked) =>
              setEditData({ ...editData, is_active: checked })
            }
            disabled={isPending}
          />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(item.created_at)}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(item.updated_at)}
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="h-8"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-mono text-sm">{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.sub_name ?? "-"}</TableCell>
      <TableCell>{item.code ?? "-"}</TableCell>
      <TableCell className="max-w-32 truncate">{item.slug}</TableCell>
      <TableCell className="max-w-48 truncate">
        {item.description ?? "-"}
      </TableCell>
      <TableCell>{item.order}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            item.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(item.created_at)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(item.updated_at)}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEdit}
            disabled={isPending}
            className="h-8"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="h-8"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

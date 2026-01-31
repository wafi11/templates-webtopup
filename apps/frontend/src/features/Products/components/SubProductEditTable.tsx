import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/FormatTimestamp";
import { SubProduct } from "@repo/types";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

interface SubProductEditTableProps {
  item: SubProduct;
  onSave: (item: SubProduct) => void;
  onDelete: (id: number) => void;
  savePending: boolean;
  deletedPending: boolean;
}

export function SubProductEditTable({
  item,
  deletedPending,
  onDelete,
  onSave,
  savePending,
}: SubProductEditTableProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<SubProduct>(item);

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
    if (window.confirm("Apakah Anda yakin ingin menghapus sub produk ini?")) {
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
            value={editData.icon || ""}
            onChange={(e) =>
              setEditData({ ...editData, icon: e.target.value || null })
            }
            className="h-8"
            placeholder="Icon URL"
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
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{item.code ?? "-"}</TableCell>
      <TableCell>
        {item.icon ? (
          <div className="flex items-center gap-2">
            <img
              src={item.icon}
              alt={item.name}
              className="w-8 h-8 rounded object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <span className="hidden text-xs text-muted-foreground truncate max-w-[100px]">
              {item.icon}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>{item.order}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            item.is_active
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
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

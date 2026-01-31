import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/utils/FormatTimestamp";
import { Categories } from "@repo/types";
import { useState } from "react";
import { Pencil, Save, X, Trash2 } from "lucide-react";

interface CategoriesEditTableProps {
  item: Categories;
  onSave: (data: Categories) => void;
  onDelete: (id: number) => void;
  isPending?: boolean;
}

export function CategoriesEditTable({
  item,
  onSave,
  onDelete,
  isPending = false,
}: CategoriesEditTableProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Categories>(item);

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
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      onDelete(item.id);
    }
  };

  if (isEditing) {
    return (
      <>
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
            value={editData.icon || ""}
            onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
            className="h-8 "
            placeholder="Icon"
            disabled={isPending}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editData.order}
            onChange={(e) =>
              setEditData({ ...editData, order: parseInt(e.target.value) })
            }
            className="h-8 "
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
      </>
    );
  }

  return (
    <>
      <TableCell className="font-mono text-sm">{item.id}</TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>
        {item.icon ? (
          <span className="text-2xl">{item.icon}</span>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>{item.order}</TableCell>
      <TableCell>
        <Badge variant={item.is_active ? "default" : "secondary"}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
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
    </>
  );
}

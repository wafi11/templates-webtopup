import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/utils/FormatTimestamp";
import { ProductItems } from "@repo/types";
import { Check, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface ProductItemEditTableProps {
  item: ProductItems;
  onSave: (item: ProductItems) => void;
  onDelete: (id: number) => void;
  savePending: boolean;
  deletePending: boolean;
}

export function ProductItemEditTable({
  item,
  onSave,
  onDelete,
  savePending,
  deletePending,
}: ProductItemEditTableProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<ProductItems>(item);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedItem(item);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(item);
  };

  const handleSave = () => {
    onSave(editedItem);
    setIsEditing(false);
  };

  const updateField = (
    field: keyof ProductItems,
    value: string | number | null | boolean,
  ) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isEditing) {
    return (
      <TableRow key={item.id} className="bg-muted/50">
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell>
          <Input
            value={editedItem.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedItem.code || ""}
            onChange={(e) => updateField("code", e.target.value)}
            className="h-8"
            placeholder="Kode"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editedItem.sub_product_id}
            onChange={(e) =>
              updateField("sub_product_id", Number(e.target.value))
            }
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editedItem.base_price}
            onChange={(e) => updateField("base_price", Number(e.target.value))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editedItem.discount_price || ""}
            onChange={(e) =>
              updateField(
                "discount_price",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="h-8"
            placeholder="Diskon"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editedItem.stock}
            onChange={(e) => updateField("stock", Number(e.target.value))}
            className="h-8"
          />
        </TableCell>
        <TableCell>
          <Switch
            checked={editedItem.is_best_seller}
            onCheckedChange={(checked) =>
              updateField("is_best_seller", checked)
            }
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            value={editedItem.order}
            onChange={(e) => updateField("order", Number(e.target.value))}
            className="h-8 w-20"
          />
        </TableCell>
        <TableCell>
          <Switch
            checked={editedItem.is_active}
            onCheckedChange={(checked) => updateField("is_active", checked)}
          />
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(item.created_at)}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {formatDate(item.updated_at)}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={savePending}
            >
              {savePending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={savePending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.code || "-"}</TableCell>
      <TableCell>{item.sub_product_id}</TableCell>
      <TableCell>{formatPrice(item.base_price)}</TableCell>
      <TableCell>{formatPrice(item.discount_price)}</TableCell>
      <TableCell>{item.stock}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            item.is_best_seller
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.is_best_seller ? "Ya" : "Tidak"}
        </span>
      </TableCell>
      <TableCell>{item.order}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            item.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(item.created_at)}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(item.updated_at)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={savePending || deletePending}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item.id)}
            disabled={deletePending || savePending}
          >
            {deletePending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

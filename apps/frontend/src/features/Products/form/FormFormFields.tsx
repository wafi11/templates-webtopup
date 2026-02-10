import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFields, RequestFormField } from "@repo/types";
import { useForm } from "react-hook-form";
import { useSearchProducts } from "../api/ProductApi";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateFormFields } from "../api/FormFieldsApi";
import { Textarea } from "@/components/ui/textarea";
import { ProductFilter } from "../components/ProductFilter";

const FIELD_TYPES = [
  { value: "input", label: "Input" },
  { value: "select", label: "Select" },
] as const;

interface FormFormFieldsProps {
  initialData?: FormFields;
  id?: number;
  onSubmit?: (data: FormFields) => void;
}

export function FormFormFields({
  initialData,
  onSubmit: handleSubmits,
  id,
}: FormFormFieldsProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(
    initialData?.product_id
      ? {
          id: initialData.product_id,
          name: initialData.product_name || "",
        }
      : null,
  );

  const debounceSearch = useDebounce(search, 500);
  const { mutate, isPending } = useCreateFormFields();

  const form = useForm<RequestFormField>({
    defaultValues: {
      label: initialData?.label ?? "",
      order: initialData?.order ?? 0,
      productId: initialData?.product_id ?? 0,
      type: initialData?.type ?? "",
      value: initialData?.value ?? "",
      valuesOption: initialData?.values_option ?? "",
    },
  });

  // Watch the type field to show/hide valuesOption
  const watchType = form.watch("type");

  const handleProductSelect = (product: { id: number; name: string }) => {
    form.setValue("productId", product.id);
    setSelectedProduct(product);
  };
  const onSubmit = (values: RequestFormField) => {
    console.log(values);
    if (initialData && handleSubmits) {
      handleSubmits({
        id: id as number,
        label: values.label,
        order: values.order,
        product_id: values.productId,
        type: values.type,
        value: values.value,
        values_option: values.valuesOption,
      });
    } else {
      mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Product Search Field */}
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Product</FormLabel>
              <ProductFilter
                open={open}
                setOpen={setOpen}
                value={field.value}
                onSelect={handleProductSelect}
              >
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedProduct?.name || "Select product..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </ProductFilter>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Label Field */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Enter label" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type Field - SELECT */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field Value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={"game_id"}>Game Id</SelectItem>
                  <SelectItem value={"server_id"}>Server Id</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Values Option - Only show when type is "select" */}
        {watchType === "select" && (
          <FormField
            control={form.control}
            name="valuesOption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Options (comma separated)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Option 1, Option 2, Option 3"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  Enter options separated by commas
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Order Field */}
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter order"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

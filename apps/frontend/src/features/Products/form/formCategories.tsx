import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Categories,
  CategoriesRequest,
  CategoryRequest,
  validationCategories,
} from "@repo/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormCategoriesProps {
  initialData?: Categories;
  onSubmit: (data: CategoriesRequest) => void;
  isPending: boolean;
}

export function FormCategories({
  initialData,
  onSubmit,
  isPending,
}: FormCategoriesProps) {
  const form = useForm<CategoriesRequest>({
    resolver: zodResolver(validationCategories),
    defaultValues: {
      icon: initialData?.icon || "",
      is_active: initialData?.is_active ?? true,
      name: initialData?.name || "",
      order: initialData?.order || 1,
    },
  });

  const handleSubmit = (values: CategoryRequest) => {
    onSubmit(values as CategoriesRequest);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter icon name or URL"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable or disable this category
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? "Saving..."
            : initialData
              ? "Update Category"
              : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}

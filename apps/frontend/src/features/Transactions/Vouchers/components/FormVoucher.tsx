import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CALCULATION_TYPE, RequestVoucher } from "@repo/types";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FormVoucherProps {
  defaultValues?: Partial<RequestVoucher>;
  onSubmit: (data: RequestVoucher) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function FormVoucher({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Create Voucher",
}: FormVoucherProps) {
  const form = useForm<RequestVoucher>({
    defaultValues: defaultValues || {
      calculationType: CALCULATION_TYPE.FIXED,
      code: "",
      currentUsage: 0,
      description: "",
      endAt: new Date(),
      marginAmount: 0,
      marginPercentage: "0",
      maxUsage: 0,
      maxUsagePerUser: 1,
      name: "",
      onlyProduct: false,
      productIds: JSON.stringify([]),
      startedAt: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter voucher name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SUMMER2024"
                    className="uppercase font-mono"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                </FormControl>
                <FormDescription>
                  Unique code that customers will use
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe this voucher..."
                    className="resize-none"
                    rows={3}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Discount Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Discount Settings</h3>

          <FormField
            control={form.control}
            name="calculationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calculation Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CALCULATION_TYPE.FIXED}>
                      Fixed Amount
                    </SelectItem>
                    <SelectItem value={CALCULATION_TYPE.PERCENTAGE}>
                      Percentage
                    </SelectItem>
                    <SelectItem value={CALCULATION_TYPE.HYBRID}>
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="marginAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Margin Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marginPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Margin Percentage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Usage Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Usage Limits</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Total Usage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0 = unlimited"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Total times this voucher can be used
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxUsagePerUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Usage Per User</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Times each user can use this voucher
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="currentUsage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Usage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Read-only: Times this voucher has been used
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Validity Period */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Validity Period</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startedAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Product Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Product Settings</h3>

          <FormField
            control={form.control}
            name="onlyProduct"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Product Specific</FormLabel>
                  <FormDescription>
                    Only apply this voucher to specific products
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product IDs (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='["product-1", "product-2"]'
                    className="resize-none font-mono text-sm"
                    rows={3}
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  JSON array of product IDs this voucher applies to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}

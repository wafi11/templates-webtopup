import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { useSearchProducts } from "../api/ProductApi";

interface ProductFilterProps {
  children: ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  value?: number; // selected product id
  onSelect: (product: { id: number; name: string }) => void;
}

export function ProductFilter({
  children,
  open,
  setOpen,
  value,
  onSelect,
}: ProductFilterProps) {
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchProducts(debounceSearch, 500);
  const allProducts = data?.pages.flatMap((page) => page.data.data) ?? [];

  const handleSelect = (product: { id: number; name: string }) => {
    onSelect(product);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {allProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {product.name}
                </CommandItem>
              ))}

              {hasNextPage && (
                <CommandItem
                  onSelect={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="justify-center text-sm text-muted-foreground"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more..."}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

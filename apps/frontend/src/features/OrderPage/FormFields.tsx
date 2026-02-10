import { useDebounce } from "@/hooks/useDebounce";
import { SectionContainer } from "./SectionContainer";
import { useCheckNickname } from "@/hooks/useCheckNickname";
import { useEffect, useState } from "react";
import { InfoIcon, Loader2 } from "lucide-react";
import { useFindAllFormFields } from "../Products/api/FormFieldsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGridCols } from "@/utils/initials";

interface FormFieldsContainerProps {
  gameId: string;
  productId: number;
  setGameId: (gameId: string) => void;
  zoneId?: string;
  setNickname: (nickname: string) => void;
  setZoneId: (zoneId: string) => void;
}

export function FormFieldsContainer({
  gameId,
  setGameId,
  setZoneId,
  zoneId,
  setNickname,
  productId,
}: FormFieldsContainerProps) {
  const debounceGameId = useDebounce(gameId, 500);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data, isLoading } = useFindAllFormFields(
    {
      limit: 100,
      offset: 0,
      search: "",
    },
    {
      product_id: productId,
    },
  );

  const formFields = data?.data ?? [];

  const checknickname = useCheckNickname({
    game: productId.toString(),
    gameId: debounceGameId,
    server: zoneId,
  });

  useEffect(() => {
    if (debounceGameId && debounceGameId.trim() !== "") {
      checknickname.mutate(undefined, {
        onSuccess: (ctx) => {
          setNickname(ctx?.name ?? "");
        },
      });
    }
  }, [debounceGameId, zoneId]);

  // Handle form field change
  const handleFieldChange = (fieldValue: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldValue]: value }));

    // Update parent state based on field value
    if (fieldValue === "game_id") {
      setGameId(value);
    } else if (fieldValue === "server_id") {
      setZoneId(value);
    }
  };

  // Render input field
  const renderInputField = (field: any) => (
    <div key={field.id}>
      <div className="flex items-center gap-2 pb-2">
        <label
          htmlFor={field.value}
          className="block text-xs font-medium text-foreground"
        >
          {field.label}
        </label>
        <div className="cursor-pointer">
          <InfoIcon size={10} />
        </div>
      </div>
      <div className="relative flex w-full items-center gap-2">
        <div className="flex w-full flex-col items-start">
          <input
            className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground placeholder-muted-foreground/50
             focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
            type="text"
            id={field.value}
            name={field.value}
            placeholder={`${field.label}`}
            autoComplete="off"
            value={formValues[field.value] || ""}
            onChange={(e) => handleFieldChange(field.value, e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Render select field
  const renderSelectField = (field: any) => {
    // Parse options dari string JSON
    let options: string[] = [];
    try {
      const parsed = JSON.parse(field.values_option);
      options = Array.isArray(parsed) ? parsed : [];
    } catch {
      // Jika bukan JSON, split by comma
      options = field.values_option
        ? field.values_option.split(",").map((opt: string) => opt.trim())
        : [];
    }

    return (
      <div key={field.id}>
        <div className="flex items-center gap-2 pb-2">
          <label
            htmlFor={field.value}
            className="block text-xs font-medium text-foreground"
          >
            {field.label}
          </label>
        </div>
        <Select
          value={formValues[field.value] || ""}
          onValueChange={(value) => handleFieldChange(field.value, value)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder={`Pilih ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option} className="text-xs">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  if (isLoading) {
    return (
      <SectionContainer id={1} title="Masukkan Data Akun">
        <div className="p-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={1} title="Masukkan Data Akun">
      <div className="p-4">
        <div className="space-y-4">
          <div className={`grid ${getGridCols(formFields.length)} gap-4`}>
            {formFields
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((field) => {
                if (field.type === "input") {
                  return renderInputField(field);
                } else if (field.type === "select") {
                  return renderSelectField(field);
                }
                return null;
              })}
          </div>

          {checknickname.isPending && (
            <Loader2 className="text-xs text-muted-foreground animate-spin" />
          )}
          {checknickname.isError && (
            <p className="text-xs text-destructive">
              Gagal mengecek nickname. Silakan coba lagi.
            </p>
          )}
          {checknickname.isSuccess && checknickname.data && (
            <div className="bg-secondary w-full p-2 rounded-xl">
              <p className="text-xs text-green-600">
                Nickname: {checknickname.data.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

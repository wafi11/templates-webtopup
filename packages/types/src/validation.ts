import { z } from "zod";

export type PaginationResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

/**
 * Base string validation with min/max
 */
export const validationMinAndMaxValue = (
  min: number,
  fieldName: string,
  max: number,
): z.ZodString => {
  const name = fieldName || "Field";
  return z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} must be a string`,
    })
    .min(min, {
      message: `${name} must be at least ${min} characters`,
    })
    .max(max, {
      message: `${name} must be at most ${max} characters`,
    })
    .trim();
};

/**
 *
 * @param convertToTimestamp
 * @returns
 */
export function convertToTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Email validation
 */
export const validationEmail = (fieldName: string = "Email") => {
  return validationMinAndMaxValue(5, fieldName, 255)
    .email({
      message: `${fieldName} must be a valid email address`,
    })
    .toLowerCase();
};

/**
 * Password validation (dengan requirements)
 */
export const validationPassword = (
  min: number = 8,
  max: number = 100,
  fieldName: string = "Password",
) => {
  return validationMinAndMaxValue(min, fieldName, max)
    .regex(/[A-Z]/, {
      message: `${fieldName} must contain at least one uppercase letter`,
    })
    .regex(/[a-z]/, {
      message: `${fieldName} must contain at least one lowercase letter`,
    })
    .regex(/[0-9]/, {
      message: `${fieldName} must contain at least one number`,
    });
};

/**
 * Simple password (tanpa requirements)
 */
export const validationPasswordSimple = (
  min: number = 8,
  max: number = 100,
  fieldName: string = "Password",
) => {
  return validationMinAndMaxValue(min, fieldName, max);
};

/**
 * Username validation
 */
export const validationUsername = (fieldName: string = "Username") => {
  return validationMinAndMaxValue(3, fieldName, 50)
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: `${fieldName} can only contain letters, numbers, and underscores`,
    })
    .toLowerCase();
};

/**
 * Phone number validation
 */
export const validationPhone = (fieldName: string = "Phone") => {
  return z
    .string({
      required_error: `${fieldName} is required`,
    })
    .regex(/^(\+62|62|0)[0-9]{9,12}$/, {
      message: `${fieldName} must be a valid Indonesian phone number`,
    });
};

/**
 * URL validation
 */
export const validationUrl = (fieldName: string = "URL") => {
  return z
    .string({
      required_error: `${fieldName} is required`,
    })
    .url({
      message: `${fieldName} must be a valid URL`,
    });
};

/**
 * Date validation
 */
export const validationDate = (fieldName: string = "Date") => {
  return z.coerce.date({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a valid date`,
  });
};

/**
 * Date range validation
 */
export const validationDateRange = (
  startFieldName: string = "Start Date",
  endFieldName: string = "End Date",
) => {
  return z
    .object({
      start: validationDate(startFieldName),
      end: validationDate(endFieldName),
    })
    .refine((data) => data.end >= data.start, {
      message: `${endFieldName} must be after ${startFieldName}`,
      path: ["end"],
    });
};

/**
 * Number validation
 */
export const validationNumber = (
  min?: number,
  max?: number,
  fieldName: string = "Number",
) => {
  let schema = z.coerce.number({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a number`,
  });

  if (min !== undefined) {
    schema = schema.min(min, {
      message: `${fieldName} must be at least ${min}`,
    });
  }

  if (max !== undefined) {
    schema = schema.max(max, {
      message: `${fieldName} must be at most ${max}`,
    });
  }

  return schema;
};

/**
 * Boolean validation
 */
export const validationBoolean = (fieldName: string = "Field") => {
  return z.coerce.boolean({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a boolean`,
  });
};

/**
 * Array validation
 */
export const validationArray = <T extends z.ZodTypeAny>(
  schema: T,
  min?: number,
  max?: number,
  fieldName: string = "Items",
) => {
  let arraySchema = z.array(schema);

  if (min !== undefined) {
    arraySchema = arraySchema.min(min, {
      message: `${fieldName} must contain at least ${min} item(s)`,
    });
  }

  if (max !== undefined) {
    arraySchema = arraySchema.max(max, {
      message: `${fieldName} must contain at most ${max} item(s)`,
    });
  }

  return arraySchema;
};

/**
 * Enum validation
 */
export const validationEnum = <T extends [string, ...string[]]>(
  values: T,
  fieldName: string = "Field",
) => {
  return z.enum(values, {
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be one of: ${values.join(", ")}`,
  });
};

/**
 * File validation
 */
export const validationFile = (
  maxSizeInMB: number = 5,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  fieldName: string = "File",
) => {
  return z
    .instanceof(File, {
      message: `${fieldName} must be a file`,
    })
    .refine((file) => file.size <= maxSizeInMB * 1024 * 1024, {
      message: `${fieldName} must be less than ${maxSizeInMB}MB`,
    })
    .refine((file) => allowedTypes.includes(file.type), {
      message: `${fieldName} must be one of: ${allowedTypes.join(", ")}`,
    });
};

/**
 * Optional field helper
 */
export const optional = <T extends z.ZodTypeAny>(schema: T) => {
  return schema.optional().nullable();
};

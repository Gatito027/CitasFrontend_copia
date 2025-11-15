import { z } from "zod";

export const perfilProfesionalSchema = z.object({
  descripcion: z.string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(255, "La descripción no puede exceder 255 caracteres")
    .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" }),

  categoria: z.string()
    .trim()
    .min(1, "La categoría es requerida"),

  categoriaPersonalizada: z.string()
    .trim()
    .optional()
    .refine(val => !val || val.length >= 3, {
      message: "La categoría personalizada debe tener al menos 3 caracteres"
    }),

  ubicacion: z.string()
    .trim()
    .min(3, "La ubicación debe tener al menos 3 caracteres")
    .max(225, "La ubicación no puede exceder 225 caracteres")
    .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" }),

  facebook: z.string()
    .trim()
    .optional()
    .refine(val => !val || val.startsWith("https://www.facebook.com/"), {
      message: "Debe ser un enlace válido"
    }),

  linkedIn: z.string()
    .trim()
    .optional()
    .refine(val => !val || val.startsWith("https"), {
      message: "Debe ser un enlace válido"
    }),

  twitter: z.string()
    .trim()
    .optional()
    .refine(val => !val || val.startsWith("https"), {
      message: "Debe ser un enlace válido"
    })
});
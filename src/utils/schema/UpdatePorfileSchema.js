import { z } from "zod";

export const UpdateProfileShema = z.object({
  user: z.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, "Solo letras, espacios, acentos y guiones")
    .refine(val => !/\d/.test(val), { message: "No puede contener números" })
    .refine(val => !/[!@#$%^&*()_+=[\]{};:"\\|,.<>/?]/.test(val), { message: "No puede contener caracteres especiales" })
    .refine(val => val.trim().split(/\s+/).length >= 2, { message: "Ingresa nombre y apellido" })
    .refine(val => val.trim().split(/\s+/).every(part => part.length >= 2), { message: "Cada parte debe tener al menos 2 caracteres" })
    .refine(val => !/\s{2,}/.test(val), { message: "No puede tener espacios consecutivos" })
    .refine(val => !/^[\s'-]|[\s'-]$/.test(val), { message: "No puede empezar o terminar con espacio, guión o apóstrofe" }),

  edad: z.string()
    .refine(val => /^\d+$/.test(val), { message: "La edad debe contener solo números" })
    .transform(val => Number(val))
    .refine(val => Number.isInteger(val), { message: "Debe ser un número entero" })
    .refine(val => val >= 18, { message: "La edad debe ser mayor o igual a 18" })
    .refine(val => val <= 120, { message: "La edad no puede exceder 120" }),

  telefono: z.string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "El teléfono debe contener solo números"),

});
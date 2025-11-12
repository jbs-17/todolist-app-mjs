import { isLength } from "validator";
import ValidationError from "../errors/validation.error.mjs";

export default function isValidPassword(password) {
  // ... di Service Layer
  if (!isLength(password, { min: 8 })) {
    throw new ValidationError(
      "Kata sandi harus minimal 8 karakter.",
      "password",
    );
  }

  // Cek apakah password mengandung setidaknya satu angka
  if (!/\d/.test(password)) {
    throw new ValidationError(
      "Kata sandi harus mengandung minimal satu angka.",
      "password",
    );
  }

  // Cek apakah password mengandung setidaknya satu huruf besar
  if (!/[A-Z]/.test(password)) {
    throw new ValidationError(
      "Kata sandi harus mengandung minimal satu huruf besar.",
      "password",
    );
  }

  // Cek apakah password mengandung setidaknya satu simbol (bisa lebih spesifik jika perlu)
  if (!/[^a-zA-Z0-9]/.test(password)) {
    throw new ValidationError(
      "Kata sandi harus mengandung minimal satu simbol.",
      "password",
    );
  }
}

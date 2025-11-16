// utils/validation.helper.mjs

import ValidationError from "../errors/validation.error.mjs";

/**
 * Pengecekan internal untuk nilai null atau undefined.
 */
const _isNullish = (value) => value === null || value === undefined;

/**
 * Memvalidasi sekelompok field. Jika salah satu nullish, ia akan melempar ValidationError.
 * @param {object} fieldsObject - Objek berisi field yang akan divalidasi, cth: { email, password }
 */
export function validateRequiredFields(fieldsObject) {
    const allKeys = Object.keys(fieldsObject);
    let hasNullish = false;

    // Cek apakah ada yang nullish
    for (const value of Object.values(fieldsObject)) {
        if (_isNullish(value)) {
            hasNullish = true;
            break; 
        }
    }

    if (hasNullish) {
        // Gabungkan semua keys untuk pesan dan tag error
        const fieldsString = allKeys.join(', '); // Cth: "email, password"
        const fieldsTag = allKeys.join(':');    // Cth: "email:password"
        
        throw new ValidationError(
            `${fieldsString} required!`, 
            fieldsTag, 
            null, 
            400
        );
    }
}
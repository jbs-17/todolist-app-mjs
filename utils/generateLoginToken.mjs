// utils/generateLoginToken.mjs

import jwt from 'jsonwebtoken';
import CONFIG from '../configs/config.mjs'; // Asumsi Anda punya file CONFIG yang menyimpan JWT_SECRET

/**
 * @param {number} userId - ID pengguna.
 * @param {object} payloadData - Data tambahan yang akan dimasukkan ke payload.
 * @returns {string} Token JWT.
 */
function generateLoginToken(userId, payloadData = {}) { // Menggunakan payloadData
    const payload = { 
        id: userId,
        ...payloadData // Menggabungkan data tambahan
    };
    
    // Konfigurasi token: Secret Key dan Options (misalnya, masa berlaku)
    const options = {
        expiresIn: CONFIG.LOGIN_TOKEN_EXPIRED, // Token berlaku selama 7 hari
        subject: String(userId), // Subject token
    };

    return jwt.sign(payload, CONFIG.JWT_SECRET, options);
}

export default generateLoginToken;
import ValidationError from "../errors/validation.error.mjs";
import userServices from "../services/user.services.mjs";
import jwt from 'jsonwebtoken';
import CONFIG from '../configs/config.mjs';
import isNullish from "../utils/isNullish.mjs";
import { isEmail } from "validator";
import isValidPassword from "../utils/isValidPassword.mjs";


const userMiddlewares = {

    async verifyRegister(req, res, next) {
        const { email, password } = req.body;
        if (isNullish(email, password)) {
            return next(new ValidationError("email and passwrd required!", "email:password", null, 400));
        }

        if (!isEmail(email)) {
            return next(new ValidationError("invalid email format!", 'email', email, 400));
        }

        isValidPassword(password); // akan throw error jika invalid

        next();
    },


    async verifyLogin(req, res, next){
        
    }

    async verifyToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        // Pastikan formatnya "Bearer [TOKEN]"
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        // 1. Cek token hilang (401)
        if (!token) {
            return next(new ValidationError("Access token required.", "token", null, 401));
        }

        try {
            // 2. Verifikasi Token dan Dapatkan ID
            const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
            // Ambil ID dari payload. Asumsi: payload adalah {id: 1} atau {user_id: 1}
            const id = decoded.id || decoded.user_id;

            if (!id) {
                return next(new ValidationError("Invalid token structure: User ID missing.", "token", null, 401));
            }

            // 3. Cari User di Database (Service akan throw 404 jika tidak ditemukan)
            const { user } = await userServices.findById({ id });

            // 4. Lanjut ke Controller
            req.user = user;
            next();

        } catch (error) {
            // Tangkap error JWT spesifik (Expired, Invalid Signature)
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                return next(new ValidationError("Invalid or expired token.", "token", null, 401));
            }

            // Melempar error lainnya (DataNotExistsError dari service, 
            // atau error DB 500 lainnya) ke Global Handler
            next(error);
        }
    }
};

export default userMiddlewares;
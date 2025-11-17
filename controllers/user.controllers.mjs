// controllers/user.controllers.mjs

import userServices from "../services/user.services.mjs";
import generateLoginToken from "../utils/generateLoginToken.mjs";

const userControllers = {
  async newUser(req, res) {
    // req body sudah di validasi lewat middleware, ada middleware khususnya untuk user routes
    // req.body harus sudah {email : string, password : string } kareana validasi middleware
    const { insertId, username, email } = await userServices.addNewUser(
      req.body,
    );

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: {
        id: insertId,
        username,
        email,
      },
    });
    // error akan ditangkap global
  },

  async deleteUser(req, res) {
    // req.body audah harus {id : number, password: string}

    await userServices.deleteUser(req.body);

    // 204 No Content: Sukses, tapi tidak ada body respons
    res.status(204).end();
  },

  async updatePassword(req, res) {
    // req.body sudah harus {id:number, oldPassword:string, newPassword:string}

    await userServices.updatePassword(req.body);

    res.status(204).end();
  },

  async updateEmail(req, res) {
    // req.body sudah {id, newEmail, oldEmail, password}
    await userServices.updateEmail(req.body);

    res.status(204).end();
  },

  async authenticateUser(req, res) {
    // req.body : email, password

    // 1. Panggil Service untuk verifikasi kredensial
    const { user } = await userServices.authenticateUser(req.body);

    // 2. Buat Token JWT setelah verifikasi berhasil
    const token = generateLoginToken(user.id); // Asumsi user object dari service punya properti 'id'

    // 3. Kirim Respons 200 OK
    res.status(200).json({
      status: "success",
      message: "Login successful. Access token provided.",
      data: {
        // Tambahkan token JWT ke data respons
        token,
        // Sertakan data user dasar (yang sudah dihapus password-nya oleh Service)
        user,
      },
    });
  },

  async getData(req, res) {
    // Data user sudah tersedia di req.user, disuntikkan oleh verifyToken middleware
    // Objek req.user ini sudah diverifikasi dan sudah TIDAK memiliki hash password.
    const user = req.user;

    // Cek jika middleware gagal menyuntikkan (meskipun harusnya sudah dihandle di middleware)
    if (!user) {
      // Secara teori, ini tidak akan tercapai jika middleware berfungsi benar
      return res
        .status(401)
        .json({
          status: "fail",
          message: "User not authenticated or data missing.",
        });
    }

    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully.",
      data: {
        user,
      },
    });
  },
};
export default userControllers;

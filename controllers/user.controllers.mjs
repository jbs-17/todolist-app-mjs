import userServices from '../services/user.services.mjs';


const userControllers = {
  async newUser(req, res) {
    // req body sudah di validasi lewat middleware, ada middleware khususnya untuk user routes  
    // req.body harus sudah {email : string, password : string } kareana validasi middleware
    const { insertId, username, email } = await userServices.addNewUser(req.body);

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: {
        id: insertId,
        username,
        email
      }
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
    const {
      user
    } = await userServices.authenticateUser(req.body);

    res.status(200).json({
      status: "success",
      message: "User authenticated",
      data: {
        user
      }
    })
  }


}
export default userControllers;
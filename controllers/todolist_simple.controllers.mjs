// controllers/todolist_simple.controllers.mjs

import todoListSimpleServices from "../services/todolist_simple.services.mjs";

/*
    DESKRIPSI OBJECT todo

    id  number
    user_id number

    title string
    description string | null

    is_done boolean
    
    start_time Date | null
    end_time Date | null
    
    created_at Date
    updated_at Date
*/

const todoListSimpleControllers = {
  /*
        semua controlleres di sini dipastikan sudah punya req.user oleh middleware
        req.user : { id , email, username }

        semua diapstikan ada middleware untuk validasi isi req.body sesuai yang diperlukan
    */

  async createOne(req, res) {
    // yang wajib janya id dan title , lainya boleh null , di validasi di middleware
    const { title, description, is_done, start_time, end_time } = req.body;

    const { insertId } = await todoListSimpleServices.insertOne({
      user_id: req.user.id,
      title,
      description,
      end_time,
      is_done,
      start_time,
    });

    return res.status(201).json({
      status: "success",
      message: "Succes to create new simple_todo.",
      data: {
        insertId,
      },
    });
  },

  async deleteOne(req, res) {
    await todoListSimpleServices.deleteOne({
      user_id: req.user.id,
      id: req.body.id,
    });
    return res.status(204).end();
  },

  async deleteMany(req, res) {
    await todoListSimpleServices.deleteMany({
      user_id: req.user.id,
      ids: req.body.ids,
    });
    return res.status(204).end();
  },

  async getOne(req, res) {
    const { todo } = await todoListSimpleServices.findById({
      user_id: req.user.id,
      id: req.param.id,
    });
    return res.status(200).json({
      status: "success",
      message: "Success to get todo by id",
      data: todo,
    });
  },

  async getAll(req, res) {
    const { todos } = await todoListSimpleServices.findAllByUserId({
      user_id: req.user.id,
    });
    return res.status(200).json({
      status: "success",
      message: "All simple todos by user retrieved successfully.",
      data: {
        todos,
      },
    });
  },

  async updateDone(req, res) {
    const { id } = req.body; // ID Todo

    await todoListSimpleServices.updateDone({ user_id: req.user.id, id });

    return res.status(204).end();
  },

  async updateFull(req, res) {
    const { user_id } = req.user;
    // yang wajib hanya id dan title lainya boleh null
    const { id, title, description, end_time, is_done, start_time } = req.body;
    await todoListSimpleServices.updateFullById({
      user_id,
      id,
      title,
      description,
      end_time,
      is_done,
      start_time,
    });

    const { todo } = await todoListSimpleServices.findById({ user_id, id });
    return res.status(200).json({
      status: "success",
      message: "Success update full todo by id",
      data: todo,
    });
  },
};

export default todoListSimpleControllers;

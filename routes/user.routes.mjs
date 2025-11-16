import userServices from "../services/user.services.mjs";
import userControllers from "../controllers/user.controllers.mjs";
import express from 'express';


const _userRoutes = express.Router({
    strict: true,
    caseSensitive: true
});

_userRoutes.post('/register', userControllers.newUser);
export function userRoutes(app){
    app.use('/api/v1/user', userRoutes);
}
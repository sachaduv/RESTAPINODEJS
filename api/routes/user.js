const express = require('express');
const routes = express.Router();


const UserController = require('../controllers/user')

routes.post('/login',UserController.users_login_user);

routes.post('/signup',UserController.users_create_user);

routes.delete('/:userId',UserController.users_delete_user)

routes.get('/',UserController.users_get_all_users);

module.exports = routes
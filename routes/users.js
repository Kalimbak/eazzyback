const express = require('express');
const { signup, updateUser, logout, login, register, getUsers} = require('../controllers/users');
// const { checkAuth } = require('../middleware/auth');
const router = express.Router()

router.post('/signup',signup)

router.post('/login',login)

// router.use(checkAuth)

router.post('/logout',logout)

router.put('/update',updateUser)

router.post('/reg', register)

router.get('/', getUsers)



module.exports = router;

const express = require('express');
const router = express.Router();

const { listUsers, createUser, updateUser } = require('../controllers/users.controller');
const authHandler = require('../middlewares/authHandler');
router.use(authHandler);
router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);

module.exports = router;
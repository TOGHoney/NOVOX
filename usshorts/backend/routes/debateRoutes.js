const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/authMiddleware');
const { getRooms, createRoom, getRoom, joinRoom, leaveRoom } = require('../controllers/debateController');

router.get('/', auth, getRooms);
router.post('/', auth, createRoom);
router.get('/:id', auth, getRoom);
router.post('/:id/join', auth, joinRoom);
router.post('/:id/leave', auth, leaveRoom);

module.exports = router;
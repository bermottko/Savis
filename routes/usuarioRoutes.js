/*const express = require('express');
const router = express.Router();
const multer = require('multer');
const authController = require('../controllers/usuarioController');

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + ".jpg")
});


const upload = multer({ storage });

router.get('/inicio/index', usuarioController.renderInicio);

module.exports = router;*/
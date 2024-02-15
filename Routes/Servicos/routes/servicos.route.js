const express = require('express');
const router = express.Router();
const multer = require('multer');
const servicoController = require('../controllers/servicos.controller');

//Configurações de Arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/servicos');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage
});

router.post(
    '/criar',
    servicoController.registrarServico,
);

router.put(
    '/inciar',
    servicoController.iniciarServico,
);

router.put(
    '/finalizar',
    servicoController.finalizarServico
);

router.post(
    '/imagens',
    upload.single('imagem'),
    servicoController.registrarImagens
);

router.get(
    '/retornar',
    servicoController.retornarServico,
);

router.get(
    '/pesquisar',
    servicoController.pesquisarServico,
);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const servicoController = require('../controllers/servicos.controller');

//Configurações de Arquivos - Serviços
const storageServicos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/servicos');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const uploadServicos = multer({
    storage: storageServicos
});

//Configurações de Arquivos - Assinaturas cliente
const storageAssinaturaCliente = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/assinaturas/clientes');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const uploadAssinaturaCliente = multer({
    storage: storageAssinaturaCliente
});

//Configurações de Arquivos - Assinaturas Prestador
const storageAssinaturaPrestador = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/assinaturas/prestadores');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const uploadAssinaturaPrestador = multer({
    storage: storageAssinaturaPrestador
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
    uploadServicos.single('imagem'),
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

router.put(
    '/assinatura/cliente',
    uploadAssinaturaCliente.single('assinatura_cliente'),
    servicoController.registrarAssinaturaCliente
);

router.post(
    '/assinatura/prestador',
    uploadAssinaturaPrestador.single('assinatura_prestador'),
    servicoController.registrarAssinaturaPrestador
);

module.exports = router;
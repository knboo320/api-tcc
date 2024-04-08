const express = require('express');
const router = express.Router();
const multer = require('multer');
const servicoController = require('../controllers/servicos.controller');
const login = require('../middleware/login.middleware');

//Configurações de Arquivos - Serviços
const storageServicos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/servicos/imagens');
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
        cb(null, './assets/assinaturas');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const uploadAssinaturaCliente = multer({
    storage: storageAssinaturaCliente
});


//Configurações de Arquivos PDFs - Serviços
const storagePdfServicos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/servicos/pdfs');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const uploadPdfServicos = multer({
    storage: storagePdfServicos
});

router.post(
    '/criar',
    login.required,
    servicoController.registrarServico,
);

router.put(
    '/inciar/:id_servico',
    login.required,
    servicoController.iniciarServico,
);

router.put(
    '/finalizar/:id_servico',
    login.required,
    servicoController.finalizarServico
);

router.post(
    '/imagens/:id_servico',
    login.required,
    uploadServicos.single('imagem'),
    servicoController.registrarImagens
);

router.post(
    '/pdf/cadastrar/:id_servico',
    login.required,
    uploadPdfServicos.single('pdf'),
    servicoController.registrarPdf
);

router.post(
    '/assinatura/cliente/:id_servico',
    login.required,
    uploadAssinaturaCliente.single('assinatura_cliente'),
    servicoController.registrarAssinaturaCliente
);

router.get(
    '/retornar/:id_servico',
    login.required,
    servicoController.retornarServico,
);

router.get(
    '/filtrar/:tipo_filtro/:valor',
    login.required,
    servicoController.filtrarServicos,
);

module.exports = router;
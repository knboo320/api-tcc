const express = require('express');
const router = express.Router();
const multer = require('multer');
const servicoController = require('../controllers/servicos.controller');

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
    '/retornar/:id_servico',
    servicoController.retornarServico,
);

router.get(
    '/filtrar/:tipo_filtro/:valor',
    servicoController.filtrarServicos,
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

router.get(
    '/retornarServicos',
    servicoController.retornarServicos,
);

router.post(
    '/pdf/cadastrar',
    uploadPdfServicos.single('pdf'),
    servicoController.registrarPdf
);

module.exports = router;
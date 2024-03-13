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
    '/inciar/:id_servico',
    servicoController.iniciarServico,
);

router.put(
    '/finalizar/:id_servico',
    servicoController.finalizarServico
);

router.post(
    '/imagens/:id_servico',
    uploadServicos.single('imagem'),
    servicoController.registrarImagens
);

router.post(
    '/pdf/cadastrar/:id_servico',
    uploadPdfServicos.single('pdf'),
    servicoController.registrarPdf
);

router.post(
    '/assinatura/prestador/:id_servico',
    uploadAssinaturaPrestador.single('assinatura_prestador'),
    servicoController.registrarAssinaturaPrestador
);

router.put(
    '/assinatura/cliente/:id_servico',
    uploadAssinaturaCliente.single('assinatura_cliente'),
    servicoController.registrarAssinaturaCliente
);

router.get(
    '/retornar/:id_servico',
    servicoController.retornarServico,
);

router.get(
    '/filtrar/:tipo_filtro/:valor',
    servicoController.filtrarServicos,
);

module.exports = router;
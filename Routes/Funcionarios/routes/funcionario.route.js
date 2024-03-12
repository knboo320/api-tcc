const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login.middleware');
const funcionarioController = require('../controllers/funcionario.controller');

//Configurações de Arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/funcionarios');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage
});

//Rota de cadastro de funcionário
router.post(
    '/cadastro',
    upload.single('foto'),
    funcionarioController.registrarFuncionario
);

//Rota de Login de funcionário
router.post(
    '/login',
    funcionarioController.verificarFuncionario,
    funcionarioController.getDadosFuncionario,
    funcionarioController.login
);

//Rota de verificação se já existe funcionário com o rg
router.get(
    '/verificarFuncionario/:rg',
    funcionarioController.verificarFuncionario,
    funcionarioController.returnVerificarFuncionario
);

//Rota de atualização de senha do funcionário
router.put(
    '/esqueciSenha',
    funcionarioController.verificarFuncionario,
    funcionarioController.atualizarSenhaFuncionario
);

//Rota de retornar dados do usuário -> Não utilizado
router.get(
    '/',
    login.required,
    funcionarioController.getDadosFuncionario,
    funcionarioController.returnDadosFuncionario
);

module.exports = router;
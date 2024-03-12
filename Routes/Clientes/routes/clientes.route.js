const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientes.controller');

//Rota de cadastro de cliente
router.post(
    '/cadastro',
    clienteController.verificarClienteCadastro,
    clienteController.registrarCliente,
);

//Rota pegar dados do cliente
router.get(
    '/cpf/:cpf',
    clienteController.verificarClienteCpf,
    clienteController.getDadosCliente,
    clienteController.returnDadosCliente,
);

router.get(
    '/id/:id_cliente',
    clienteController.verificarClienteId,
    clienteController.getDadosCliente,
    clienteController.returnDadosCliente,
);

module.exports = router;
const mysql = require('../../../mysql');
const utils = require('../../../utils');

exports.verificarClienteCadastro = async (req, res, next) => {
    try {
        const verificarCliente = await mysql.execute(
            `SELECT id_cliente FROM clientes WHERE cpf = ?;`,
            [req.body.cpf]
        );
        if (verificarCliente.length >= 1) {
            res.locals.id_cliente = verificarCliente[0].id_cliente;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.verificarClienteCpf = async (req, res, next) => {
    try {
        const verificarCliente = await mysql.execute(
            `SELECT id_cliente FROM clientes WHERE cpf = ?;`,
            [req.params.cpf]
        );
        if (verificarCliente.length >= 1) {
            res.locals.id_cliente = verificarCliente[0].id_cliente;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.verificarClienteId = async (req, res, next) => {
    try {
        const verificarCliente = await mysql.execute(
            `SELECT id_cliente FROM clientes WHERE id_cliente = ?;`,
            [req.params.id_cliente]
        );
        if (verificarCliente.length >= 1) {
            res.locals.id_cliente = verificarCliente[0].id_cliente;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.getDadosCliente = async (req, res, next) => {
    try {
        if (res.locals.id_cliente) {
            const dadosClientes = await mysql.execute(
                `SELECT id_cliente, 
                    nome,
                    endereco,
                    bairro,
                    complemento,
                    cpf
               FROM clientes 
              WHERE id_cliente = ?`,
                [res.locals.id_cliente]
            );
            res.locals.cliente = dadosClientes[0];
            next();
        } else {
            return res.status(404).send({ mensagem: 'Cliente não encontrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.returnDadosCliente = async (req, res, next) => {
    try {
        return res.status(200).send({
            mensagem: 'Dados retornados com Sucesso!',
            dados_cliente: res.locals.cliente
        });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarCliente = async (req, res) => {
    try {
        if (!res.locals.id_cliente) {
            await mysql.execute(`
                INSERT INTO clientes (
                            nome,
                            endereco,
                            bairro,
                            complemento,
                            cpf
                        ) VALUES (?,?,?,?,?);`,
                [req.body.nome, req.body.endereco, req.body.bairro, req.body.complemento, req.body.cpf]
            );
            
            const dadosCliente = await mysql.execute(
                `SELECT * FROM clientes WHERE cpf = ?;`,
                [req.body.cpf]
            );

            if (dadosCliente.length >= 1) {
                res.locals.id_cliente = dadosCliente[0].id_cliente;
            }

            return res.status(201).send({ 
                message: 'Cliente cadastrado com sucesso!',
                dados_cliente : dadosCliente[0]
            });
        } else {
            return res.status(409).send({ message: 'Cliente já cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
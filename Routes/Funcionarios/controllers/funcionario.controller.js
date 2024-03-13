const mysql = require('../../../mysql');
const bcrypt = require('bcrypt');
const utils = require('../../../utils');
const api_config = require('../../../utils').getApiConfig();
const jwt = require('jsonwebtoken');

exports.verificarFuncionario = async (req, res, next) => {
    try {
        const verificarFuncionario = await mysql.execute(
            `SELECT id_funcionario FROM funcionarios WHERE cpf = ?;`,
            [req.body.cpf]
        );
        if (verificarFuncionario.length >= 1) {
            res.locals.id_funcionario = verificarFuncionario[0].id_funcionario;
        }
        next();
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarFuncionario = async (req, res) => {
    try {
        if (!res.locals.id_funcionario) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            await mysql.execute(`
                INSERT INTO funcionarios (
                            nome,
                            email,
                            cpf,
                            senha,
                            editar_senha
                        ) VALUES (?,?,?,?,?);`,
                [req.body.nome, req.body.email, req.body.cpf, hash, false]
            );
            return res.status(201).send({ message: 'Funcionário Cadastrado com Sucesso!' });
        } else {
            return res.status(409).send({ message: 'Funcionário já cadastrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.getDadosFuncionario = async (req, res, next) => {
    try {
        if (res.locals.id_funcionario) {
            const dadosFuncionarios = await mysql.execute(
                `SELECT id_funcionario, 
                    nome,
                    email,
                    senha,
                    editar_senha,
                    dt_criacao
               FROM funcionarios 
              WHERE id_funcionario = ?`,
                [res.locals.id_funcionario]
            );
            res.locals.funcionario = dadosFuncionarios[0];
            next();
        } else {
            return res.status(404).send({ mensagem: 'Funcionário não encontrado!' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.login = async (req, res) => {
    if (res.locals.funcionario.length < 1) {
        return res.status(401).send({ message: 'Funcionário não cadastrado' });
    }

    try {
        const match = await bcrypt.compare(req.body.senha, res.locals.funcionario.senha)

        if (match) {
            const token = jwt.sign({
                email: res.locals.funcionario.email,
                id_funcionario: res.locals.funcionario.id_funcionario,
                nome: res.locals.funcionario.nome,
            }, api_config.jwt_key);
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                id_funcionario: res.locals.funcionario.id_funcionario,
                nome: res.locals.funcionario.nome,
                email: res.locals.funcionario.email,
                editar_senha: res.locals.funcionario.editar_senha,
                token: token,
            });
        } else {
            return res.status(401).send({ message: 'Senha incorreta' });
        }
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.atualizarSenhaFuncionario = async (req, res, next) => {
    try {
        if (res.locals.id_funcionario) {
            const hash = await bcrypt.hash(req.body.senha, 10);
            const resultado = await mysql.execute(`
                UPDATE funcionarios 
                SET senha        = ?,
                    editar_senha = ?
                WHERE cpf    = ?;
            `, [hash, req.body.editar_senha, req.body.cpf]);
            return res.status(200).send({
                message: 'Atualizado com sucesso',
                resultado: resultado
            });
        } else {
            return res.status(404).send({ message: 'Funcionário não encontrado!' });
        }

        
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
const mysql = require('../../../mysql');
const bcrypt = require('bcrypt');
const utils = require('../../../utils');
const api_config = require('../../../utils').getApiConfig();
const jwt = require('jsonwebtoken');

exports.registrarServico = async (req, res) => {
    try {
        await mysql.execute(`
            INSERT INTO servicos (
                        id_cliente,
                        seguradora,
                        numero_da_assistencia,
                        tipo_de_servico,
                        descricao_problema,
                        checkup,
                        status
                    ) VALUES (?,?,?,?,?,?,?);`,
            [req.body.id_cliente, req.body.seguradora, req.body.numero_da_assistencia, req.body.tipo_de_servico, req.body.descricao_problema, req.body.checkup, req.body.status]
        );
        return res.status(201).send({ message: 'Serviço Cadastrado com Sucesso!' });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.iniciarServico = async (req, res, next) => {
    try {
        const dataServico = await mysql.execute(
            `SELECT * FROM servicos WHERE id_servico = ?;`,
            [req.params.id_servico]
        );
        
        if(dataServico[0] == undefined) {
            return res.status(404).send({
                mensagem: 'Nenhum serviço encontrado!',
            });
        }

        await mysql.execute(`
            UPDATE funcionarios 
            SET id_servico_iniciado    = ?
            WHERE id_funcionario       = ?;
            `, [req.params.id_servico, req.userData.id_funcionario]
        );

        const resultado = await mysql.execute(`
                UPDATE servicos 
                SET data_inicio    = ?,
                    id_funcionario = ?,
                    status         = ?
                WHERE id_servico   = ?;
            `, [req.body.data_inicio, req.body.id_funcionario, req.body.status, req.params.id_servico]);
        return res.status(200).send({
            message: 'Serviço iniciado com sucesso',
            resultado: resultado
        });

    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.finalizarServico = async (req, res, next) => {
    try {
        console.log(req.userData.id_funcionario);

        const dataServico = await mysql.execute(
            `SELECT * FROM servicos WHERE id_servico = ?;`,
            [req.params.id_servico]
        );

        if(dataServico[0] == undefined) {
            return res.status(404).send({
                mensagem: 'Nenhum serviço encontrado!',
            });
        }

        await mysql.execute(`
            UPDATE funcionarios 
            SET id_servico_iniciado    = ?
            WHERE id_funcionario       = ?;
            `, [null, req.userData.id_funcionario]
        );

        const resultado = await mysql.execute(`
                UPDATE servicos 
                SET descricao_do_servico_realizado = ?,
                    utilizou_pecas                 = ?,
                    pecas                          = ?,
                    valor_pecas                    = ?,
                    houve_excedente                = ?,
                    valor_excedente                = ?,
                    avarias                        = ?,
                    problema_solucionado           = ?,
                    havera_retorno                 = ?,
                    local_limpo                    = ?,
                    cumpriu_horario                = ?,
                    data_fim                       = ?,
                    status                         = ?
                WHERE id_servico                   = ?;
            `, [req.body.descricao_do_servico_realizado, req.body.utilizou_pecas, req.body.pecas, req.body.valor_pecas, req.body.houve_excedente, req.body.valor_excedente, req.body.avarias, req.body.problema_solucionado, req.body.havera_retorno, req.body.local_limpo, req.body.cumpriu_horario, req.body.data_fim, req.body.status, req.params.id_servico]);


        
            return res.status(200).send({
            message: 'Serviço finalizado com sucesso',
            resultado: resultado
        });

    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarImagens = async (req, res) => {
    try {
        const imagemPaht = req.file ? utils.formatarUrl(req.file.path) : null;

        await mysql.execute(`
            INSERT INTO imagens_servico (
                        id_servico,
                        imagem,
                        antes_ou_depois
                    ) VALUES (?,?,?);`,
            [req.params.id_servico, imagemPaht, req.body.antes_ou_depois]
        );

        return res.status(200).send({ message: 'Imagem adicionadas com sucesso' });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarPdf = async (req, res) => {
    try {
        const imagemPaht = req.file ? utils.formatarUrl(req.file.path) : null;

        await mysql.execute(`
            INSERT INTO pdfs_servicos (
                        id_servico,
                        url_pdf
                    ) VALUES (?,?);`,
            [req.params.id_servico, imagemPaht]
        );

        return res.status(200).send({ message: 'PDF adicionado com sucesso' });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.registrarAssinaturaCliente = async (req, res) => {
    try {
        const imagemPaht = req.file ? utils.formatarUrl(req.file.path) : null;

        await mysql.execute(`
            INSERT INTO assinaturas (
                        id_servico,
                        assinatura_cliente
                    ) VALUES (?,?);`,
            [req.params.id_servico, imagemPaht]
        );

        return res.status(200).send({ message: 'Assinatura do cliente adicionada com sucesso' });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.filtrarServicos = async (req, res, next) => {
    try {
        let servicos;
        let response = [];

        if (req.params.tipo_filtro == 'data') {
            servicos = await mysql.execute(
                `SELECT * FROM servicos WHERE dt_criacao < ? AND dt_criacao > ?;`,
                [req.params.valor + 'T23:59:59.000Z', req.params.valor + 'T00:00:00.000Z']
            );
        } else if (req.params.tipo_filtro == 'tipo') {
            servicos = await mysql.execute(
                `SELECT * FROM servicos WHERE tipo_de_servico = ?;`,
                [req.params.valor]
            );
        } else if (req.params.tipo_filtro == 'status') {
            servicos = await mysql.execute(
                `SELECT * FROM servicos WHERE status = ?;`,
                [req.params.valor]
            );
        } else if (req.params.tipo_filtro == 'id') {
            servicos = await mysql.execute(
                `SELECT * FROM servicos WHERE id_servico = ?;`,
                [req.params.valor]
            );
        } else {
            return res.status(409).send({
                mensagem: 'Tipo de filtro inválido',
            });
        }

        async function fetchInfos() {
            for (const servico of servicos) {    
                const imagensServico = await mysql.execute(
                    `SELECT * FROM imagens_servico WHERE id_servico = ?;`,
                    [servico['id_servico']]
                );
                const assinaturasServico = await mysql.execute(
                    `SELECT * FROM assinaturas WHERE id_servico = ?;`,
                    [servico['id_servico']]
                );
                const pdfServico = await mysql.execute(
                    `SELECT * FROM pdfs_servicos WHERE id_servico = ?;`,
                    [servico['id_servico']]
                );
                servico['assinaturas'] = assinaturasServico[0];
                servico['imagens'] = imagensServico;
                servico['pdf'] = pdfServico[0];
        
                response.push(servico);
            }
        }
        
        await fetchInfos();

        if (servicos.length >= 1) {
            return res.status(200).send({
                mensagem: 'Seviços retornados com sucesso!',
                servicos: response
            });
        } 
        return res.status(404).send({
            mensagem: 'Nenhum serviço encontrado',
        });
        
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}

exports.retornarServico = async (req, res, next) => {
    try {
        const dataServico = await mysql.execute(
            `SELECT * FROM servicos WHERE id_servico = ?;`,
            [req.params.id_servico]
        );
        const imagensServico = await mysql.execute(
            `SELECT * FROM imagens_servico WHERE id_servico = ?;`,
            [req.params.id_servico]
        );
        const assinaturasServico = await mysql.execute(
            `SELECT * FROM assinaturas WHERE id_servico = ?;`,
            [req.params.id_servico]
        );
        const pdfServico = await mysql.execute(
            `SELECT * FROM pdfs_servicos WHERE id_servico = ?;`,
            [req.params.id_servico]
        );
        
        if(dataServico[0] == undefined) {
            return res.status(404).send({
                mensagem: 'Nenhum serviço encontrado!',
            });
        }
        return res.status(200).send({
            mensagem: 'Serviço retornado com sucesso!',
            servico: dataServico[0],
            assinaturas_servico: assinaturasServico[0],
            imagens_servico: imagensServico,
            pdf: pdfServico[0]
        });

    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
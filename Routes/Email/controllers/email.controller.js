const utils = require('../../../utils');
const nodemailer = require('nodemailer');


exports.enviarEmail = async (req, res, next) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "renan.gab153@gmail.com",
                pass: "eloj vybi qiyo vfcl",
            },
        });
        
        const mailOptions = {
            from: 'Equipe Quirino`s" <renan.gab153@gmail.com>', // sender address
            to: req.body.destino, // list of receivers
            subject: "Relatório do serviço realizado", // Subject line
            html: `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Relatório de Serviço</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f8f8f8;
                    }
        
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
        
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
        
                    .header h2 {
                        color: #333;
                    }
        
                    .content {
                        margin-bottom: 20px;
                    }
        
                    .footer {
                        text-align: center;
                        color: #666;
                    }
        
                    .footer a {
                        color: #333;
                        text-decoration: none;
                    }
                </style>
            </head>
                <body>
                <div class="container">
                    <div class="header">
                        <h2>Relatório de Serviço</h2>
                    </div>
                    <div class="content">
                        <p>Prezado(a) Cliente,</p>
                        <p>Espero que esteja tudo bem com você.</p>
                        <p>É com satisfação que encaminho em anexo o relatório completo do serviço que realizamos. Este documento contém detalhes importantes sobre o projeto, incluindo observações e resultados.</p>
                        <p>Agradecemos sinceramente pela confiança depositada em nossa equipe para a execução deste serviço. Nosso compromisso é sempre entregar resultados de qualidade e superar as expectativas dos nossos clientes, e esperamos que este relatório demonstre isso de forma clara e objetiva.</p>
                        <p>Ficamos à disposição para discutir qualquer ponto do serviço ou para agendar uma reunião caso deseje um aprofundamento em algum aspecto específico. Se houver qualquer dúvida ou necessidade adicional, não hesite em entrar em contato conosco.</p>
                        <p>Atenciosamente, equipe Quirino's</p>
                    </div>
                    <div class="footer">
                        <p>Este e-mail foi enviado automaticamente. Por favor, não responda diretamente a este e-mail.</p>
                    </div>
                </div>
                </body>
            </html>
            `,
            attachments: [
                {
                    filename: 'Relatorio.pdf',
                    path: req.body.url_pdf,
                },
            ],
            
        };
        
        transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                return res.status(500).send({ message: 'Erro ao enviar email', error : error });
            } else {
                return res.status(200).send({ message: 'Email enviado com sucesso' });
            }
        });
    } catch (error) {
        utils.getError(error);
        return res.status(500).send({ error: error });
    }
}
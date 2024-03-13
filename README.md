# API-TCC
## ⌨Instalação
Para a criação do banco de dados:
 1. Rodar Arquivo de Criação do Banco de Dados
 Rodar em 1°: `api-tcc/mysql/scripts/DDL.sql`

2. Criar um arquivo de configuração de variáveis de ambiente na raiz do projeto chamado `nodemon.json` (Ex: `api-tcc/nodemon.json`), onde deve estar de acordo com os atributos a seguir:
    ```json
    {
        "env" : {        
            "MYSQL_USER": "<usuario-banco-de-dados>",
            "MYSQL_PASSWORD": "<senha-bando-de-dados>",
            "MYSQL_DATABASE": "wscdb",
            "MYSQL_HOST":  "<host-banco-de-dados>",
            "JWT_KEY": "<codigo-para-jwt>",
            "URL_DOMINIO": "<host-do-servico>"
        }
    }

3. Criar as pastas
    ```sh
    api-tcc/assets
        api-tcc/assets/assinaturas
            api-tcc/assets/assinaturas/clientes
            api-tcc/assets/assinaturas/prestadores
    api-tcc/assets/servicos
        api-tcc/assets/servicos/imagens
        api-tcc/assets/servicos/pdfs
    ```

4. Instalar as depencias do Projeto
    ```sh
    npm install
    ```

## 🔰Inicialização
```sh
npm start
```

## 📗 Documentação
https://documenter.getpostman.com/view/26690426/2sA2rFRKtY
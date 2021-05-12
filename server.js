const express = require("express");
const path = require("path");
const app = express();

const configs = {
    caminho: "dist", //Aqui ser� definido a pasta de sa�da onde cont�m o index.html e os outros arquivos.
    forcarHTTPS: false, //Defina para true se desejar que o redirecionamento para HTTPS seja for�ado (� necess�rio certificado SSL ativo)
    port: process.env.PORT || 3000
}

if (configs.forcarHTTPS) //Se o redirecionamento HTTP estiver habilitado, registra o middleware abaixo
    app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
        if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers � HTTP
            res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS
        else //Se a requisi��o j� � HTTPS
            next(); //N�o precisa redirecionar, passa para os pr�ximos middlewares que servir�o com o conte�do desejado
    });

app.use(express.static(configs.caminho)); //Serve os outros arquivos, como CSSs, Javascripts, Imagens etc.

app.get("*", (req, res) => {// O wildcard '*' serve para servir o mesmo index.html independente do caminho especificado pelo navegador.
    res.sendFile(path.join(__dirname, configs.caminho, "index.html"));
});

app.listen(configs.port, () => {
    console.log(`Escutando na ${configs.port}!`);
});
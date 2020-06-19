## API

Essa api esta disponivel em http://18.230.61.98/ Além de aceitar os endpoints abaixo, existe um exemplo de uma frontend básica utilizando todos os endpoints da api no ip.

A maquina hospedando a api esta utilizando [pm2](https://www.npmjs.com/package/pm2) para automaticamente iniciar o processo node caso a máquina reinicie.

## Endpoints
- ##### GET /memory_usage
    Retorna o uso de memória atual do processo
- ##### GET /message
    Retorna a mensagem armazenada
    (Caso a mensagem for um número o retorno terá um delay em milisegundos referente ao número)
- ##### GET /live
    Retorna um objeto JSON com: `{
        message: mensagemArmazenada,
        event: eventName
    }`
    Com event name para ser utilizado com socket.io
- ##### POST /message
    Altera a mensagem armazenada no servidor, deve ter a body com: `{newMessage: "Mensagem nova"}`
    (Retorna 204 quando sucedido)
---
## SocketIO client

Para usar o endpoint /live , o cliente precisa utilizar o socket.io para criar uma conexão com o servidor, utilizando o mesmo ip da api.
O retorno do /live contém a mensagem atualmente armazenada no servidor e um `eventName` onde o servidor estará emitindo a mensagem assim que for alterada.

Um exemplo dessa implementação utilizando jQuery:
```javascript
const socket = io.connect(`changeme`);

// GET /live recebe o eventname, atualiza a mensagem local e prepara o socket para receber o evento
$.get("live", (requestData) => {
    $('#live').text(requestData.message)

    socket.on(requestData.event, (socketData) => {
        console.log(`Mensagem alterada: ${socketData}`)
    })
})
```

---
## Requerimentos para iniciar a api
- Uma database mySQL com uma table ``messages`` com colunas ``id`` e ``message`` com id = ``1``
- Um arquivo .env ou variáveis de ambiente configuradas, existe um arquivo exemplo no git: ``env.example``
   ##### Para prod.
- É necessario alterar o ip onde o socket.io se conecta no arquivo ``/public/index.js`` como descrito nos comentários para a frontend de exemplo funcionar


## Monitoramento da API

A api está sendo hospedada junto ao netdata para monitoramento, ele tem autenticação utilizando o nginx como proxy.

É possivel acessar o netdata pelo http://18.230.61.98:3000 com o usuario e senha `admin:admin`
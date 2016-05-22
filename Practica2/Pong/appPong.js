var express = require('express');
var amqp = require('amqplib').connect('amqp://localhost');
var app = express();

var message = {
    "toRespond": false,
    "msg": ""
};

var info = {
    "recived": 0,
    "responded": 0,
    "messages": []
};

app.get('/pong/info', function (req, res) {
    res.send('Hello World!');
});

function receiver() {
    amqp.then(
        function (conn) {
            return conn.createChannel();
        }
    ).then(
        function (channel) {
            channel.assertQueue('PING_CHANNEL', {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", 'PING_CHANNEL');
            return channel.consume('PING_CHANNEL', function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
                if (msg !== null){
                    var newMessage = message;
                    newMessage.msg = msg.content.toString();
                    newMessage.toRespond = badWords(newMessage);
                    info.recived++;
                    sender(newMessage, channel);
                }
            }, {ack: true})
        }
    );
}

function sender(msg, channel) {
    if (msg.toRespond) {
        channel.assertQueue('ERROR_CHANNEL', {durable: false});
        console.log('Sending wrong message');
        channel.sendToQueue('ERROR_CHANNEL', new Buffer('WRONG_MESSAGE: ' + msg.msg));
    } else {
        setTimeout(function () {
            channel.assertQueue('PONG_CHANNEL', {durable: false})
            console.log('Sending good message');
            channel.sendToQueue('PONG_CHANNEL', new Buffer('PONG_MESSAGE'));
        }, 2000);
    }
}

function badWords(msg) {
    var badWordsBool = true;
    var message = msg.msg.toLowerCase();
    var messageArray = message.split(" ");
    messageArray.forEach(
        function (word) {
            switch (word) {
                case "ping":
                    badWordsBool = false;
                    break;
                case "ping_message":
                    badWordsBool = false;
                    break;
                default:
                    break;
            }
        }
    );
    return badWordsBool;
}

app.listen(3001, function () {
    console.log('PongApp listening on port 3001!');
    receiver();
});

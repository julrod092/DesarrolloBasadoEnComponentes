var express = require('express');
var amqp = require('amqplib').connect('amqp://localhost');
var app = express();

var message = {
    "responded": false,
    "msg": ""
};

var info = {
    "recived": 0,
    "responded": 0,
    "messages": []
};

app.set('json spaces', 4);

app.get('/pong/info', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.json(info);
});

function receiver() {
    amqp.then(
        function (conn) {
            return conn.createChannel();
        }
    ).then(
        function (channel) {
            channel.assertQueue('PING_CHANNEL');
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", 'PING_CHANNEL');
            return channel.consume('PING_CHANNEL', function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
                if (msg !== null){
                    message.msg = msg.content.toString();
                    info.messages.push(message);
                    info.recived++;
                    sender(message, channel);
                }
                channel.ackAll();
            })
        }
    );
}

function sender(message, channel) {
    setTimeout(function () {
        channel.assertQueue('PONG_CHANNEL');
        var received = channel.sendToQueue('PONG_CHANNEL', new Buffer('PONG_MESSAGE'));
        if (received) {
            message.responded = true;
            info.responded++;
        }
        message = { "responded": false, "msg": "" };
    }, 2000);
}

app.listen(3001, function () {
    console.log('PongApp listening on port 3001!');
    receiver();
});

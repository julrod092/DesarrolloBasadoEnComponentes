var express = require('express');
var amqp = require('amqplib').connect('amqp://@localhost');

var app = express();

var pong_message = "";

app.get('/ping', function (req, res) {
    sender("PING_MESSAGE").then(
        function (response) {
            if (response) {
                receiver().then(
                    function () {
                        res.send("RESPONSE MESSAGE RECEIVED");
                    }
                );
            }
        }
    );
});

function sender(word) {
    return amqp.then(
        function (conn) {
            return conn.createChannel();
        }).then(
        function (channel) {
            channel.assertQueue('PING_CHANNEL', {durable: false});
            return channel.sendToQueue('PING_CHANNEL', new Buffer(word));
        }
    );
}

function receiver() {
    return amqp.then(
        function (conn) {
            return conn.createChannel();
        }
    ).then(
        function (channel) {
            channel.assertQueue('PONG_CHANNEL', {durable: false});
            return channel.consume('PONG_CHANNEL', function (msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {ack: true})
        }
    );
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
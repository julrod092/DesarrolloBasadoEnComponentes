var express = require('express');
var amqp = require('amqplib').connect('amqp://@localhost');

var app = express();

app.get('/ping', function (req, res) {
    sender("PING_MESSAGE").then(
        function (response) {
            if (response) {
                messagesFromPongQueue().then(
                    function (message) {
                        res.send(message.content.toString());
                    }
                );
            }
        }
    );
});

function messagesFromPongQueue() {
    return receiver().then(
        function (message) {
            if (!message) {
                return messagesFromPongQueue();
            } else {
                return message;
            }
        }
    );
}

function sender(word) {
    return amqp.then(
        function (conn) {
            return conn.createChannel();
        }).then(
        function (channel) {
            channel.assertQueue('PING_CHANNEL');
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
            return channel.assertQueue('PONG_CHANNEL').then(
                function(){
                    channel.ackAll();
                    return channel.get('PONG_CHANNEL');
                }
            );
        }
    );
}

app.listen(3000, function () {
    console.log('PingApp listening on port 3000!');
});
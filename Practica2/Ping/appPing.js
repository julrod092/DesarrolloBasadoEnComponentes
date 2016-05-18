var express = require('express');
var amqp = require('amqplib').connect('amqp://@localhost');

var app = express();


app.get('/ping', function (req, res) {
    sender().then(
        function (response) {
           if (response) {
               res.send(response)
           }
        }
    );
});

function sender() {
    return amqp.then(
        function (conn) {
            return conn.createChannel();
        }).then(
        function (channel) {
            channel.assertQueue('EVENT_CHANNEL', {durable: false});
            return channel.sendToQueue('EVENT_CHANNEL', new Buffer('PING_MESSAGE'));
        }
    );
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

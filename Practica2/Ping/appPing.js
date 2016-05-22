var express = require('express');
var amqp = require('amqplib').connect('amqp://@localhost');

var app = express();


app.get('/ping', function (req, res) {
    var arrayOfWords = ['PING_MESSAGE', 'PING_MESSAGE', 'PING', 'PING', 'BAD_MESSAGE'];
    arrayOfWords.forEach(
        function (word) {
            sender(word).then(
                function (response) {
                    if (response) {
                        console.log(response);
                    }
                }
            );
        }
    );
    res.send("Hola")
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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
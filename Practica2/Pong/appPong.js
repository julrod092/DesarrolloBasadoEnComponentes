var express = require('express');
var amqp = require('amqplib').connect('amqp://localhost');

var info = {
  "recived": 0,
  "responded": 0,
  "messages": []
}

app.get('/pong/info', function (req, res) {
    res.send('Hello World!');
});

function reciever() {
    amqp.then(
        function (conn) {
            return conn.createChannel();
        }
    ).then(
        function (channel) {
            channel.assertQueue('EVENT_CHANNEL', {durable: false});
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", 'EVENT_CHANNEL');
            return channel.consume('EVENT_CHANNEL', function (msg) {
                if (msg){

                }
                console.log(" [x] Received %s", msg.content.toString());
            }, {ack: true})
        }
    );
}

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
    reciever();
});

var express = require('express');
var amqp = require('amqplib/callback_api');

var app = express();

app.get('/ping', function (req, res) {
    res.send('Hello World!');
    connectingAmqp();
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

function connectingAmqp() {
    amqp.connect('amqp://localhost',
        function (err, conn) {
            if (null != err) {
                console.log('RabbitMQ is not started');
                return;
            }
            conn.createChannel(
                function (err, ch) {
                    var q = 'hello';
                    ch.assertQueue(q, {durable: false});
                    ch.sendToQueue(q, new Buffer('Hello World!'));
                    console.log(" [x] Sent 'Hello World!'");
                }
            );
        }
    );
}

module.exports = app;

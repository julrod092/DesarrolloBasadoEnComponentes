var express = require('express');
var amqp = require('amqplib/callback_api');

var app = express();

app.get('/pong', function (req, res) {
    res.send('Hello World!');
    connectingAmqp();
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
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
                    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
                    ch.consume(q, function(msg) {
                        console.log(" [x] Received %s", msg.content.toString());
                    }, {ack: true});
                    setTimeout(function (err, ch) {
                        
                    })
                }
            );
        }
    );
}


module.exports = app;

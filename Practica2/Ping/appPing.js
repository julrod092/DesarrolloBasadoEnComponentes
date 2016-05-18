var express = require('express');
var amqp = require('amqplib').connect('amqp://@localhost');

var app = express();


app.get('/ping', function (req, res) {
    sender().then(
        function (response) {
            if (null !== response){
                return;
            }
            res.send("Hola");
        }
    );
});

function sender() {
    return amqp.then(
        function (conn) {
            return conn.createChannel(
                function (err, channel) {
                    channel.assertQueue('EVENT_CHANNEL', {durable: false});
                    channel.sendToQueue('EVENT_CHANNEL', new Buffer('PING_MESSAGE'));
                    console.log('Queuing message');
                }
            );
        }
    );
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


module.exports = app;

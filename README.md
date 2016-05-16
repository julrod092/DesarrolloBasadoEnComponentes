# Repositorio para practicas de la materia Desarollo Basado en Componentes

## Practica 1: HATEOAS (Hypermedia as the Engine of Application State)

* Lenguaje de desarrollo: Ruby
* API utilizada: [GitHub API] de [GitHub Developer Site]

### Comandos
```sh
$ ruby practica1.rb
```

## Practica 2: Message Driven Ping Pong

* Lenguaje de desarrollo: JavaScript
* Message Broker: RabbitMQ
* Framework para lenguaje de desarrollo: NodeJS - Express

### Pasos a ejecutar:

* Instalar [RabbitMQ - Debian]
* Entrar a carpeta Pong y ejecutar lo siguiente: 
```sh
$ cd Pong
$ node appPong.js
```
* Luego ir a la carpeta Ping y ejecutar lo siguiente:
```sh
$ cd ..
$ cd Ping
$ node appPing.js
```





[GitHub API]: <https://api.github.com/>
[GitHub Developer Site]: <https://developer.github.com>
[RabbitMQ - Debian]: <https://www.rabbitmq.com/install-debian.html>

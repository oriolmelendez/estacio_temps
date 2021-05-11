const host = 'ws://broker.emqx.io:8083/mqtt';

const options = {
    keepalive: 60,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
}

var app = new Vue({
    el: '#app',
    data: function(){
        return{
            pressio: '',
            temperatura: '',
            alcada:''
        }
    },
    mounted: function () {

        _self = this;

        const client = mqtt.connect(host, options);

        client.on('connect', function () {
            console.log('Connected to broker');
            client.subscribe('/RSP0temperatura');
            client.subscribe('/RSP0pressio');
            client.subscribe('/RSP0altitude');
        });

        client.on('message', function (topic, message) {

            switch (topic) {

                case '/RSP0pressio':
                    console.log('Pressio: ' + message.toString());
                    _self.pressio = message.toString();
                    break;

                case '/RSP0temperatura':
                    console.log('Temperatura: ' + message.toString());
                    _self.temperatura = message.toString();
                    break;

                case '/RSP0altitude':
                    console.log('Alçada: ' + message.toString());
                    _self.alcada = message.toString();
                    break;
            }

        });
    }

});
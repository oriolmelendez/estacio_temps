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
    }
}

let app = new Vue({
    el: '#app',
    data: {
        temperatura: 'carregant...',
    },
    mounted: function () {

        _self = this;

        const client = mqtt.connect(host, options);

        client.on('connect', function () {
            console.log('Connected to broker');
            client.subscribe('/RSP0temperatura');
            client.subscribe('/RSP0pressio');
        });

        client.on('message', function (topic, message) {

            switch (topic) {

                case '/RSP0temperatura':
                    console.log('Temperatura: ' + message.toString());
                    _self.temperatura = message.toString();
                    _self.arrayTemp.push(message.toString());
                    console.log(_self.arrayTemp);
                    break;

                case '/RSP0pressio':
                    console.log('Pressio: ' + message.toString());
                    _self.arrayPress.push(message.toString());
                    console.log(_self.arrayPress);
                    break;
            }
        });

    }
});
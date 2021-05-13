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

const client = mqtt.connect(host, options);

var app = new Vue({
    el: '#app',
    data: function () {
        return {

        }
    },
    mounted: function () {
        _self = this;

        const client = mqtt.connect(host, options);

        client.on('connect', function () {
            console.log('Connected to broker');
            client.subscribe('/RSPled');
            client.subscribe('/RSPEscriure');
            client.subscribe('/RSPTots');
        });

    },
    methods: {
        ledON: function () {
            value = document.getElementById('leds').value;
            console.log(value);
            client.publish('/RSPled', value + '');
        },
        text: function () {
            let text = prompt('Introdueix un text');
            if (text.length > 4) {
                alert('error!');
                alerta();
            }
            console.log(text);
            client.publish('/RSPEscriure', text);
        },
        encendreLeds: function () {
            client.publish('/RSPTots', "turnOn");
        },
        emetreSo: function(){
            let freq = document.getElementById('freq').value;
            let duracio = document.getElementById('duracio').value;
            let data = '{"freq":'+ freq +',"duracio": '+ duracio +'}';
            client.publish('/RSPESo', data);
        }
    }

});
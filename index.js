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
        temperatura: '',
        loading: true,
        influxTemp: [],
        timeInfluxTemp: [],
        influxPress: [],
        timeInfluxPress: [],
        influxAlcada: [],
        timeUnfluxAlcada: [],

    },
    mounted: function() {

        _self = this;

        const client = mqtt.connect(host, options);

        client.publish('/RSPGetInflux', 'Dadestemp');

        client.on('connect', function() {
            console.log('Connected to broker');
            client.subscribe('/RSP0temperatura');
            client.subscribe('/RSPInfluxTemp');
            client.subscribe('/RSPInfluxPressio');
            client.subscribe('/RSPInfluxAlcada');
        });

        client.on('message', function(topic, message) {

            switch (topic) {

                case '/RSP0temperatura':
                    console.log('Temperatura: ' + message.toString());
                    _self.temperatura = message.toString();
                    break;

                case '/RSPInfluxTemp':
                    console.log('RSPInfluxTemp: ' + message.toString());
                    let dataT = JSON.parse(message);

                    dataT.forEach(element => {
                        _self.influxTemp.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timeInfluxTemp.push(splited.join(' '));
                    });
                    break;

                case '/RSPInfluxPressio':
                    console.log('RSPInfluxPressio: ' + message.toString());
                    let dataP = JSON.parse(message);

                    dataP.forEach(element => {
                        _self.influxPress.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timeInfluxPress.push(splited.join(' '));
                    });
                    break;

                case '/RSPInfluxAlcada':
                    console.log('RSPInfluxAlcada: ' + message.toString());
                    let dataA = JSON.parse(message);
                    dataA.forEach(element => {
                        _self.influxAlcada.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timeUnfluxAlcada.push(splited.join(' '));
                    });
                    break;

            }

            if (_self.temperatura && _self.influxAlcada && _self.influxPress && _self.influxTemp) {
                //_self.loading = false;
                _self.comprovarMeteo();
            }
        });

    },
    methods: {
        comprovarMeteo: function() {

            console.log('calcul meteo');
            _self.loading = false;

            console.log('Last temp: ' + _self.influxTemp[_self.influxTemp - 1]);

            if (_self.influxPress[_self.influxPress.length - 1] > 1013 && _self.influxTemp[_self.influxTemp - 1] <= 15) {
                console.log('sol :)');
            }

        }
    }
});
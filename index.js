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
        nuvol: false,
        sol: false,
        inestavilitat: false,
        milloraTemps: false,
        tempPuja: 0,
        tempBaixa: 0,
        pressIgual: 0,
        pressBaixa: 0,
        pressPuja: 0

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
                _self.comprovarMeteo();
            }
        });

    },
    methods: {
        comprovarMeteo: function() {

            console.log('Calculant meteorologia');

            for (let i = 0; i < _self.influxTemp.length; i++) {

                if (i == 0) {
                    continue;
                }

                if (_self.influxTemp[i] > _self.influxTemp[i - 1]) {
                    _self.tempPuja++;
                }

                if (_self.influxTemp[i] < _self.influxTemp[i - 1]) {
                    _self.tempBaixa++;
                }

                if (Math.trunc(_self.influxPress[i]) == Math.trunc(_self.influxPress[i - 1])) {
                    _self.pressIgual++;
                }

                if (_self.influxPress[i] < _self.influxPress[i - 1]) {
                    _self.pressBaixa++;
                }

                if (_self.influxPress[i] > _self.influxPress[i - 1]) {
                    _self.pressPuja++;
                }

                if (_self.tempPuja >= _self.influxTemp.length / 2 && _self.pressIgual >= _self.influxPress.length / 2) {
                    console.log('nublat UwU');
                    _self.nuvol = true;
                    _self.sol = false;
                    _self.inestavilitat = false;
                    _self.milloraTemps = false;
                } else if (_self.influxPress[_self.influxPress.length - 1] >= 1013 && _self.tempPuja >= _self.influxTemp.length / 2) {
                    console.log('sol UwU');
                    _self.sol = true;
                    _self.nuvol = false;
                    _self.inestavilitat = false;
                    _self.milloraTemps = false;
                } else if (_self.pressBaixa >= _self.influxPress.length / 2) {
                    console.log('inestabilitat properament');
                    _self.inestavilitat = true;
                    _self.milloraTemps = false;
                    _self.sol = false;
                    _self.nuvol = false;
                } else if (_self.pressPuja >= _self.influxPress.length / 2) {
                    console.log('el temps millorar??');
                    _self.milloraTemps = true;
                    _self.sol = false;
                    _self.nuvol = false;
                    _self.inestavilitat = false;
                }
                _self.loading = false;

            }


        }
    }
});
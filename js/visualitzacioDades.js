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

var app = new Vue({
    el: '#app',
    data: function() {
        return {
            pressio: '',
            temperatura: '',
            alcada: '',
            lat: '',
            lon: '',
            mapaIniciat: true,
            loading: true
        }
    },
    mounted: function() {

        _self = this;

        const client = mqtt.connect(host, options);

        client.on('connect', function() {
            console.log('Connected to broker');
            client.subscribe('/RSP0temperatura');
            client.subscribe('/RSP0pressio');
            client.subscribe('/RSP0altitude');
            client.subscribe('/RSP0latitude');
            client.subscribe('/RSP0longitude');
        });

        client.on('message', function(topic, message) {

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

                case '/RSP0latitude':
                    console.log('Latitude: ' + message.toString());
                    _self.lat = message.toString();
                    break;

                case '/RSP0longitude':
                    console.log('Longitude: ' + message.toString());
                    _self.log = message.toString();
                    break;
            }

            if (_self.lat && _self.log && _self.mapaIniciat) {

                let ubicacio = { latitud: _self.lat, logitud: _self.log }
                _self.mapaIniciat = false;
                client.unsubscribe('/RSP0latitude');
                client.unsubscribe('/RSP0longitude');
                _self.mapa(ubicacio);
            }

        });

    },
    methods: {
        mapa: function(ubi) {

            map = L.map('map').setView([ubi.latitud, ubi.logitud], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([ubi.latitud, ubi.logitud]).addTo(map)
                .bindPopup('Estació meteorologica')
                .openPopup();

            _self.loading = false;
        }
    }

});
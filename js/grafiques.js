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
    data: function() {
        return {
            loading: true,
            dataTemp: '',
            tempValue: [],
            timeValue: [],
            dataPressio: '',
            pressioValue: [],
            timePValue: [],
            dataAlcada: '',
            alcadaValue: [],
            timeAValue: [],
            mostraLinial: false,
            mostraLinial: false
        }
    },
    mounted: function() {
        _self = this;

        const client = mqtt.connect(host, options);

        client.publish('/RSPGetInflux', 'Dadestemp');

        client.on('connect', function() {
            console.log('Connected to broker');
            client.subscribe('/RSPInfluxTemp');
            client.subscribe('/RSPInfluxPressio');
            client.subscribe('/RSPInfluxAlcada');
        });

        client.on('message', function(topic, message) {

            switch (topic) {

                case '/RSPInfluxTemp':
                    _self.dataTemp = JSON.parse(message);
                    console.log(_self.dataTemp);
                    _self.dataTemp.forEach(element => {
                        _self.tempValue.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timeValue.push(splited.join(' '));
                    });
                    break;

                case '/RSPInfluxPressio':
                    _self.dataPressio = JSON.parse(message);
                    console.log(_self.dataPressio);
                    _self.dataPressio.forEach(element => {
                        _self.pressioValue.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timePValue.push(splited.join(' '));
                    });
                    break;

                case '/RSPInfluxAlcada':
                    _self.dataAlcada = JSON.parse(message);
                    console.log(_self.dataAlcada);
                    _self.dataAlcada.forEach(element => {
                        _self.alcadaValue.push(element.value);
                        let time = element.time;
                        let splited = time.split('T');
                        splited[1] = splited[1].slice(0, 8)
                        _self.timeAValue.push(splited.join(' '));
                    });
                    break;
            }

            if (_self.dataTemp.length == 10 && _self.dataAlcada.length == 10 && _self.dataPressio.length == 10) {
                _self.loading = false;
                _self.tipusGrafic();
            }
        });

    },
    methods: {
        comprovarTemperatures: function() {
            console.log(this.temperatura);
            console.log(this.pressio);
            console.log(this.alcada);
        },
        tipusGrafic: function() {
            let tgrafic = document.getElementById('tipusG').value;

            console.log(tgrafic);

            if (tgrafic == 'line') {
                let variable = document.getElementById('graficaBarres').hidden = true;
                let variable2 = document.getElementById('graficaTemp').hidden = false;
                this.grafic();
            } else {
                let variable = document.getElementById('graficaTemp').hidden = true;
                let variable2 = document.getElementById('graficaBarres').hidden = false;
                this.graficBarres();
            }

        },
        grafic: function() {

            _self = this;

            var myChart;

            var ctx = document.getElementById('graficaTemp').getContext('2d');

            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: _self.timeValue,
                    datasets: [{
                            label: 'Temperatura',
                            data: _self.tempValue,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Pressio',
                            data: _self.pressioValue,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Alçada',
                            data: _self.alcadaValue,
                            backgroundColor: [
                                'rgba(38, 166, 91, 1)',

                            ],
                            borderColor: [
                                'rgba(38, 166, 91, 1)',
                            ],
                            borderWidth: 1
                        }
                    ]
                }
            });

            myChart.hide(1);
            myChart.hide(2);
        },
        graficBarres: function() {

            _self = this;

            var graficBarr;

            var ctx = document.getElementById('graficaBarres').getContext('2d');

            graficBarr = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: _self.timeValue,
                    datasets: [{
                            label: 'Temperatura',
                            data: _self.tempValue,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Pressio',
                            data: _self.pressioValue,
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.2)',
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)'
                            ],
                            borderWidth: 1
                        },
                        {
                            label: 'Alçada',
                            data: _self.alcadaValue,
                            backgroundColor: [
                                'rgba(38, 166, 91, 0.2)',

                            ],
                            borderColor: [
                                'rgba(38, 166, 91, 1)',
                            ],
                            borderWidth: 1
                        }
                    ]
                }
            });

            graficBarr.hide(1);
            graficBarr.hide(2);
        }

    }

});
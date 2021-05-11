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
    data: function () {
        return {
            pressio: [],
            temperatura: [],
            alcada: []
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
                        _self.pressio.push({ y: message.toString() });
                        break;

                    case '/RSP0temperatura':
                        console.log('Temperatura: ' + message.toString());
                        _self.temperatura.push({ y: message.toString() });
                        break;

                    case '/RSP0altitude':
                        console.log('Alçada: ' + message.toString());
                        _self.alcada.push({ y: message.toString() });
                        break;
                }
            });
    },
    methods: {
        comprovarTemperatures: function () {
            console.log(this.temperatura);
            console.log(this.pressio);
            console.log(this.alcada);
        },
        grafic: function () {
            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,

                title: {
                    text: "Fortune 500 Companies by Country"
                },
                axisX: {
                    interval: 1
                },
                axisY2: {
                    interlacedColor: "rgba(1,77,101,.2)",
                    gridColor: "rgba(1,77,101,.1)",
                    title: "Number of Companies"
                },
                data: [{
                    type: "bar",
                    name: "companies",
                    axisYType: "secondary",
                    color: "#014D65",
                    dataPoints: [
                        { y: 3, label: "Sweden" },
                        { y: 7, label: "Taiwan" },
                        { y: 5, label: "Russia" },
                        { y: 9, label: "Spain" },
                        { y: 7, label: "Brazil" },
                        { y: 7, label: "India" },
                        { y: 9, label: "Italy" },
                        { y: 8, label: "Australia" },
                        { y: 11, label: "Canada" },
                        { y: 15, label: "South Korea" },
                        { y: 12, label: "Netherlands" },
                        { y: 15, label: "Switzerland" },
                        { y: 25, label: "Britain" },
                        { y: 28, label: "Germany" },
                        { y: 29, label: "France" },
                        { y: 52, label: "Japan" },
                        { y: 103, label: "China" },
                        { y: 134, label: "US" }
                    ]
                }]
            });
            chart.render();
        }

    }

});
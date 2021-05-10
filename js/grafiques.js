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

let grafiques = Vue.component('grafiques', {
    data: function () {
        return {
            pressio: [{}],
            temperatura: [],
            alcada: [{}],
        }
    },
    methods:{
        comprovarTemperatures: function(){
            console.log(this.temperatura);
        }
    },
    mounted: function () {

        var temperatures = [];

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
                    //Vue.set(this.pressio, message.toString());   
                    break;

                case '/RSP0temperatura':
                    console.log('Temperatura: ' + message.toString());
                    temperatures.push(message.toString());
                    break;

                case '/RSP0altitude':
                    console.log('Alçada: ' + message);
                    //this.alcada.push(message.toString());
                    break;
            }

            this.temperatura = Array.from(temperatures);

        });
    },
    template: `
    <div class="grafics">
        <h1>Gràfiques</h1>
        <button v-on:click="comprovarTemperatures()">Comprova arrays</button>
    </div>`

});

export { grafiques }
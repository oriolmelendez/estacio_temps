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

let dadesDir = Vue.component('dadesDir',{
    data: function(){
        return{
            pressio: '',
            temperatura: '',
            alcada:''
        }
    },
    beforeMount: function () {

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
                    this.pressio = message.toString();
                    break;

                case '/RSP0temperatura':
                    console.log('Temperatura: ' + message.toString());
                    this.temperatura = message.toString();
                    break;

                case '/RSP0altitude':
                    console.log('Alçada: ' + message.toString());
                    this.alcada = message.toString();
                    break;
            }

        });
    },
    template: `
    <div class="stream">
        <h1>Dades en temps real:</h1>
        <p>Pressió:</p>
        <p>Temperatura: {{temperatura}}</p>
        <p>Alçada: {{alcada}}</p>
    </div>`

});

export {dadesDir}
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

let gestio = Vue.component('Gestio', {

    methods: {
        ledON: function (value) {
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
        }
    },
    template: `
    <div class="gestio"> 
        <h1 class="titol">Gestió placa</h1>
        <img class="placaimg" src="./img/rainbowhat.jpg" usemap="#placa">
        <map name="placa">
            <area shape="rect" coords="50,195,590,941" @click="text()">
        </map>
        <div class="ledsSelector">
            <label>Selecciona el LED:   </label>
            <select id="leds">
                <option value="0">Led 0</option>
                <option value="1">Led 1</option>
                <option value="2">Led 2</option>
                <option value="3">Led 3</option>
                <option value="4">Led 4</option>
                <option value="5">Led 5</option>
                <option value="6">Led 6</option>
            </select>
        </div>
    </div>`

});

export { gestio }
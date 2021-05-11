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
            pressio: '',
            temperatura: '',
            alcada: '',
            lat: '',
            lon: ''
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
            client.subscribe('/RSP0latitude');
            client.subscribe('/RSP0longitude');
        });

        client.on('message', function (topic, message) {

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
                    _self.lon = message.toString();
                    break;
            }

        });

        this.mapa();
    },
    methods:{
        mapa: function(){

            var view = new ol.View({
                center: [0, 0],
                zoom: 2
              });
              
              var map = new ol.Map({
                layers: [
                  new ol.layer.Tile({
                    source: new ol.source.OSM()
                  })
                ],
                target: 'map',
                controls: ol.control.defaults({
                  attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                  })
                }),
                view: view
              });
              
              var geolocation = new ol.Geolocation({
                trackingOptions: {
                  enableHighAccuracy: true,
                },
                projection: view.getProjection(),
              });
                
              var accuracyFeature = new ol.Feature();
              
              var positionFeature = new ol.Feature();
              positionFeature.bindTo('geometry', geolocation, 'position')
                  .transform(function() {}, function(coordinates) {
                    return coordinates ? new ol.geom.Point(coordinates) : null;
                  });
              
              var featuresOverlay = new ol.FeatureOverlay({
                map: map,
                features: [accuracyFeature, positionFeature]
              });
        }
    }

});
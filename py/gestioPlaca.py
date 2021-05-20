import random
import rainbowhat as rh
from paho.mqtt import client as mqtt_client
import time
import json


broker = 'broker.emqx.io'
port = 1883

topic = "/RSPled"
topicLeds = "/RSPTots"
topicEscriptura = "/RSPEscriure"
topicSo = "/RSPESo"

client_id = f'python-mqtt-{random.randint(0, 100)}'
leds = ['0','1','2','3','4','5','6']


def connect_mqtt() -> mqtt_client:
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        if(msg.topic == '/RSPled'):
            led = msg.payload.decode()
            print(led)
            rh.rainbow.clear()
            rh.rainbow.set_pixel(6, 255, 0, 0)
            rh.rainbow.show()
            time.sleep(3)
            rh.rainbow.set_all(0,0,0)
            rh.rainbow.show()

        if(msg.topic == '/RSPTots'):
            print('All leds')
            rh.rainbow.clear()
            rh.rainbow.set_all(255,0,0)
            rh.rainbow.show()
            time.sleep(3)
            rh.rainbow.set_all(0,0,255)
            rh.rainbow.show()
            

        if(msg.topic == '/RSPEscriure'):
            rh.display.print_str(msg.payload.decode())
            rh.display.show()

        if(msg.topic == '/RSPESo'):
            print('Emetent so')
            data = json.loads(msg.payload.decode())
            rh.buzzer.note(data["freq"],data["duracio"])

    client.subscribe(topic)
    client.subscribe(topicLeds)
    client.subscribe(topicEscriptura)
    client.subscribe(topicSo)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()

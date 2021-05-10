import random
import rainbowhat as rh
from paho.mqtt import client as mqtt_client


broker = 'broker.emqx.io'
port = 1883

topic = "/RSPled"
topicLeds = "/RSPTots"
topicEscriptura = "/RSPEscriure"

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
            Leds(msg.payload.decode())

        if(msg.topic == '/RSPTots'):
            print('All leds')
            rh.rainbow.set_all(255,0,0)
            rh.rainbow.show()

        if(msg.topic == '/RSPEscriure'):
            rh.display.print_str(msg.payload.decode())
            rh.display.show()


    #print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
    client.subscribe(topic)
    client.subscribe(topicLeds)
    client.subscribe(topicEscriptura)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()

def Leds(value):

    for led in leds:
        if(led == value):
            print('LED: '+value);
            rh.rainbow.set_pixel(int(value), 255, 0, 0)
            rh.rainbow.show()
    

if __name__ == '__main__':
    run()
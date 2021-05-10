import paho.mqtt.client as MQTT
import rainbowhat as rh
import time

# Get temperature
temperature = round(rh.weather.temperature(),2)
pressure = round(rh.weather.pressure(),2)
altitude = round(rh.weather.altitude(pressure)*0.0254,2)

# Creating client
client = MQTT.Client('ormebo')

# Connect to broker
client.connect("broker.emqx.io",1883)


# Publish a message with topic
client.publish("/RSP0temperatura",str(temperature),0,False)
client.publish("/RSP0pressio",str(pressure),0,False)
client.publish("/RSP0altitude",str(altitude),0,False)

#Receive messages
client.subscribe("RSPled")
client.on_message = print(on_message)
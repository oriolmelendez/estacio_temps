import paho.mqtt.client as MQTT
import rainbowhat as rh
import time
from geopy.geocoders import Nominatim

#Get position
loc = Nominatim(user_agent="GetLoc")
location = loc.geocode("Barcelona, Spain").raw

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
client.publish("/RSP0latitude",location.get('lat'),0,False)
client.publish("/RSP0longitude",location.get('lon'),0,False)

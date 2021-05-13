import paho.mqtt.client as MQTT
import rainbowhat as rh
import time
from geopy.geocoders import Nominatim
from gpiozero import CPUTemperature

# Capturar temperatura CPU
cpu = CPUTemperature()

#Get position
loc = Nominatim(user_agent="GetLoc")
location = loc.geocode("Barcelona, Spain").raw

# Capturar temperatura/pressio/alçada
temperature = round((cpu.temperature - rh.weather.temperature()),2)
pressure = round(rh.weather.pressure(),2)
altitude = round(rh.weather.altitude(pressure)*0.0254,2)

# Creació del client
client = MQTT.Client('ormebo')

# Connexió al broker
client.connect("broker.emqx.io",1883)


# Publicar dades al topic
client.publish("/RSP0temperatura",str(temperature),0,False)
client.publish("/RSP0pressio",str(pressure),0,False)
client.publish("/RSP0altitude",str(altitude),0,False)
client.publish("/RSP0latitude",location.get('lat'),0,False)
client.publish("/RSP0longitude",location.get('lon'),0,False)
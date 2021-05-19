#Import MQTT
import paho.mqtt.client as MQTT

# importing geopy library
from geopy.geocoders import Nominatim

#MQTT Broker conection
client = MQTT.Client('ormebo')
client.connect("broker.emqx.io",1883)


# calling the Nominatim tool
loc = Nominatim(user_agent="GetLoc")
  
# entering the location name
location = loc.geocode("Barcelona, Spain").raw
client.publish("/RSP0latitude",location.get('lat'),0,False)
client.publish("/RSP0longitude",location.get('lon'),0,False)

#print(location.get('lat'))
#print(location.get('lon'))

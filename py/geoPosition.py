# importing geopy library
from geopy.geocoders import Nominatim

# calling the Nominatim tool
loc = Nominatim(user_agent="GetLoc")
  
# entering the location name
location = loc.geocode("Barcelona, Spain").raw

print(location.get('lat'))
print(location.get('lon'))

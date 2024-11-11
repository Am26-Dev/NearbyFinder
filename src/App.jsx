import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";

const App = () => {
  const [userPosition, setUserPosition] = useState({
    latitude: 28.6139,
    longitude: 77.209,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [amenityType, setAmenityType] = useState("");

  //=====================icons for different amenities====================================
  const icons = {
    school: new Icon({ iconUrl: "/school.png", iconSize: [40, 40] }),
    hospital: new Icon({ iconUrl: "/healthcare.png", iconSize: [40, 40] }),
    restaurant: new Icon({ iconUrl: "/restaurant.png", iconSize: [40, 40] }),
    hotel: new Icon({ iconUrl: "/hotel.png", iconSize: [40, 40] }),
    atm: new Icon({ iconUrl: "/atm.png", iconSize: [40, 40] }),
    bank: new Icon({ iconUrl: "/marker.png", iconSize: [40, 40] }),
    library: new Icon({ iconUrl: "/library.png", iconSize: [40, 40] }),
    cafe: new Icon({ iconUrl: "/cafe.png", iconSize: [40, 40] }),
    parking: new Icon({ iconUrl: "/parking.png", iconSize: [40, 40] }),
    cinema: new Icon({ iconUrl: "/cinema.png", iconSize: [40, 40] }),
    pharmacy: new Icon({ iconUrl: "/pharmacy.png", iconSize: [40, 40] }),

    default: new Icon({ iconUrl: "/marker.png", iconSize: [40, 40] }),
  };

  useEffect(() => {
    if (amenityType && markerPosition) {
      fetchNearbyPlaces(userPosition.latitude, userPosition.longitude);
    }
  }, [amenityType]); // re-fetching when amenity type changes

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const latitude = parseFloat(suggestion.lat);
    const longitude = parseFloat(suggestion.lon);

    setUserPosition({ latitude, longitude });
    setMarkerPosition([latitude, longitude]);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    fetchNearbyPlaces(latitude, longitude);
  };

  const fetchNearbyPlaces = async (latitude, longitude) => {

    if (!amenityType) return; // Skip fetching if no amenity type is selected

    try {
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter?data=[out:json];node(around:2000,${latitude},${longitude})[amenity=${amenityType}];out;`
      );

      const places = response.data.elements.map((place) => ({
        name: place.tags.name,
        lat: place.lat,
        lon: place.lon,
        type: place.tags.amenity,
      }));

      setNearbyPlaces(places);
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    }

  };

  const UpdateMapCenter = () => {

    const map = useMap();
    useEffect(() => {
      map.setView([userPosition.latitude, userPosition.longitude], 13);
    }, [userPosition, map]);
    return null;

  };

  return (

    <>

      <div className="p-4">

        <div className="flex gap-5 relative mb-4">

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border-2 border-blue-400 rounded p-2 text-base w-72"
            placeholder="Search for a place"
          />
          <select
            onChange={(e) => setAmenityType(e.target.value)}
            className="border-2 border-indigo-500 px-5 rounded-full py-2 text-lg"
            value={amenityType}
          >
            <option value="">Select Amenity</option>
            <option value="school">School</option>
            <option value="hospital">Hospital</option>
            <option value="restaurant">Restaurant</option>
            <option value="mall">Mall</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="bank">Bank</option>
            <option value="atm">ATM</option>
            <option value="library">Library</option>
            <option value="cafe">Cafe</option>
            <option value="parking">Parking</option>
            <option value="hotel">Hotel</option>
            <option value="cinema">Cinema</option>
          </select>
          {suggestions.length > 0 && (
            <ul
              className="list-none m-0 p-2 border-gray-200 w-80 max-h-[150px] overflow-auto bg-white absolute  top-10"
              style={{
                zIndex: 1000,
              }}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <MapContainer
          center={[userPosition.latitude, userPosition.longitude]}
          zoom={13}
          className="h-[100vh] w-[100%]"
        >
          <UpdateMapCenter />
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && (
            <Marker position={markerPosition} icon={icons.default}>
              <Popup>{searchQuery}</Popup>
            </Marker>
          )}
          {nearbyPlaces.map((place, index) => (
            <Marker
              key={index}
              position={[place.lat, place.lon]}
              icon={icons[place.type] || icons.default}
            >
              <Popup>
                {place.name} <br /> Type: {place.type}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
};

export default App;

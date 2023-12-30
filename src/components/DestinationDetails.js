import "../index.css";
import "leaflet/dist/leaflet.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { icon } from "leaflet";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
  Center,
  Icon,
  Grid,
  GridItem,
  Spacer,
} from "@chakra-ui/react";

function DestinationDetails() {
  const location = useLocation();
  const destination = location.state.destination;
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${destination.city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    const fetchForecast = async () => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/forecast?q=${destination.city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
        );
        setForecast(response.data.list);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    fetchWeather();
    fetchForecast();
  }, [destination]);

  if (!weather) {
    return <div>Loading...</div>;
  }

  const weatherIconMap = {
    "01d": "CLEAR_DAY",
    "02d": "PARTLY_CLOUDY_DAY",
    "03d": "CLOUDY",
    "04d": "CLOUDY",
    "09d": "RAIN",
    "10d": "RAIN",
    "11d": "RAIN",
    "13d": "SNOW",
    "50d": "FOG",
    "01n": "CLEAR_NIGHT",
    "02n": "PARTLY_CLOUDY_NIGHT",
    "03n": "CLOUDY",
    "04n": "CLOUDY",
    "09n": "RAIN",
    "10n": "RAIN",
    "11n": "RAIN",
    "13n": "SNOW",
    "50n": "FOG",
  };

  const weatherIcon = weatherIconMap[weather.weather[0].icon];

  const redIcon = icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41], // size of the icon
    shadowSize: [41, 41], // size of the shadow
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  });

  return (
    <VStack spacing={8} align="start">
      <Box
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="sm"
        maxW="3xl"
        m="auto"
      >
        <VStack spacing={8} align="start">
          <Heading size="2xl">{destination.name}</Heading>
          <Text fontSize="lg">{destination.description}</Text>
          <Image
            src={destination.image_url}
            alt={destination.name}
            boxSize="300px"
            objectFit="cover"
            borderRadius="md"
            width="100%"
          />

          {/*-----------------------------------------------------WEATHER------------------------------------------------------*/}
          <Box
            p={8}
            borderRadius="md"
            boxShadow="sm"
            maxW="3xl"
            m="auto"
            boxSize="700px"
          >
            <VStack spacing={8} align="start">
              <Heading size="xl">Today's Weather</Heading>
              <Flex width="100%">
                <ReactAnimatedWeather
                  icon={weatherIcon}
                  color="#000"
                  size={100}
                  animate={true}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
                <Spacer />
                <Text fontSize="6xl" fontWeight="bold">
                  {weather.main.temp}°C
                </Text>
              </Flex>
              <HStack spacing={8} wrap="wrap">
                <VStack spacing={1} align="center">
                  <Icon as={WiHumidity} boxSize={6} />
                  <Text fontSize="md" fontWeight="bold">
                    {weather.main.humidity}%
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={WiStrongWind} boxSize={6} />
                  <Text fontSize="md" fontWeight="bold">
                    {weather.wind.speed} m/s
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={WiSunrise} boxSize={6} />
                  <Text fontSize="md" fontWeight="bold">
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
                  </Text>
                </VStack>
                <VStack spacing={1} align="center">
                  <Icon as={WiSunset} boxSize={6} />
                  <Text fontSize="md" fontWeight="bold">
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                  </Text>
                </VStack>
              </HStack>
              <Button colorScheme="blue" size="lg">
                Plan a Trip
              </Button>
              {/*-----------------------------------------------------MAP------------------------------------------------------*/}
              <MapContainer
                center={[destination.latitude, destination.longitude]}
                zoom={13}
                style={{ height: "300px", width: "600px", margin: "0 auto" }}
                scrollWheelZoom={false}
                whenCreated={(mapInstance) => {
                  setTimeout(() => {
                    mapInstance.invalidateSize();
                  }, 0);
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[destination.latitude, destination.longitude]}
                  icon={redIcon}
                >
                  <Popup>{destination.name}</Popup>
                </Marker>
              </MapContainer>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}

export default DestinationDetails;

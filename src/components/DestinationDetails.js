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
  WiBarometer,
  WiHorizonAlt,
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
  Spinner,
  Spacer,
  useMediaQuery,
} from "@chakra-ui/react";

function DestinationDetails() {
  const location = useLocation();
  const destination = location.state.destination;
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");
  const [isCelsius, setIsCelsius] = useState(true);

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
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Spinner
          size="xl"
          speed="0.65s"
          color="blue.500"
          emptyColor="gray.200"
          thickness="4px"
        />
        <Text mt={4} fontSize="lg" fontWeight="semibold" color="gray.500">
          Loading...
        </Text>
      </Box>
    );
  }

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const temperature = isCelsius
    ? Math.round(weather.main.temp)
    : Math.round((weather.main.temp * 9) / 5 + 32);
  const temperatureUnit = isCelsius ? "°C" : "°F";

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
    <VStack
      spacing={8}
      align="start"
      width="100%"
      maxW={isSmallScreen ? "90%" : "60%"}
      m="auto"
    >
      <Box bg="white" p={8} borderRadius="md" boxShadow="sm" width="100%">
        <VStack spacing={8} align="start">
          <Flex justify="space-between" align="center" width="100%">
            <Heading size={isSmallScreen ? "xl" : "2xl"} color="gray.800">
              {destination.name}
            </Heading>
            <Button colorScheme="gray" size={isSmallScreen ? "sm" : "lg"}>
              Plan a Trip
            </Button>
          </Flex>
          <Text fontSize="lg" color="gray.600">
            {destination.description}
          </Text>
          <Image
            src={destination.image_url}
            alt={destination.name}
            boxSize={isSmallScreen ? "200px" : "300px"}
            objectFit="cover"
            borderRadius="md"
            width="100%"
          />

          {/*-----------------------------------------------------WEATHER------------------------------------------------------*/}
          <Box p={8} borderRadius="md" boxShadow="sm" width="100%">
            <VStack spacing={8} align="start">
              <Heading size="xl" color="gray.800">
                Today's Weather at {destination.name}
              </Heading>
              <Flex
                direction={isSmallScreen ? "column" : "row"}
                align="center"
                justify="space-between"
                width="100%"
              >
                <Box align="center">
                  <ReactAnimatedWeather
                    icon={weatherIcon}
                    color="#000"
                    size={isSmallScreen ? 50 : 100}
                    animate={true}
                  />
                  <Text
                    fontSize={isSmallScreen ? "4xl" : "6xl"}
                    fontWeight="bold"
                    color="gray.700"
                    onClick={toggleTemperatureUnit}
                    cursor="pointer"
                  >
                    {temperature}
                    {temperatureUnit}
                  </Text>
                </Box>
                <VStack align="start" spacing={4}>
                  <Text color="gray.500">{weather.weather[0].description}</Text>

                  <HStack spacing={4}>
                    <WiStrongWind />
                    <Text color="gray.600">Wind: {weather.wind.speed} m/s</Text>
                  </HStack>
                  <HStack spacing={4}>
                    <WiHumidity />
                    <Text color="gray.600">
                      Humidity: {weather.main.humidity}%
                    </Text>
                  </HStack>
                  <HStack spacing={4}>
                    <WiBarometer />
                    <Text color="gray.600">
                      Pressure: {weather.main.pressure} hPa
                    </Text>
                  </HStack>
                  <HStack spacing={4}>
                    <WiHorizonAlt />
                    <Text color="gray.600">
                      Visibility: {weather.visibility / 1000} km
                    </Text>
                  </HStack>
                </VStack>
              </Flex>
              <HStack spacing={8} wrap="wrap" justify="space-between">
                {/* ... */}
              </HStack>

              {/*-----------------------------------------------------MAP------------------------------------------------------*/}
              <MapContainer
                center={[destination.latitude, destination.longitude]}
                zoom={13}
                style={{
                  height: isSmallScreen ? "200px" : "400px", // Increase the height on larger screens
                  width: "100%",
                  margin: "0 auto",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", // Add a slight shadow
                }}
                scrollWheelZoom={false}
                whenCreated={(mapInstance) => {
                  setTimeout(() => {
                    mapInstance.invalidateSize();
                  }, 0);
                }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Use a custom map style
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

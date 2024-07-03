import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
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
  Flex,
  Icon,
  Spinner,
  Container,
  Badge,
  Grid,
  GridItem,
  useBreakpointValue,
} from "@chakra-ui/react";

function DestinationDetails({ navbar, footer }) {
  const location = useLocation();
  const destination = location.state.destination;
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);

  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${destination.city}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error(error);
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
      }
    };

    fetchWeather();
    fetchForecast();
  }, [destination]);

  if (!weather || !forecast) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemp = (temp) => {
    return isCelsius ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
  };

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
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [4, 62],
    popupAnchor: [1, -34],
  });

  const weeklyForecast = forecast.filter((item, index) => index % 8 === 0).slice(0, 7);

  return (
    <>
      {navbar}
      <Container maxW="container.xl" py={8} px={4} paddingBlockStart={{ base: 16, md: 20 }}>
        <VStack spacing={8} align="stretch">
          <Image
            src={destination.image_url}
            alt={destination.name}
            borderRadius="lg"
            objectFit="cover"
            height={{ base: "200px", md: "400px" }}
            width="100%"
          />

          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size={{ base: "xl", md: "2xl" }}>{destination.name}</Heading>
            <Button
              colorScheme="teal"
              size={{ base: "md", md: "lg" }}
              onClick={() => navigate(`/plan/trip`, { state: { destination } })}
            >
              Plan a Trip
            </Button>
          </Flex>

          <Text fontSize={{ base: "md", md: "xl" }}>{destination.description}</Text>

          <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
            <VStack spacing={6} align="stretch">
              <Heading size={{ base: "lg", md: "xl" }}>Weather in {destination.name}</Heading>

              <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={6}>
                <HStack spacing={6} align="center">
                  <ReactAnimatedWeather
                    icon={weatherIcon}
                    color="#4299E1"
                    size={isMobile ? 80 : 100}
                    animate={true}
                  />
                  <VStack align="start" spacing={0}>
                    <Text
                      fontSize={{ base: "4xl", md: "6xl" }}
                      fontWeight="bold"
                      onClick={toggleTemperatureUnit}
                      cursor="pointer"
                    >
                      {convertTemp(weather.main.temp)}
                      {temperatureUnit}
                    </Text>
                    <Badge fontSize="md" colorScheme="blue">
                      {weather.weather[0].description}
                    </Badge>
                  </VStack>
                </HStack>

                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4} width="100%">
                  <WeatherInfo icon={WiThermometer} label="Feels Like" value={`${convertTemp(weather.main.feels_like)}${temperatureUnit}`} />
                  <WeatherInfo icon={WiStrongWind} label="Wind" value={`${weather.wind.speed} m/s`} />
                  <WeatherInfo icon={WiHumidity} label="Humidity" value={`${weather.main.humidity}%`} />
                  <WeatherInfo icon={WiHorizonAlt} label="Visibility" value={`${weather.visibility / 1000} km`} />
                  <WeatherInfo icon={WiSunrise} label="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString()} />
                  <WeatherInfo icon={WiSunset} label="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString()} />
                </Grid>
              </Flex>

              <Box mt={6}>
                <Heading size="md" mb={4}>7-Day Forecast</Heading>
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(7, 1fr)" }} gap={4}>
                  {weeklyForecast.map((day, index) => (
                    <GridItem key={index} p={4} bg="gray.50" borderRadius="md" textAlign="center">
                      <Text fontWeight="bold">{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                      <ReactAnimatedWeather
                        icon={weatherIconMap[day.weather[0].icon]}
                        color="#4299E1"
                        size={isMobile ? 30 : 40}
                        animate={true}
                      />
                      <Text mt={2}>{convertTemp(day.main.temp)}{temperatureUnit}</Text>
                      <Text fontSize="xs" mt={1}>{day.weather[0].description}</Text>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </VStack>
          </Box>

          <Box height={{ base: "300px", md: "400px" }} borderRadius="lg" overflow="hidden" boxShadow="md">
            <MapContainer
              center={[destination.latitude, destination.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
              whenCreated={(mapInstance) => {
                setTimeout(() => {
                  mapInstance.invalidateSize();
                }, 0);
              }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={redIcon}
              >
                <Popup>{destination.name}</Popup>
              </Marker>
            </MapContainer>
          </Box>
        </VStack>
      </Container>
      {footer}
    </>
  );
}

function WeatherInfo({ icon, label, value }) {
  return (
    <HStack spacing={2} bg="gray.50" p={2} borderRadius="md">
      <Icon as={icon} boxSize={6} color="blue.500" />
      <VStack align="start" spacing={0}>
        <Text color="gray.500" fontSize="xs">{label}</Text>
        <Text color="gray.700" fontWeight="medium" fontSize="sm">{value}</Text>
      </VStack>
    </HStack>
  );
}

export default DestinationDetails;
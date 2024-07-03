import "./PlanTrip.css";
import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Box,
  Flex,
  FormLabel,
  Input,
  FormControl,
  Button,
  Textarea,
  Heading,
  useToast,
  Spinner,
  Select,
  Container,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { FaMap, FaCalendarAlt, FaBed, FaStickyNote } from "react-icons/fa";
import axios from "axios";
import { UserAuthContext } from "../../utils/UserAuthContext";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function PlanTrip({ navbar, footer }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const location = useLocation();
  const destination = location.state.destination;
  const { savedUser } = useContext(UserAuthContext);
  const user = JSON.parse(savedUser);

  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    destination_id: destination.id,
    user_id: user.user.id,
    start_date: "",
    end_date: "",
    notes: "",
    trip_name: "",
    trip_accommodation: "",
  });

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const cardBgColor = useColorModeValue("white", "gray.800");

  const isMobile = useBreakpointValue({ base: true, md: false });

  function Routing({ from, to }) {
    const map = useMap();

    useEffect(() => {
      if (from && to) {
        try {
          L.Routing.control({
            waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
            draggableWaypoints: true,
            fitSelectedRoutes: true,
            showAlternatives: false,
            routeLine: (route) => {
              const line = L.Routing.line(route, {
                styles: [
                  { color: "black", opacity: 0.15, weight: 9 },
                  { color: "white", opacity: 0.8, weight: 6 },
                  { color: "teal", opacity: 1, weight: 2 },
                ],
              });
              return line;
            },
          }).addTo(map);
        } catch (error) {
          console.error("Error adding routing control:", error);
          setMapError("Error loading route. Please try again.");
        }
      }
      setIsLoading(false);
    }, [from, to, map]);

    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/trips/trips`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: "Trip created.",
        description: "Your trip has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to create your trip.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setMapError(
            "Unable to get your current location. Please check your browser settings."
          );
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setMapError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      if (destination) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/accommodations/accommodations/${destination.city}`,
            { withCredentials: true }
          );
          setAccommodations(response.data);
        } catch (error) {
          console.error("Error fetching accommodations:", error);
          toast({
            title: "Error",
            description: "Unable to fetch accommodations. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };
    fetchAccommodations();
  }, [destination, toast]);

  const bounds =
    currentLocation && destination
      ? [
          [currentLocation[0], currentLocation[1]],
          [destination.latitude, destination.longitude],
        ]
      : null;

  const startIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const endIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <>
      {navbar}
      <Container maxW="container.xl" py={8} px={4} mt={{ base: 16, md: 20 }}>
        <Box
          boxShadow="xl"
          p={{ base: 4, md: 8 }}
          rounded="lg"
          bg={cardBgColor}
          mb={8}
        >
          <Heading
            size={{ base: "lg", md: "xl" }}
            mb={6}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaMap} mr={2} color="teal.500" />
            Plan a Trip to {destination.name}
          </Heading>
          <Flex direction={{ base: "column", md: "row" }} gap={8}>
            <VStack spacing={6} align="stretch" flex={1} width="100%">
              <FormControl id="trip-details" onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel
                      fontSize={{ base: "md", md: "lg" }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FaMap} mr={2} color="teal.500" />
                      Trip Name
                    </FormLabel>
                    <Input
                      type="text"
                      name="trip_name"
                      value={formData.trip_name}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <Box>
                    <FormLabel fontSize={{ base: "md", md: "lg" }} mb={2}>
                      Trip Dates
                    </FormLabel>
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      gap={{ base: 4, md: 4 }}
                    >
                      <FormControl flex={1}>
                        <FormLabel
                          fontSize={{ base: "sm", md: "md" }}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={FaCalendarAlt} mr={2} color="teal.500" />
                          Start Date
                        </FormLabel>
                        <Input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel
                          fontSize={{ base: "sm", md: "md" }}
                          display="flex"
                          alignItems="center"
                        >
                          <Icon as={FaCalendarAlt} mr={2} color="teal.500" />
                          End Date
                        </FormLabel>
                        <Input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </Box>

                  <FormControl>
                    <FormLabel
                      fontSize={{ base: "md", md: "lg" }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FaStickyNote} mr={2} color="teal.500" />
                      Notes
                    </FormLabel>
                    <Textarea
                      placeholder="Enter notes here"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      fontSize={{ base: "md", md: "lg" }}
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={FaBed} mr={2} color="teal.500" />
                      Accommodation
                    </FormLabel>
                    <Select
                      placeholder="Select accommodation"
                      name="trip_accommodation"
                      value={formData.trip_accommodation}
                      onChange={handleInputChange}
                    >
                      {accommodations.map((accommodation) => (
                        <option
                          key={accommodation.id}
                          value={accommodation.name}
                        >
                          {accommodation.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    mt={4}
                    colorScheme="teal"
                    size={{ base: "md", md: "lg" }}
                    type="submit"
                    onClick={handleSubmit}
                    width="full"
                  >
                    Plan My Trip
                  </Button>
                </VStack>
              </FormControl>
            </VStack>

            <Box
              flex={1}
              height={{ base: "300px", md: "400px" }}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              width="100%"
            >
              {isLoading ? (
                <Flex height="100%" justify="center" align="center">
                  <Spinner size="xl" color="teal.500" />
                </Flex>
              ) : mapError ? (
                <Flex height="100%" justify="center" align="center">
                  <Text color="red.500">{mapError}</Text>
                </Flex>
              ) : currentLocation ? (
                <Box position="absolute" top="0" left="0" right="0" bottom="0" overflow={"clip"}>
                  <MapContainer
                    bounds={bounds}
                    center={currentLocation}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={currentLocation} icon={startIcon} />
                    {destination && (
                      <Marker
                        position={[destination.latitude, destination.longitude]}
                        icon={endIcon}
                      />
                    )}
                    {currentLocation && destination && (
                      <Routing
                        from={currentLocation}
                        to={[destination.latitude, destination.longitude]}
                      />
                    )}
                  </MapContainer>
                </Box>
              ) : (
                <Flex height="100%" justify="center" align="center">
                  <Text>
                    Unable to load map. Please check your location settings.
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
      </Container>
      {footer}
    </>
  );
}

export default PlanTrip;

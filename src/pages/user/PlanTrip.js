import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { FaMap } from "react-icons/fa";
import axios from "axios";
import "../../index.css";

function PlanTrip({ user, navbar}) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const location = useLocation();
  const destination = location.state.destination;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination_id: destination.id,
    user_id: user.id,
    start_date: "",
    end_date: "",
    notes: "",
  });

  function Routing({ from, to }) {
    const map = useMap();

    useEffect(() => {
      if (from && to) {
        L.Routing.control({
          waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
          addWaypoints: false,
          draggableWaypoints: true,
          fitSelectedRoutes: true,
          showAlternatives: false,
          show: false, // hide the itinerary

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
      }
      setIsLoading(false);
    }, [from, to, map]);

    return null;
  }

  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);

    try {
      // Make a request to the server...
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

      console.log(response.data);

      // // Redirect the user to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // If there's an error, display an error toast
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

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

  useEffect(() => {
    if (currentLocation && destination) {
      // Calculate route from currentLocation to destination
      // This is a placeholder, replace with actual route calculation

      const calculatedRoute = `Route from (${currentLocation[0]}, ${currentLocation[1]}) to (${destination.latitude}, ${destination.longitude})`;
      setRoute(calculatedRoute);
    }
  }, [currentLocation, destination]);

  return (
    <>
    {navbar}
    <Box
      boxShadow="xl" // Increase shadow for better depth perception
      p={6} // Increase padding for better spacing
      rounded="lg" // Larger border radius for softer edges
      bg="white"
      style={{ height: "100vh", width: "100%" }}
      mt={20}
    >
      <Heading size="xl" mb={6}>
        <FaMap /> Plan a Trip to {destination.name}
      </Heading>
      <Flex direction="row" justify="space-between">
        <Box flex="1" pl={4} mr={2}>
          <FormControl id="trip-details" onSubmit={handleSubmit}>
            <FormLabel fontSize="lg">Start Date</FormLabel>
            <Input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              mb={4}
            />

            <FormLabel fontSize="lg">End Date</FormLabel>
            <Input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              mb={4}
            />

            <FormLabel fontSize="lg">Notes</FormLabel>
            <Textarea
              placeholder="Enter notes here"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              mb={4}
            />

            <Button
              mt={4}
              colorScheme="teal"
              size="lg"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
        <Box flex="1" pr={4} ml={2}>
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
      </Flex>
    </Box>
    </>
    
  );
}

export default PlanTrip;

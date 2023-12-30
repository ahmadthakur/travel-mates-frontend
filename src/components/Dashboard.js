import axios from "axios";
import { Avatar, Box, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users/dashboard`,
          { withCredentials: true }
        );
        setData(response.data);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <Box>Loading...</Box>;
  }

  return (
    <VStack spacing={5} align="start">
      <Avatar size="2xl" name={data.user.username} />
      <Heading as="h1" size="xl" color="teal.500">
        {data.user.username}
      </Heading>
      <Stack spacing={3}>
        <Box>
          <Text fontSize="md" color="gray.700">
            First Name: {data.user.first_name}
          </Text>
          <Text fontSize="md" color="gray.700">
            Last Name: {data.user.last_name}
          </Text>
          <Text fontSize="md" color="gray.700">
            Email: {data.user.email}
          </Text>
        </Box>
      </Stack>
    </VStack>
  );
}

export default Dashboard;

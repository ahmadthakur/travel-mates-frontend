import React, { useState } from "react";
import axios from "axios";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/register`,
        { username, password },
        { withCredentials: true }
      );
      console.log(response.data);
      // Handle successful registration here
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default RegistrationForm;

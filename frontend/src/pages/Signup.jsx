import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to handle the signup process
  const onSignUpClickHandler = async () => {
    try {
      // Make the API request to sign up the user
      const response = await axios.post("http://localhost:4000/api/v1/user/signup", {
        username,
        password,
        firstName,
        middleName,
        lastName,
      });

      // Save the token in local storage
      localStorage.setItem("token", response.data.token);

      // Navigate to the dashboard after successful signup
      navigate("/dashboard");
    } catch (error) {
      // Display an error message in case of failure
      console.error("Error during signup:", error.message || error.response.data.message);
      alert("Signup failed. Please try again!");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-6 shadow-lg">
        <Heading label="Sign up" />
        <SubHeading label="Enter your information to create an account" />

        <InputBox
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          label="First Name"
        />

        <InputBox
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Middle Name (Optional)"
          label="Middle Name"
        />

        <InputBox
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          label="Last Name"
        />

        <InputBox
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="john@gmail.com"
          label="Email"
        />

        <InputBox
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          label="Password"
          type="password"
        />

        <div className="pt-4">
          <Button onClick={onSignUpClickHandler} label="Sign up" />
        </div>

        <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
      </div>
    </div>
  );
};

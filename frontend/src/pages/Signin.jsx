import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Inputbox } from "../components/Inputbox";
import { Subheading } from "../components/Subheading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";


const apiUrl = import.meta.env.VITE_API_URL || "localhost:4000";


export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [tracker, setTracker] = useState(false);
  const navigate = useNavigate();
  async function signInFun() {
    try {
      setTracker(true);
      const res = await axios.post(
        `${apiUrl}/api/v1/user/signin`,
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      window.location.reload(false);
      setTracker(false);
    } catch (error) {
      alert("Invalid credentials");
      setTracker(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="flex flex-col items-center w-full md:w-2/4 mt-[15%]">
        <h1 className=" flex gap-3 items-center text-5xl font-bold p-10 mx-44 text-gray-200">
          PayPlus
          <span className="w-20">
            {" "}
            <svg
              viewBox="0 0 32 32"
              enableBackground="new 0 0 32 32"
              id="Stock_cut"
              version="1.1"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              stroke="#fff"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <desc></desc>{" "}
                <g>
                  {" "}
                  <path
                    d="M17,5H5 C3.895,5,3,5.895,3,7v22c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V18"
                    fill="none"
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                  ></path>{" "}
                  <path
                    d="M9,14H3v8h6 c2.209,0,4-1.791,4-4v0C13,15.791,11.209,14,9,14z"
                    fill="none"
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                  ></path>{" "}
                  <circle cx="9" cy="18" r="1"></circle>{" "}
                  <line
                    fill="none"
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                    x1="25"
                    x2="25"
                    y1="16"
                    y2="1"
                  ></line>{" "}
                  <polyline
                    fill="none"
                    points="31,7 25,1 19,7 "
                    stroke="#fff"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
                  ></polyline>{" "}
                </g>{" "}
              </g>
            </svg>
          </span>
        </h1>
        <p className="text-gray-400 text-lg px-10">
          A playful digital payment platform where users sign up, earn virtual money, and send them to friends with ease.
        </p>
      </div>
      <div className="p-28 w-full md:w-[550px] md:h-[600px] mt-20 mx-auto bg-slate-950 rounded-lg">
        <Heading title={"SignIn"} />
        <Subheading lable={"Enter your details to SignIn"} />
        <Inputbox
          onChange={(e) => setUsername(e.target.value)}
          lable={"Email"}
          val={"abc@gmail.com"}
        />
        <Inputbox
          onChange={(e) => setpassword(e.target.value)}
          lable={"password"}
          val={"eg. abcd1234"}
          type={"password"}
        />
        <Button
          onClick={signInFun}
          lable={
            tracker ? (
              <div className="flex justify-center  items-center">
                <div
                  className="animate-spin inline-block w-5 h-5 mr-4 border-[3px] border-current border-t-transparent text-white rounded-full "
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
                <p>Signing in...</p>
              </div>
            ) : (
              "SignIn"
            )
          }
        />

        <div className="mt-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const token = credentialResponse.credential;

              try {
                const res = await axios.post(`${apiUrl}/api/v1/user/google-auth`, {
                  token,
                });

                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
                window.location.reload(false);
              } catch (err) {
                console.error("Google Sign-In Failed", err);
                alert("Google sign-in failed");
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
              alert("Google Login Failed");
            }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-1 text-center">
          Dont have an account?{" "}
          <a
            onClick={() => navigate("/signup")}
            className="underline font-bold cursor-pointer hover:text-slate-300"
          >
            SignUp
          </a>
        </p>
      </div>
    </div>
  );
};

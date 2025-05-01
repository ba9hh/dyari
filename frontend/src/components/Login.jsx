import React, { useState, useContext } from "react";
import dyari from "../assets/dyari.svg";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../AuthProvider";
const DividerWithOr = () => {
  return (
    <div className="flex items-center justify-center ">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-gray-500 text-xs font-medium">OU</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

const Login = () => {
  const { handleLogin, loginError, handleGoogleLogin } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleError = () => {
    console.log("Login Failed");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
    setError(loginError);
  };
  return (
    <div className="flex  justify-center items-center w-full h-screen bg-[#f5f5f5] gap-y-4">
      <Link className="absolute flex items-center gap-1 top-4 left-8" to={"/"}>
        <img className="w-7" src={dyari} />
        <h1 className="text-2xl font-medium text-amber-800">Dyari</h1>
      </Link>
      <Link className="absolute top-6 right-8" to={"/createshoptest"}>
        <button className="px-2 pb-1 rounded-lg border-2 text-amber-700 border-amber-500 shadow-lg">
          Créer votre Pâtisserie
        </button>
      </Link>
      <form
        className="w-[26%] flex flex-col gap-y-5 bg-white px-10 py-8 rounded-md shadow-md"
        onSubmit={onSubmit}
      >
        
        {error && ( // Conditionally render the error message
          <div className="text-red-500 text-center">{error}</div>
        )}
        <div className="flex flex-col gap-y-3">
          <input
            className=" block border px-4 py-[10px] w-full rounded-lg"
            type="email"
            value={email}
            placeholder="Adresse e-mail"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className=" block border px-4 py-[10px] w-full rounded-lg"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-[7px] text-white bg-blue-600 rounded hover:bg-blue-700 w-full"
          type="submit"
        >
          Se connecter
        </button>
        <DividerWithOr/>
        

        <div className="flex w-full">
        
          <div className="google-login w-full">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={handleError} />
          </div>
        </div>
        <a className="text-center text-[14px]">Mot de passe oublié ?</a>
      </form>
      <div className="w-[26%] flex flex-col gap-y-5 bg-white px-10 py-6 rounded-md shadow-md">
        <h1 className="text-center text-[17px] crimsonText">
          Vous n'avez pas de compte ?{" "}
          <Link className="text-blue-500 cursor-pointer crimsonText" to={"/register"}>Inscription</Link>
        </h1>
      </div>
    </div>
  );
};

export default Login;

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import { toast } from "react-toastify";

import LogInProgress from "../../public/Login.json";

export default function Login() {
  const [details, setDetails] = useState({
    email: "",
  });
  const [valid, setValid] = useState(false);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function toMatch(match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return match;
      }
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3310/api/login",
        {
          email: escapeHtml(details.email),
          password: escapeHtml(details.password),
        },
        { withCredentials: true }
      );

      if (response.data.message === "Authentification réussie") {
        setValid(true);
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 3300,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme"),
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 3800);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme"),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);
          setTimeout(() => {
            window.location.href = "/profil";
          }, 3800);
        } else {
          setIsLoggedIn(false);
        }
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    return (
      <main>
        <div className="flex justify-center items-center flex-col h-screen text-center">
          <Lottie
            loop
            animationData={LogInProgress}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1>Vous êtes déjà connecté(e)</h1>
        </div>
      </main>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl mb-8">Login</h1>
          <form className="flex flex-col md:w-[90%] w-screen items-center px-8">
            <input
              className="bg-primary-light dark:bg-primary-dark border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              onChange={handleDetailsChange}
              name="email"
              placeholder="Utilisateur ou Email"
              value={details.email || ""}
              required
            />
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              onChange={handleDetailsChange}
              name="password"
              placeholder="Mot de Passe"
              maxLength="32"
              minLength="8"
              value={details.password || ""}
              autoComplete="true"
              aria-current="true"
              required
            />
            <button
              className="mt-12 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark"
              type="submit"
              onClick={handleSubmit}
            >
              Connexion
            </button>
            <button type="button" className="mt-4">
              Mot de passe oublié ?
            </button>
            <Link to="/sign-up" className="mt-2">
              Crée un compte
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <Lottie
        loop
        animationData={LogInProgress}
        play
        style={{ width: 120, height: 120 }}
      />
      <h1>Connexion en cours...</h1>
    </div>
  );
}

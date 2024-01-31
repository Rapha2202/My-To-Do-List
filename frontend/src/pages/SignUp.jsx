import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

import LogInProgress from "../../public/Login.json";

export default function SignUp() {
  const [details, setDetails] = useState({
    email: "",
  });

  const [valid, setValid] = useState(false);

  const [attenteValidation, setAttenteValidation] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const isEmailValid = (value) => {
    const emailPattern = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
    return emailPattern.test(value);
  };

  const isPasswordValid = (value) => {
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^\-&+=*._]){8,}$/;
    return passwordPattern.test(value);
  };

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

  const handleSubmit = async (verif) => {
    try {
      const date = `${new Date().getFullYear()}-${
        new Date().getMonth() + 1 < 10
          ? `0${new Date().getMonth() + 1}`
          : new Date().getMonth() + 1
      }-${
        new Date().getDay() < 10
          ? `0${new Date().getDay()}`
          : new Date().getDay()
      }`;
      if (!isEmailValid(details.email)) {
        toast.error("Votre email n'est pas valide", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme"),
        });
      } else if (isPasswordValid(details.password)) {
        toast.error(
          "Votre mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial",
          {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: localStorage.getItem("theme"),
          }
        );
      } else if (details.password === details.passwordConfirm) {
        const response = await axios.post(
          "http://localhost:3310/api/users",
          {
            username: escapeHtml(details.username),
            email: escapeHtml(details.email),
            password: escapeHtml(details.password),
            creationDate: date,
            lastUpdate: date,
            verification: verif,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.message === "Email non validé") {
          setAttenteValidation(true);

          const caracteres =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          let code = "";
          for (let i = 0; i < 6; i += 1) {
            code += caracteres.charAt(
              Math.floor(Math.random() * caracteres.length)
            );
          }

          setVerificationCode(code);

          emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
          emailjs
            .send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID,
              import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
              {
                email: details.email,
                code,
              }
            )
            .then(
              () => {
                toast.success("Le code vous a été envoyé par mail", {
                  position: "top-right",
                  autoClose: 3300,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
              },
              (error) => {
                console.error(error.text);
              }
            );
        } else if (response.data.message === "Compte créé") {
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
      } else {
        toast.error("Les mots de passes ne correspondent pas", {
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

  function handleValidationCode() {
    if (verificationCode === details.verificationCode) {
      handleSubmit(true);
    } else {
      toast.error("Le code de vérification n'est pas valide", {
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
  }

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

  if (attenteValidation && !valid) {
    return (
      <div className="flex justify-center items-center flex-col h-screen text-center">
        <h1 className="text-4xl md:text-5xl mb-8">
          Votre compte est en attente de validation
        </h1>
        <p className="text-xl md:text-2xl">
          Veuillez vérifier vos mails pour valider votre compte
        </p>
        <form className="flex flex-col w-[90%] items-center px-8">
          <input
            className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 px-4 border-secondary-light dark:border-secondary-dark text-center"
            placeholder="Code de vérification"
            name="verificationCode"
            value={details.verificationCode || ""}
            required
            onChange={handleDetailsChange}
          />
          <button
            className="mt-12 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark"
            type="button"
            onClick={() => handleValidationCode()}
          >
            Valider
          </button>
        </form>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl mb-8">Sign Up</h1>
          <form className="flex flex-col md:w-[90%] w-[99vw] items-center px-8">
            <input
              className="bg-primary-light dark:bg-primary-dark border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Email"
              type="email"
              name="email"
              value={details.email || ""}
              required
              onChange={handleDetailsChange}
            />
            <input
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Nom d'Utilisateur"
              name="username"
              value={details.username || ""}
              required
              onChange={handleDetailsChange}
            />
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Mot de Passe"
              maxLength="32"
              minLength="8"
              name="password"
              value={details.password || ""}
              autoComplete="true"
              aria-current="true"
              required
              onChange={handleDetailsChange}
            />
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Confirmation"
              maxLength="32"
              minLength="8"
              name="passwordConfirm"
              value={details.passwordConfirm || ""}
              autoComplete="true"
              aria-current="true"
              required
              onChange={handleDetailsChange}
            />
            <button
              className="mt-12 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark"
              type="button"
              onClick={() => handleSubmit(false)}
            >
              Sign Up
            </button>
            <Link to="/login" className="mt-4">
              Se connecté
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
      <h1>Création du compte en cours...</h1>
    </div>
  );
}

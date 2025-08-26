import { Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import errorToast from "../../services/Toast/errorToast";
import successToast from "../../services/Toast/successToast";
import SuccessMessage from "../../components/Message/SuccessMessage";
import dateNow from "../../services/Other/dateNow";
import ErrorMessage from "../../components/Message/ErrorMessage";

export default function Register() {
  const isLoggedIn = useOutletContext();
  const [valid, setValid] = useState(false);
  const [details, setDetails] = useState({});

  const url = window.location.href;

  useEffect(() => {
    document.title = "MyToDoList - Inscription";

    if (isLoggedIn) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
    }
  }, [isLoggedIn]);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const handleSignUp = async () => {
    try {
      const date = dateNow();
      if (
        !details.email ||
        !details.password ||
        !details.username ||
        !details.passwordConfirm
      ) {
        errorToast("Veuillez remplir tous les champs");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
        {
          username: details.username,
          email: details.email,
          password: details.password,
          passwordConfirm: details.passwordConfirm,
          creationDate: date,
          lastUpdate: date,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        setValid(true);
        successToast(response.data.message);
      }
    } catch (error) {
      errorToast(error.response.data.message);
    }
  };

  if (isLoggedIn) {
    return <ErrorMessage titre="Vous êtes déjà connecté(e)" />;
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl mb-8">Inscription</h1>
          <form className="flex flex-col md:w-[90%] w-full items-center px-8">
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
              placeholder="Nom d'utilisateur"
              name="username"
              value={details.username || ""}
              required
              onChange={handleDetailsChange}
            />
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Mot de Passe"
              name="password"
              value={details.password || ""}
              required
              onChange={handleDetailsChange}
            />
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark mt-4 border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Confirmation"
              name="passwordConfirm"
              value={details.passwordConfirm || ""}
              required
              onChange={handleDetailsChange}
            />
            <p className="text-xs mt-8">
              En vous inscrivant, vous acceptez nos{" "}
              <u>
                <Link to="/cgu" target="_blank" rel="noopener noreferrer">
                  {" "}
                  Conditions générales
                </Link>
              </u>
              .
            </p>
            <button
              className="mt-4 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              type="button"
              onClick={handleSignUp}
            >
              Créer un compte
            </button>
            <Link
              to="/login"
              className="mt-4 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            >
              Se connecter
            </Link>
          </form>
        </div>
      </div>
    );
  }

  if (valid) {
    return (
      <SuccessMessage
        titre="Email en attente de vérification"
        message1="Un email de vérification vous a été envoyé, cliquez sur le lien pour vérifier votre compte."
        message2="Dans 2 minutes votre compte sera supprimé s'il n'est pas vérifié."
      />
    );
  }
}

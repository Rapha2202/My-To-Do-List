import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import successToast from "../../services/Toast/successToast";
import errorToast from "../../services/Toast/errorToast";
import ErrorMessage from "../../components/Message/ErrorMessage";
import SuccessMessage from "../../components/Message/SuccessMessage";

export default function ResetPasswordToken() {
  const [valid, setValid] = useState(null);
  const { token } = useParams();

  const [details, setDetails] = useState({});

  const url = window.location.href;

  useEffect(() => {
    document.title = "MyToDoList - Vérification d'Email";

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/check-password/${token}`
      )
      .then((res) => {
        if (res.status === 200) {
          setValid(false);
        }
      })
      .catch((err) => {
        errorToast(err.response.data.message);
        setTimeout(() => {
          if (window.location.href === url) {
            window.location.href = "/home";
          }
        }, 3500);
      });
  }, []);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const handleReset = async () => {
    try {
      if (!details.password || !details.passwordConfirm) {
        errorToast("Veuillez remplir tous les champs");
        return;
      }
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`,
        {
          password: details.password,
          passwordConfirm: details.passwordConfirm,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setValid(true);
        successToast(response.data.message);
        setTimeout(() => {
          if (window.location.href === url) {
            window.location.href = "/";
          }
        }, 3500);
      }
    } catch (error) {
      errorToast(error.response.data.message);
    }
  };

  if (valid == null) {
    return (
      <div>
        <ErrorMessage message1="La demande de réinitialisation de mot de passe a expiré ou n'existe pas." />
      </div>
    );
  }
  if (valid === false) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <p className="text-2xl md:text-4xl mb-8">
            Réinitialiser votre Mot de Passe
          </p>
          <form className="flex flex-col md:w-[90%] w-screen items-center px-8">
            <input
              type="password"
              className="bg-primary-light dark:bg-primary-dark border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              placeholder="Nouveau Mot de Passe"
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
            <button
              className="mt-12 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              type="button"
              onClick={handleReset}
            >
              Réinitialiser le Mot de Passe
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div>
      <SuccessMessage titre="Votre mot de passe a été modifié!" />
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import SuccessMessage from "../../components/Message/SuccessMessage";
import errorToast from "../../services/Toast/errorToast";
import successToast from "../../services/Toast/successToast";
import dateNow from "../../services/Other/dateNow";

export default function DeleteAccount() {
  const [details, setDetails] = useState({});
  const [valid, setValid] = useState(false);

  const url = window.location.href;

  useEffect(() => {
    document.title = "MyToDoList - Supression du Compte";
  }, []);

  const handleLogin = async () => {
    try {
      const date = dateNow();
      if (!details.email || !details.password) {
        errorToast("Veuillez remplir tous les champs");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        {
          email: details.email,
          password: details.password,
          lastLogin: date,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const deleteResponse = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${
            details.email
          }`,
          {
            withCredentials: true,
          }
        );

        if (deleteResponse.status === 200) {
          setValid(true);
          successToast(deleteResponse.data.message);
          setTimeout(() => {
            if (window.location.href === url) {
              window.location.href = "/";
            }
          }, 3500);
        }
      }
    } catch (error) {
      errorToast(error.response.data.message);
    }
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

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl mb-8">Supprimer le compte</h1>
          <form className="flex flex-col md:w-[90%] w-full items-center px-8">
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
              value={details.password || ""}
              required
            />
            <button
              className="mt-12 border-[1px] w-full max-w-[300px] rounded-[10px] border-secondary-light dark:border-secondary-dark hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              type="button"
              onClick={handleLogin}
            >
              Supprimer
            </button>
            <Link
              to="/reset-password"
              className="mt-4 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            >
              Mot de passe oublié ?
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return <SuccessMessage titre="Compte supprimé avec succès" />;
}

import { useOutletContext, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import ErrorMessage from "../components/Message/ErrorMessage";
import successToast from "../services/Toast/successToast";
import errorToast from "../services/Toast/errorToast";

export default function Profil() {
  const isLoggedIn = useOutletContext();

  const [userInfo, setUserInfo] = useState();
  const [isLogout, setIsLogout] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [dataUpdated, setDataUpdated] = useState(false);

  const [username, setUsername] = useState({});

  const url = window.location.href;

  useEffect(() => {
    document.title = "MyToDoList - Profil";

    if (!isLoggedIn) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
      setIsLoaded(true);
    } else {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/infos`, {
          withCredentials: true,
        })
        .then((res) => {
          setUserInfo(res.data);
          setUsername(res.data.username);
          setIsLoaded(true);
        })
        .catch((error) => {
          errorToast(error.response.data.message);
        });
    }
  }, [dataUpdated]);

  useEffect(() => {
    if (isLogout) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
    }
  }, [isLogout]);

  if (!isLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <ErrorMessage
        titre="Accès Impossible !"
        message1="Vous devez vous connecter acceder a cette page."
        message2="Vous allez être redirigé(e) vers la page de connexion."
      />
    );
  }

  if (isLogout) {
    return (
      <ErrorMessage
        titre="Déconnexion"
        message1="Vous avez été déconnecté(e) avec succès."
        message2="Vous allez être redirigé(e) vers la page d'Accueil."
      />
    );
  }

  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-3xl mb-8">Votre Profil</h1>
      <img src="/avatar.png" className="rounded-full h-36 w-36" alt="Avatar" />
      <p className="text-xl">{userInfo.username}</p>
      <div className="flex flex-col mt-8 md:w-[50%] w-full px-8">
        <label htmlFor="email" className="text-xl">
          Nom d'utilisateur
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="outline-0 border-b-2 border-secondary-light dark:border-secondary-dark bg-primary-light dark:bg-primary-dark"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="email" className="text-xl mt-4">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="outline-0 border-b-2 border-secondary-light dark:border-secondary-dark bg-primary-light dark:bg-primary-dark"
          value={userInfo.email}
          readOnly
        />
      </div>
      <div className="flex flex-col mt-8 gap-2">
        <button
          type="button"
          className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
          onClick={() => {
            axios
              .put(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/edit`,
                {
                  username,
                },
                {
                  withCredentials: true,
                }
              )
              .then((res) => {
                successToast(res.data.message);
                setDataUpdated(!dataUpdated);
              })
              .catch((error) => {
                errorToast(error.response.data.message);
              });
          }}
        >
          Enregistrer les changements
        </button>
        <button
          type="button"
          className="text-red-700 border-2 rounded-full px-4 py-2 border-red-700 dark:border-red-700 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
          onClick={() => {
            axios
              .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
                withCredentials: true,
              })
              .then(() => {
                setIsLogout(true);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          Se déconnecter
        </button>
        <Link
          to="/reset-password"
          className="text-sm mt-2 text-center hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
        >
          Modifier le mot de passe
        </Link>
        <Link
          to="/delete-account"
          className="text-sm mt-2 text-center hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
        >
          Supprimer le compte
        </Link>
      </div>
    </div>
  );
}

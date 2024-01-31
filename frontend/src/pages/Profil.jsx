import React, { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import axios from "axios";

import mailError from "../../public/EmailError.json";

export default function Profil() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);
          axios
            .get(
              `${import.meta.env.VITE_BACKEND_URL}/api/users/${res.data.id}`,
              {
                withCredentials: true,
              }
            )
            .then((resp) => {
              setUser(resp.data);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          setIsLoggedIn(false);
          setTimeout(() => {
            window.location.href = "/login";
          }, 3800);
        }
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <main>
        <div className="flex justify-center items-center flex-col h-screen text-center">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1 className="text-3xl">Accès Impossible</h1>
          <p className="text-xl">
            {`
          Vous devez vous connecter pour accéder à cette page.  `}
            <br />
            {` Vous allez être redirigé(e) vers la page de connexion. `}
          </p>
        </div>
      </main>
    );
  }
  return (
    <main>
      <div className="flex justify-center items-center flex-col h-screen">
        <h1 className="text-3xl mb-8">Votre Profil</h1>
        <img
          src="../../public/avatar.png"
          className="rounded-full h-36 w-36"
          alt="Avatar"
        />
        <p className="text-xl">{user && user.username}</p>
        <div className="flex flex-col mt-8">
          <label htmlFor="email" className="text-xl">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="outline-0 border-b-2 border-secondary-light dark:border-secondary-dark bg-primary-light dark:bg-primary-dark"
            value={user && user.username}
          />
          <label htmlFor="email" className="text-xl mt-4">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="outline-0 border-b-2 border-secondary-light dark:border-secondary-dark bg-primary-light dark:bg-primary-dark"
            value={user && user.email}
            readOnly
          />
        </div>
        <div className="flex flex-col mt-8 gap-2">
          <button
            type="button"
            className="text- border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark"
          >
            Enregistrer les changements
          </button>
          <button type="button" className="text-sm mt-2">
            Modifier le mot de passe
          </button>
          <button type="button" className="text-sm">
            Annuler les changements
          </button>
        </div>
      </div>
    </main>
  );
}

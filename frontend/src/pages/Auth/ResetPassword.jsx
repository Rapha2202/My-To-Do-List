import { useState, useEffect } from "react";
import axios from "axios";

import SuccessMessage from "../../components/Message/SuccessMessage";
import errorToast from "../../services/Toast/errorToast";
import successToast from "../../services/Toast/successToast";

export default function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "MyToDoList - Réinitialisation du Mot de Passe";
  }, []);

  const handleReset = async () => {
    try {
      if (!email) {
        errorToast("Veuillez remplir tous les champs");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
        {
          email,
        }
      );

      if (response.status === 200) {
        setValid(true);
        successToast(response.data.message);
      }
    } catch (error) {
      errorToast(error.response.data.message);
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex flex-col text-center items-center justify-center">
        <div className="mt-8 md:mt-0 md:w-[60%] flex flex-col items-center">
          <p className="text-2xl md:text-4xl mb-8">
            Réinitialiser votre Mot de Passe
          </p>
          <form className="flex flex-col md:w-[90%] w-screen items-center px-8">
            <input
              className="bg-primary-light dark:bg-primary-dark border-b-2 outline-0 w-full md:max-w-[70%] border-secondary-light dark:border-secondary-dark"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <button
              className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mt-12 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
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

  if (valid) {
    return (
      <SuccessMessage
        titre="Email de réinitialisation envoyé !"
        message1="Un email de afin de réinitialiser votre mot de passe vous a été envoyé."
        message2="Dans 5 minutes votre réinitialisation de mot de passe aura expiré."
      />
    );
  }
}

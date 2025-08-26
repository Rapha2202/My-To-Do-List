import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";

import SuccessMessage from "../../components/Message/SuccessMessage";
import successToast from "../../services/Toast/successToast";
import errorToast from "../../services/Toast/errorToast";
import ErrorMessage from "../../components/Message/ErrorMessage";

export default function Verify() {
  const isLoggedIn = useOutletContext();
  const [valid, setValid] = useState(null);
  const { token } = useParams();

  const url = window.location.href;

  useEffect(() => {
    document.title = "MyToDoList - Vérification d'Email";

    if (isLoggedIn) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
    } else {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify/${token}`)
        .then((res) => {
          if (res.status === 200) {
            setValid(true);
            successToast(res.data.message);
            setTimeout(() => {
              if (window.location.href === url) {
                window.location.href = "/login";
              }
            }, 3500);
          }
        })
        .catch((err) => {
          errorToast(err.response.data.message);
          setValid(false);
          setTimeout(() => {
            if (window.location.href === url) {
              window.location.href = "/";
            }
          }, 3500);
        });
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return (
      <div>
        <ErrorMessage titre="Vous êtes déjà connecté !" />
      </div>
    );
  }
  if (valid == null) {
    return (
      <div>
        <SuccessMessage titre="Vérification en cours..." />
      </div>
    );
  }
  if (valid === false) {
    return (
      <div>
        <ErrorMessage message1="Votre compte est déja vérifié ou vous avez mis trop de temps a le vérifié" />
      </div>
    );
  }
  return (
    <div>
      <SuccessMessage titre="Votre compte à été vérifié !" />
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function CardUser({
  username,
  email,
  role,
  newData,
  setNewData,
  thisUsername,
  isCreator,
}) {
  const [isClicked, setIsClicked] = useState(false);

  const { id } = useParams();

  function handleCardClick() {
    setIsClicked(!isClicked);
  }

  function handleDelete() {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/list/deleteuser`,
        {
          listId: id,
          username,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "User deleted") {
          setNewData(!newData);
          toast.success("Utilisateur supprimée avec succès", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: localStorage.getItem("theme"),
          });
        } else {
          toast.error("Une erreur est survenue", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: localStorage.getItem("theme"),
            progress: undefined,
          });
        }
      });
  }

  return (
    <div
      className={`max-w-[80%] w-full border-2 border-secondary-light dark:border-secondary-dark flex flex-col py-2 ${
        isClicked ? "md:min-h-40 justify-evenly" : "min-h-16 justify-center"
      }`}
    >
      <div className="flex">
        <div className="w-full flex flex-col md:flex-row justify-evenly items-start mx-4">
          <div className="flex items-center mb-2 md:mb-0">
            <h1 className="mx-0 md:mx-4">{username}</h1>
          </div>
          <p className="text-sm md:mb-0 mx-0 md:mx-2">{email}</p>
          <p className="text-sm md:mb-0 mx-0 md:mx-2">
            {role === "creator" ? "Créateur" : "Utilisateur"}
          </p>
        </div>
        {isCreator && thisUsername !== username && (
          <div className="flex justify-center w-16">
            <button
              type="button"
              className=""
              onClick={() => handleCardClick()}
            >
              :
            </button>
          </div>
        )}
      </div>
      {isClicked && (
        <div className="flex justify-evenly mt-4 md:mt-0">
          <button
            type="button"
            className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark text-sm md:text-base"
            onClick={() => handleDelete()}
          >
            Supprimer l'utilisateur
          </button>
        </div>
      )}
    </div>
  );
}

CardUser.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  newData: PropTypes.bool.isRequired,
  setNewData: PropTypes.func.isRequired,
  thisUsername: PropTypes.string.isRequired,
  isCreator: PropTypes.bool.isRequired,
};

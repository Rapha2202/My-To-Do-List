import axios from "axios";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import successToast from "../services/Toast/successToast";
import errorToast from "../services/Toast/errorToast";

export default function CardUser({
  username,
  email,
  role,
  newData,
  setNewData,
  isCreator,
}) {
  const { listId } = useParams();

  function handleDelete() {
    axios
      .delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/list/${listId}/delete-user/${email}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setNewData(!newData);
          successToast(res.data.message);
        }
      })
      .catch((error) => {
        errorToast(error.response.data.message);
      });
  }

  return (
    <div
      className="max-w-[80%] w-full border-2 border-secondary-light dark:border-secondary-dark flex flex-col py-2
         min-h-16 justify-center
      "
    >
      <div className="flex">
        <div className="w-full flex flex-col md:flex-row justify-evenly items-center mx-4">
          <p className=" text-base md:mb-0 mx-0 md:mx-2">{username}</p>
          <p className="text-sm md:mb-0 mx-0 md:mx-2">{email}</p>
          <p className="text-sm md:mb-0 mx-0 md:mx-2">
            {role === "creator" ? "Créateur" : "Utilisateur"}
          </p>
        </div>
        {isCreator && role !== "creator" && (
          <div className="flex justify-center items-center w-16">
            <button
              type="button"
              className="items-center border-2 rounded-full w-10 h-10 md:h-full md:w-full md:px-4 md:py-2 border-secondary-light dark:border-secondary-dark text-sm md:text-base md:mr-8 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              onClick={() => handleDelete()}
            >
              -
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

CardUser.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  newData: PropTypes.bool.isRequired,
  setNewData: PropTypes.func.isRequired,
  isCreator: PropTypes.bool.isRequired,
};

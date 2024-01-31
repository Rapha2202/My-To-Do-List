import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export default function CardTodo({
  todoName,
  todoDescription,
  todoPriority,
  todoState,
  todoId,
  newData,
  setNewData,
}) {
  const [state, setState] = useState("");
  const [priority, setPriority] = useState("");

  const [details, setDetails] = useState({
    Titre: "",
    Description: "",
    state: "",
    priority: "",
  });

  const [isClicked, setIsClicked] = useState(false);

  const { id } = useParams();

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  function handleCardModify() {
    if (details.Titre === "") {
      details.Titre = todoName;
    }
    if (details.Description === "") {
      details.Description = todoDescription;
    }
    if (details.state === "") {
      details.state = state[0].id;
    }
    if (details.priority === "") {
      details.priority = priority[0].id;
    }

    details.state = Number(details.state);
    details.priority = Number(details.priority);

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/modifytodo`,
        {
          listId: id,
          todoId,
          details,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "Todo modifiée") {
          toast.success("Tache modifiée avec succès", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: localStorage.getItem("theme"),
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setNewData(!newData);
          setIsClicked(!isClicked);
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            theme: localStorage.getItem("theme"),
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  }

  function handleCardClick() {
    setIsClicked(!isClicked);
  }

  function handleDelete() {
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/deletetodo`,
        {
          listId: id,
          todoId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.message === "Todo supprimée") {
          setNewData(!newData);
          toast.success("Tache supprimée avec succès", {
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
          toast.error(res.data.message, {
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/state/${todoState}`, {
        withCredentials: true,
      })
      .then((res) => {
        setState(res.data);
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/priority/${todoPriority}`, {
        withCredentials: true,
      })
      .then((res) => {
        setPriority(res.data);
      });
  }, [newData, todoPriority, todoState]);

  return (
    <div
      className={`max-w-[80%] w-full border-2 border-secondary-light dark:border-secondary-dark flex flex-col py-2 ${
        isClicked ? "md:min-h-40 justify-evenly" : "min-h-16 justify-center"
      }`}
    >
      <div className="flex">
        <div className="hidden md:flex">
          <div
            className={`h-8 w-8 rounded-full border-2 mx-4 border-secondary-light dark:border-secondary-dark ${
              state && state[0].id === 1 && "bg-red-500"
            } ${state && state[0].id === 2 && "bg-yellow-500"} ${
              state && state[0].id === 3 && "bg-green-500"
            }`}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row justify-evenly items-start mx-4">
          {isClicked ? (
            <form
              className="w-full flex flex-col md:flex-row md:justify-evenly md:items-center md:flex-wrap"
              onChange={(event) => handleDetailsChange(event)}
            >
              <div className="w-[90%] md:w-auto flex items-center">
                <div
                  className={`flex md:hidden h-4 w-4 rounded-full border-2 mr-4 border-secondary-light dark:border-secondary-dark ${
                    state && state[0].id === 1 && "bg-red-500"
                  } ${state && state[0].id === 2 && "bg-yellow-500"} ${
                    state && state[0].id === 3 && "bg-green-500"
                  }`}
                />
                <textarea
                  className="w-[90%] md:w-auto resize-none mx-0 md:mx-4 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0"
                  placeholder={todoName}
                  name="Titre"
                />
              </div>
              <textarea
                className="w-[90%] md:w-auto resize-none text-sm md:mb-0 mx-0 md:mx-2 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0"
                placeholder={todoDescription}
                name="Description"
              />
              <select
                className="w-[90%] md:w-auto mx-0 md:mx-4 text-sm bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0"
                name="state"
              >
                <option value="">Choisissez l'état</option>
                <option value="1">A faire</option>
                <option value="2">En cours</option>
                <option value="3">Terminé</option>
              </select>
              <select
                className=" w-[90%] md:w-auto mx-0 md:mx-4 text-sm bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0"
                name="priority"
              >
                <option value="">Choisissez la priorité</option>
                <option value="1">Très important</option>
                <option value="2">Important</option>
                <option value="3">Normal</option>
                <option value="4">Pas important</option>
              </select>
            </form>
          ) : (
            <div className="w-full flex flex-col md:flex-row  md:justify-evenly md:items-center">
              <div className="flex items-center">
                <div
                  className={`flex md:hidden h-4 w-4 rounded-full border-2 mr-4 border-secondary-light dark:border-secondary-dark ${
                    state && state[0].id === 1 && "bg-red-500"
                  } ${state && state[0].id === 2 && "bg-yellow-500"} ${
                    state && state[0].id === 3 && "bg-green-500"
                  }`}
                />
                <h1 className="mx-0 md:mx-4">{todoName}</h1>
              </div>
              <p className="text-sm md:mb-0 mx-0 md:mx-2">{todoDescription}</p>
              <p className=" mx-0 md:mx-4 text-sm">
                Etat: {state && state[0].state}
              </p>
              <p className=" mx-0 md:mx-4 text-sm">
                Priorité: {priority && priority[0].priority}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center w-16">
          <button type="button" className="" onClick={() => handleCardClick()}>
            :
          </button>
        </div>
      </div>
      {isClicked && (
        <div className="flex justify-evenly mt-4 md:mt-0">
          <button
            type="button"
            className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark text-sm md:text-base"
            onClick={() => handleCardModify()}
          >
            Modifier la tache
          </button>
          <button
            type="button"
            className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark text-sm md:text-base"
            onClick={() => handleDelete()}
          >
            Supprimer la tache
          </button>
        </div>
      )}
    </div>
  );
}

CardTodo.propTypes = {
  todoName: PropTypes.string.isRequired,
  todoDescription: PropTypes.string.isRequired,
  todoPriority: PropTypes.number.isRequired,
  todoState: PropTypes.number.isRequired,
  todoId: PropTypes.number.isRequired,
  newData: PropTypes.bool.isRequired,
  setNewData: PropTypes.func.isRequired,
};

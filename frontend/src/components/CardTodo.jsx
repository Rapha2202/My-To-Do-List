import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import useAutoHeight from "./useAutoHeight";
import successToast from "../services/Toast/successToast";

export default function CardTodo({
  todoName,
  todoDescription,
  todoPriority,
  todoState,
  todoId,
  newData,
  setNewData,
  isCreator,
}) {
  const [todoNameRef, adjustNameHeight] = useAutoHeight(todoName);
  const [todoDescriptionRef, adjustDescriptionHeight] =
    useAutoHeight(todoDescription);

  const [state, setState] = useState("");
  const [priority, setPriority] = useState("");

  const [details, setDetails] = useState({});

  const [isClicked, setIsClicked] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const { id } = useParams();

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [name]: value,
      };

      if (name === "todoName") {
        adjustNameHeight();
      } else if (name === "todoDescription") {
        adjustDescriptionHeight();
      }

      const isTodoNameChanged = updatedDetails.todoName !== todoName;
      const isTodoDescriptionChanged =
        updatedDetails.todoDescription !== todoDescription;
      const isTodoStateChanged =
        parseInt(updatedDetails.stateId, 10) !== parseInt(todoState, 10);
      const isTodoPriorityChanged =
        parseInt(updatedDetails.priorityId, 10) !== parseInt(todoPriority, 10);

      if (isCreator) {
        setSaveButton(
          isTodoNameChanged ||
            isTodoDescriptionChanged ||
            isTodoStateChanged ||
            isTodoPriorityChanged
        );
        setIsClicked(
          isTodoNameChanged ||
            isTodoDescriptionChanged ||
            isTodoStateChanged ||
            isTodoPriorityChanged
        );
      }

      return updatedDetails;
    });
  };

  function handleCardModify() {
    axios
      .put(
        `${import.meta.env.VITE_BACKEND_URL}/api/todo/${todoId}/edit`,
        {
          details,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          successToast(res.data.message);
          setNewData(!newData);
          setIsClicked(false);
          setSaveButton(false);
        }
      });
  }

  function handleCardClick() {
    setIsClicked(!isClicked);
  }

  function handleDelete() {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/api/todo/${todoId}/delete`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          successToast(res.data.message);
          setNewData(!newData);
        }
      });
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/state`, {
        withCredentials: true,
      })
      .then((res) => {
        setState(res.data);
      });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/todo/priority`, {
        withCredentials: true,
      })
      .then((res) => {
        setPriority(res.data);
      });

    if (details.todoName === undefined || details.todoName === "") {
      details.todoName = todoName;
    }
    if (
      details.todoDescription === undefined ||
      details.todoDescription === ""
    ) {
      details.todoDescription = todoDescription;
    }
    if (details.stateId === undefined || details.stateId === "") {
      details.stateId = todoState;
    }
    if (details.priorityId === undefined || details.priorityId === "") {
      details.priorityId = todoPriority;
    }

    adjustNameHeight();
    adjustDescriptionHeight();
  }, [newData, todoPriority, todoState]);

  return (
    <div
      className={`max-w-[80%] w-full border-2 border-secondary-light dark:border-secondary-dark flex flex-col py-2 ${
        isClicked ? "md:min-h-40" : "min-h-16"
      }`}
    >
      <div className="flex">
        <div className="hidden md:flex items-center">
          <div
            className={`h-8 w-8 rounded-full border-2 mx-4 border-secondary-light dark:border-secondary-dark ${
              todoState === 1 && "bg-red-500"
            } ${todoState === 2 && "bg-yellow-500"} ${
              todoState === 3 && "bg-green-500"
            }`}
          />
        </div>
        <div className="w-full flex flex-col md:flex-row justify-evenly items-start mx-4">
          <form onChange={(event) => handleDetailsChange(event)}>
            <div className="w-full flex flex-col md:flex-row md:justify-evenly md:items-center md:flex-wrap">
              <div className="flex">
                <div
                  className={`flex md:hidden h-4 w-4 rounded-full border-2 mr-4 border-secondary-light dark:border-secondary-dark ${
                    todoState === 1 && "bg-red-500"
                  } ${todoState === 2 && "bg-yellow-500"} ${
                    todoState === 3 && "bg-green-500"
                  }`}
                />
                <textarea
                  ref={todoNameRef}
                  className="h-auto w-full resize-none mx-0 md:mx-4 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0 md:text-center mb-1 md:mb-0"
                  placeholder={todoName}
                  defaultValue={todoName}
                  rows="1"
                  name="todoName"
                />
              </div>
              <textarea
                ref={todoDescriptionRef}
                className="w-full h-auto resize-none mx-0 md:mx-4 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0 md:text-center text-sm mb-1 md:mb-0"
                placeholder={todoDescription}
                defaultValue={todoDescription}
                rows="1"
                name="todoDescription"
              />
              <div className="flex flex-col md:flex-row md:items-center w-full justify-evenly">
                <div className="flex">
                  <p className="text-sm">Etat:</p>
                  <select
                    className="w-[90%] md:w-auto text-sm bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0 ml-1"
                    name="stateId"
                    value={details.stateId || todoState}
                    onChange={handleDetailsChange}
                  >
                    {state &&
                      state.map((element) => (
                        <option key={element.id} value={element.id}>
                          {element.state}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex">
                  <p className="text-sm">Priorité:</p>
                  <select
                    className="w-[90%] md:w-auto text-sm bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light outline-0 ml-1"
                    name="priorityId"
                    value={details.priorityId || todoPriority}
                    onChange={handleDetailsChange}
                  >
                    {priority &&
                      priority.map((element) => (
                        <option key={element.id} value={element.id}>
                          {element.priority}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center w-16">
          <button type="button" className="" onClick={() => handleCardClick()}>
            {isClicked ? "-" : "+"}
          </button>
        </div>
      </div>
      {isClicked && (
        <div className="flex justify-evenly mt-4">
          {saveButton && (
            <button
              type="button"
              className="border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark text-sm md:text-base"
              onClick={() => handleCardModify()}
            >
              Modifier la tache
            </button>
          )}
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
  isCreator: PropTypes.bool.isRequired,
};

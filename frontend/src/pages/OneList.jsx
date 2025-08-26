import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import axios from "axios";

import CardUser from "../components/CardUser";
import CardTodo from "../components/CardTodo";
import ErrorMessage from "../components/Message/ErrorMessage";
import errorToast from "../services/Toast/errorToast";
import successToast from "../services/Toast/successToast";
import SuccessMessage from "../components/Message/SuccessMessage";

export default function OneList() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCorrectUser, setIsCorrectUser] = useState(false);
  const [deleteList, setDeleteList] = useState(false);
  const isLoggedIn = useOutletContext();

  const [data, setData] = useState();
  const [todoData, setTodoData] = useState();
  const [newData, setNewData] = useState(false);

  const [details, setDetails] = useState({});

  const [searchForm, setSearchForm] = useState("");
  const [userForm, setUserForm] = useState("");
  const [emailForm, setEmailForm] = useState("");

  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState(false);
  const [saveButton, setSaveButton] = useState(false);

  const url = window.location.href;

  const { listId } = useParams();

  useEffect(() => {
    document.title = "MyToDoList - Mes Listes";

    if (!isLoggedIn) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
      setIsLoaded(true);
    } else {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/list/${listId}/infos`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            setIsLoaded(true);
            if (res.data.accessToList === true) {
              setIsCorrectUser(true);
              setData(res.data);

              if (details.listName === undefined || details.listName === "") {
                details.listName = res.data.listInfos.name;
              }
              if (
                details.listDescription === undefined ||
                details.listDescription === ""
              ) {
                details.listDescription = res.data.listInfos.description;
              }
            } else {
              errorToast("Vous n'avez pas accès à cette liste.");
              setTimeout(() => {
                if (window.location.href === url) {
                  window.location.href = "/";
                }
              }, 3500);
            }
          }
        })
        .catch((error) => {
          errorToast(error.response.data.message);
          setIsLoaded(true);
          setIsCorrectUser(false);
          setTimeout(() => {
            if (window.location.href === url) {
              window.location.href = "/list";
            }
          }, 3500);
        });

      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/list/${listId}/get-todos`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setTodoData(res.data);
          }
        })
        .catch((error) => {
          errorToast(error.response.data.message);
        });
    }
  }, [newData]);

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetails((prevDetails) => {
      const updatedDetails = {
        ...prevDetails,
        [name]: value,
      };

      const isListNameChanged = updatedDetails.listName !== data.listInfos.name;
      const isListDescriptionChanged =
        updatedDetails.listDescription !== data.listInfos.description;

      if (data.isCreator) {
        setSaveButton(isListNameChanged || isListDescriptionChanged);
        setOpen(isListNameChanged || isListDescriptionChanged);
      }

      return updatedDetails;
    });
  };

  const handleDelete = async () => {
    try {
      axios
        .delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/list/${listId}/delete`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            successToast(res.data.message);
            setDeleteList(true);
            setTimeout(() => {
              if (window.location.href === url) {
                window.location.href = "/list";
              }
            }, 3500);
          }
        })
        .catch((error) => {
          errorToast(error.response.data.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (details.listName === undefined || details.listName === "") {
        details.listName = data.listInfos.name;
      }
      if (
        details.listDescription === undefined ||
        details.listDescription === ""
      ) {
        details.listDescription = data.listInfos.description;
      }

      if (details.listName.length < 4) {
        errorToast("Le nom de votre liste est trop court");
      } else if (details.listDescription.length < 4) {
        errorToast("La description de votre liste est trop courte");
      } else {
        axios
          .put(
            `${import.meta.env.VITE_BACKEND_URL}/api/list/${listId}/edit`,
            {
              listName: details.listName,
              listDescription: details.listDescription,
            },
            { withCredentials: true }
          )
          .then((res) => {
            if (res.status === 200) {
              successToast(res.data.message);
              setNewData(!newData);
              setSaveButton(false);
              setOpen(false);
            }
          })
          .catch((error) => {
            errorToast(error.response.data.message);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  if (!isCorrectUser) {
    return (
      <ErrorMessage
        titre="Accès Impossible !"
        message1="Vous n'avez pas accès à cette liste."
        message2="Vous allez être redirigé(e) vers la page de vos listes."
      />
    );
  }

  if (deleteList) {
    return (
      <SuccessMessage
        titre="Liste supprimée !"
        message1="Votre liste a bien été supprimée."
        message2="Vous allez être redirigé(e) vers la page de vos listes."
      />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <hr className="w-full mt-6 md:mt-10 border-secondary-light dark:border-secondary-dark" />
      <form className="flex mx-6 flex-col mt-12 w-full justify-center items-center">
        <div className="flex w-[90%] justify-center flex-col md:flex-row">
          <label className="text-center md:text-start flex flex-col w-full">
            Nom de la liste :
            <input
              className="text-center md:text-start bg-primary-light dark:bg-primary-dark outline-0 mb-4 md:mb-0"
              placeholder={data.listInfos.name}
              type="text"
              name="listName"
              value={details.listName || ""}
              required
              autoComplete="off"
              onChange={handleDetailsChange}
              readOnly={!data.isCreator}
            />
          </label>

          <label className="text-center md:text-start flex flex-col w-full">
            Description de la liste :
            <input
              className="text-center md:text-start bg-primary-light dark:bg-primary-dark outline-0 mb-4 md:mb-0"
              placeholder={data.listInfos.description}
              type="text"
              name="listDescription"
              value={details.listDescription || ""}
              required
              autoComplete="off"
              onChange={handleDetailsChange}
              readOnly={!data.isCreator}
            />
          </label>
          <button
            type="button"
            className="text-2xl hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            onClick={() => setOpen(!open)}
          >
            {open ? "-" : "+"}
          </button>
        </div>
        <div
          className={`${open ? "flex" : "hidden"} mt-8 flex-col md:flex-row `}
        >
          {data.isCreator && saveButton && (
            <button
              type="button"
              className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              onClick={() => handleSubmit()}
            >
              Modifier
            </button>
          )}
          <button
            type="button"
            className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            onClick={() => setUserList(!userList)}
          >
            {!userList ? "Accéder aux utilisateurs" : "Accéder aux taches"}
          </button>
          {data.isCreator && (
            <button
              type="button"
              className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              onClick={() => handleDelete()}
            >
              Supprimer
            </button>
          )}
        </div>
      </form>
      <hr className="w-full mt-6 md:mt-10 border-secondary-light dark:border-secondary-dark" />
      {!userList ? (
        <div className="w-full">
          <div className="w-full flex justify-center mt-8">
            <div className="flex px-4 py-1 rounded-full items-center bg-secondary-dark w-full max-w-[30rem] border-2 border-secondary-light">
              <div className="bg-[url('/search-icon.svg')] h-8 bg-no-repeat w-12" />
              <form
                onChange={(e) => setSearchForm(e.target.value)}
                className="w-full"
              >
                <input
                  placeholder="Rechercher une liste"
                  className="bg-secondary-dark text-primary-dark outline-0 w-full"
                />
              </form>
            </div>
          </div>

          <div className="flex flex-col mt-8 gap-4 w-full items-center">
            <div className="max-w-[80%] w-full min-h-16 md:max-h-16 border-2 border-secondary-light dark:border-secondary-dark flex justify-center py-2">
              <div className="w-full flex flex-col md:flex-row justify-evenly items-center">
                <p className="text-center mb-2 md:mb-0">Créer une tâche</p>
                <p className="text-sm text-center mb-2 md:mb-0">
                  Créer une nouvelle tâche
                </p>
                <button
                  type="button"
                  className="border-2 rounded-full mx-4 border-secondary-light dark:border-secondary-dark w-10 h-10 mb-2 md:mb-0 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                  onClick={() =>
                    axios
                      .get(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/list/${listId}/create-todo`,
                        { withCredentials: true }
                      )
                      .then((res) => {
                        if (res.status === 200) {
                          successToast(res.data.message);
                          setNewData(!newData);
                        } else {
                          console.error(res);
                        }
                      })
                      .catch((error) => {
                        errorToast(error.response.data.message);
                      })
                  }
                >
                  +
                </button>
              </div>
            </div>
            {todoData
              .filter((todo) =>
                todo.name.toLowerCase().includes(searchForm.toLowerCase())
              )
              .map((todo) => (
                <CardTodo
                  key={todo.id}
                  todoId={todo.id}
                  todoName={todo.name}
                  todoDescription={todo.description}
                  todoPriority={todo.priority_id}
                  todoState={todo.state_id}
                  newData={newData}
                  setNewData={setNewData}
                  isCreator={data.isCreator}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full flex justify-center mt-8">
            <div className="flex px-4 py-1 rounded-full items-center bg-secondary-dark w-full max-w-[30rem] border-2 border-secondary-light">
              <div className="bg-[url('/search-icon.svg')] h-8 bg-no-repeat w-12" />
              <form
                onChange={(e) => setUserForm(e.target.value)}
                className="w-full"
              >
                <input
                  placeholder="Rechercher un utilisateur"
                  className="bg-secondary-dark text-primary-dark outline-0 w-full"
                />
              </form>
            </div>
          </div>

          <div className="flex flex-col mt-8 gap-4 w-full items-center">
            {data.isCreator && (
              <div className="max-w-[80%] w-full min-h-16 md:max-h-16 border-2 border-secondary-light dark:border-secondary-dark flex justify-center py-2">
                <div className="w-full flex flex-col md:flex-row justify-evenly items-center">
                  <p className="text-center mb-2 md:mb-0">
                    Ajouter un utilisateur
                  </p>

                  <form
                    className="text-sm text-center mb-2 md:mb-0"
                    onChange={(e) => setEmailForm(e.target.value)}
                  >
                    <input
                      placeholder="Email de l'utilisateur a ajouter"
                      className="w-full bg-primary-light dark:bg-primary-dark outline-0 text-secondary-light dark:text-secondary-dark text-center md:text-start"
                    />
                  </form>

                  <button
                    type="button"
                    className="border-2 rounded-full mx-4 border-secondary-light dark:border-secondary-dark w-10 h-10 mb-2 md:mb-0 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                    onClick={() => {
                      if (emailForm === "") {
                        errorToast(
                          "Veuillez entrer un email ou un nom d'utilisateur"
                        );
                      } else {
                        axios
                          .post(
                            `${
                              import.meta.env.VITE_BACKEND_URL
                            }/api/list/${listId}/add-user`,
                            {
                              identifiant: emailForm,
                            },
                            { withCredentials: true }
                          )
                          .then((res) => {
                            if (res.status === 200) {
                              successToast(res.data.message);
                              setNewData(!newData);
                            }
                          })
                          .catch((error) => {
                            errorToast(error.response.data.message);
                          });
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {data.listUsers
              .filter(
                (user) =>
                  user.username
                    .toLowerCase()
                    .includes(userForm.toLowerCase()) ||
                  user.email.toLowerCase().includes(userForm.toLowerCase())
              )
              .map((user) => (
                <CardUser
                  key={user.id}
                  username={user.username}
                  email={user.email}
                  role={user.role}
                  newData={newData}
                  setNewData={setNewData}
                  isCreator={data.isCreator}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

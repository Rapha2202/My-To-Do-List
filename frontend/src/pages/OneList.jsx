import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lottie from "react-lottie-player";

import { toast } from "react-toastify";
import mailError from "../../public/EmailError.json";

import CardTodo from "../components/CardTodo";
import CardUser from "../components/CardUser";

export default function OneList() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isCreator, setIsCreator] = useState(false);

  const [data, setData] = useState([]);
  const [dataTodo, setDataTodo] = useState([]);
  const [users, setUsers] = useState();
  const [newData, setNewData] = useState(false);

  const [thisUsername, setThisUsername] = useState("");

  const [searchForm, setSearchForm] = useState("");
  const [userForm, setUserForm] = useState("");
  const [emailForm, setEmailForm] = useState("");

  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState(false);

  const [details, setDetails] = useState({});

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

  function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function toMatch(match) {
      switch (match) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#39;";
        default:
          return match;
      }
    });
  }

  function updateForm(e) {
    setSearchForm(e.target.value);
  }

  const handleAddUser = async () => {
    setUserList(!userList);
  };

  const handleDelete = async () => {
    try {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/deletelist`,
          {
            listId: id,
          },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.message === "Liste supprimée") {
            setTimeout(() => {
              window.location.href = "/list";
            }, 200);
          } else {
            toast.error(response.data.message, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: localStorage.getItem("theme"),
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async () => {
    try {
      if (details.listName === undefined || details.listName === "") {
        details.listName = data.listName;
      }
      if (
        details.listDescription === undefined ||
        details.listDescription === ""
      ) {
        details.listDescription = data.listDescription;
      }

      if (details.listName.length < 4) {
        toast.error("Le nom de votre liste est trop court", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme"),
        });
      } else if (details.listDescription.length < 4) {
        toast.error("La description de votre liste est trop courte", {
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme"),
        });
      } else {
        const response = await axios.post(
          "http://localhost:3310/api/editlist",
          {
            listName: escapeHtml(details.listName),
            listDescription: escapeHtml(details.listDescription),
            listId: id,
          },
          { withCredentials: true }
        );

        if (response.data.message === "Modification réussie") {
          toast.success("Modification réussie", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: localStorage.getItem("theme"),
          });

          setNewData(!newData);
        } else {
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: localStorage.getItem("theme"),
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);
          setThisUsername(res.data.username);

          axios
            .post(
              `${import.meta.env.VITE_BACKEND_URL}/api/checklistid`,
              {
                listId: id,
              },
              { withCredentials: true }
            )
            .then((resp) => {
              if (resp.data.message === "User Correct") {
                setIsLoggedIn(true);
                setIsLoading(false);

                axios
                  .get(`${import.meta.env.VITE_BACKEND_URL}/api/list/${id}`, {
                    withCredentials: true,
                  })
                  .then((respo) => {
                    setData(respo.data);

                    if (
                      details.listName === undefined ||
                      details.listName === ""
                    ) {
                      details.listName = respo.data.listName;
                    }
                    if (
                      details.listDescription === undefined ||
                      details.listDescription === ""
                    ) {
                      details.listDescription = respo.data.listDescription;
                    }

                    axios
                      .post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/readtodo`,
                        {
                          listId: id,
                        },
                        {
                          withCredentials: true,
                        }
                      )
                      .then((respon) => {
                        setDataTodo(respon.data);
                      })
                      .catch((err) => {
                        console.error(err);
                      });

                    axios
                      .get(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/list/${id}/users`,
                        {
                          withCredentials: true,
                        }
                      )
                      .then((respons) => {
                        setUsers(respons.data);
                      })
                      .catch((err) => {
                        console.error(err);
                      });

                    axios
                      .get(
                        `${
                          import.meta.env.VITE_BACKEND_URL
                        }/api/iscreator/${id}`,
                        {
                          withCredentials: true,
                        }
                      )
                      .then((response) => {
                        if (response.data.role === "creator") {
                          setIsCreator(response.data);
                        }
                      });
                  });
              } else {
                setIsLoggedIn(false);
                setIsLoading(false);
                setTimeout(() => {
                  window.location.href = "/list";
                }, 3800);
              }
            });
        } else {
          setIsLoggedIn(false);
          setTimeout(() => {
            window.location.href = "/login";
          }, 3800);
        }
        setIsLoading(false);
      });
  }, [newData]);

  if (isLoading) {
    return null;
  }
  if (!isLoggedIn) {
    return (
      <main>
        <div className="flex flex-col justify-center items-center text-center h-screen">
          <Lottie
            loop
            animationData={mailError}
            play
            style={{ width: 120, height: 120 }}
          />
          <h1 className="text-3xl">Accès Impossible</h1>
          <p className="text-xl">
            {`
          Vous n'avez pas accès a cette liste.  `}
            <br /> {` Vous allez être redirigé(e) vers la page d'accueil. `}
          </p>
        </div>
      </main>
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
              placeholder={data.listName}
              type="text"
              name="listName"
              value={details.listName || ""}
              required
              autoComplete="off"
              onChange={handleDetailsChange}
            />
          </label>

          <label className="text-center md:text-start flex flex-col w-full">
            Description de la liste :
            <input
              className="text-center md:text-start bg-primary-light dark:bg-primary-dark outline-0 mb-4 md:mb-0"
              placeholder={data.listDescription}
              type="text"
              name="listDescription"
              value={details.listDescription || ""}
              required
              autoComplete="off"
              onChange={handleDetailsChange}
            />
          </label>
          <button type="button" onClick={() => setOpen(!open)}>
            :
          </button>
        </div>
        <div
          className={`${open ? "flex" : "hidden"} mt-8 flex-col md:flex-row `}
        >
          {isCreator && (
            <button
              type="button"
              className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0"
              onClick={() => handleSubmit()}
            >
              Modifier
            </button>
          )}
          <button
            type="button"
            className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0"
            onClick={() => handleAddUser()}
          >
            {!userList ? "Accéder aux utilisateurs" : "Accéder aux taches"}
          </button>
          {isCreator && (
            <button
              type="button"
              className="md:mx-2 border-2 rounded-full px-4 py-2 border-secondary-light dark:border-secondary-dark mb-4 md:mb-0"
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
              <form onChange={updateForm} className="w-full">
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
                <h1 className="text-center mb-2 md:mb-0">Créer un Todo</h1>
                <p className="text-sm text-center mb-2 md:mb-0">
                  Créer une nouvelle Todo
                </p>
                <button
                  type="button"
                  className="border-2 rounded-full mx-4 border-secondary-light dark:border-secondary-dark w-10 h-10 mb-2 md:mb-0"
                  onClick={() =>
                    axios
                      .post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/createtodo`,
                        {
                          listId: id,
                        },
                        { withCredentials: true }
                      )
                      .then(() => {
                        toast.success("Tache crée avec succès", {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: localStorage.getItem("theme"),
                        });
                        setNewData(!newData);
                      })
                  }
                >
                  +
                </button>
              </div>
            </div>
            {dataTodo &&
              dataTodo
                .filter((todo) =>
                  todo.todoName.toLowerCase().includes(searchForm.toLowerCase())
                )
                .map((todo) => (
                  <CardTodo
                    key={todo.id}
                    todoId={todo.id}
                    todoName={todo.todoName}
                    todoDescription={todo.todoDescription}
                    todoPriority={todo.priority_id}
                    todoState={todo.state_id}
                    newData={newData}
                    setNewData={setNewData}
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
            {isCreator && (
              <div className="max-w-[80%] w-full min-h-16 md:max-h-16 border-2 border-secondary-light dark:border-secondary-dark flex justify-center py-2">
                <div className="w-full flex flex-col md:flex-row justify-evenly items-center">
                  <h1 className="text-center mb-2 md:mb-0">
                    Ajouter un utilisateur
                  </h1>

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
                    className="border-2 rounded-full mx-4 border-secondary-light dark:border-secondary-dark w-10 h-10 mb-2 md:mb-0"
                    onClick={() => {
                      axios
                        .post(
                          `${
                            import.meta.env.VITE_BACKEND_URL
                          }/api/list/adduser`,
                          {
                            listId: id,
                            email: escapeHtml(emailForm),
                          },
                          { withCredentials: true }
                        )
                        .then((res) => {
                          if (res.data.message === "User added") {
                            toast.success("Utilisateur ajouté avec succès", {
                              position: "top-right",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: localStorage.getItem("theme"),
                            });
                            setNewData(!newData);
                          } else {
                            toast.error(res.data.message, {
                              position: "top-right",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: localStorage.getItem("theme"),
                            });
                          }
                        });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            {users &&
              users
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
                    thisUsername={thisUsername}
                    username={user.username}
                    email={user.email}
                    role={user.role}
                    newData={newData}
                    setNewData={setNewData}
                    isCreator={isCreator}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
}

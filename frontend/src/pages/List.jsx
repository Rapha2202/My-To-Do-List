import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import CardList from "../components/CardList";
import ErrorMessage from "../components/Message/ErrorMessage";
import successToast from "../services/Toast/successToast";

export default function List() {
  const isLoggedIn = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);

  const [searchForm, setSearchForm] = useState("");

  const [data, setData] = useState([]);
  const [newData, setNewData] = useState(false);

  const url = window.location.href;

  useEffect(() => {
    if (!isLoggedIn) {
      setTimeout(() => {
        if (window.location.href === url) {
          window.location.href = "/";
        }
      }, 3500);
    } else {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/list/get-lists`, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    setIsLoading(false);
  }, [newData]);

  function updateForm(e) {
    setSearchForm(e.target.value);
  }

  if (isLoading) {
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
  return (
    <div className="min-h-screen flex flex-col text-center items-center justify-center">
      <div className="p-8 mt-8 md:mt-0 md:w-[60%]">
        <h1 className="text-3xl md:text-5xl mb-4">Mes Listes</h1>
        <div className="w-full flex justify-center">
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

        <div className="flex flex-wrap mt-16 gap-8 justify-center">
          <div className="w-40 min-h-40 border-2 border-secondary-light dark:border-secondary-dark flex flex-col justify-center">
            <div>
              <h1 className="mt-2">Créer une liste</h1>
              <p className="text-sm mt-2">Créer une nouvelle liste</p>
              <button
                type="button"
                className="border-2 rounded-full mx-4 mt-4 border-secondary-light dark:border-secondary-dark mb-2 w-10 h-10 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                onClick={() =>
                  axios
                    .get(
                      `${
                        import.meta.env.VITE_BACKEND_URL
                      }/api/list/create-list`,
                      {
                        withCredentials: true,
                      }
                    )
                    .then((res) => {
                      successToast(res.data.message);
                      setNewData(!newData);
                    })
                }
              >
                +
              </button>
            </div>
          </div>
          {data &&
            data
              .filter((liste) =>
                liste.name.toLowerCase().includes(searchForm.toLowerCase())
              )
              .map((liste) => (
                <CardList
                  key={liste.id}
                  listId={liste.id}
                  listName={liste.name}
                  listDescription={liste.description}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

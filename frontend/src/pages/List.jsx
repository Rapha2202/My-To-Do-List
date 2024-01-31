import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "react-lottie-player";
import { toast } from "react-toastify";
import CardList from "../components/CardList";

import mailError from "../../public/EmailError.json";

export default function List() {
  const [searchForm, setSearchForm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [data, setData] = useState([]);
  const [newData, setNewData] = useState(false);

  function updateForm(e) {
    setSearchForm(e.target.value);
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);

          axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/api/readlist`, {
              withCredentials: true,
            })
            .then((resp) => {
              setData([...resp.data]);
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
          Vous devez vous connecter pour accéder à cette page.  `}
            <br /> {` Vous allez être redirigé(e) vers la page de connexion. `}
          </p>
        </div>
      </main>
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
                className="border-2 rounded-full mx-4 mt-4 border-secondary-light dark:border-secondary-dark mb-2 w-10 h-10"
                onClick={() =>
                  axios
                    .get(`${import.meta.env.VITE_BACKEND_URL}/api/createlist`, {
                      withCredentials: true,
                    })
                    .then(() => {
                      toast.success("Liste crée avec succès", {
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
          {data &&
            data
              .filter((liste) =>
                liste[0].listName
                  .toLowerCase()
                  .includes(searchForm.toLowerCase())
              )
              .map((liste) => (
                <CardList
                  key={liste[0].id}
                  listId={liste[0].id}
                  listName={liste[0].listName}
                  listDescription={liste[0].listDescription}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.removeAttribute("class");
      localStorage.theme = "light";
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/check-id`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsLoggedIn(response.data.login);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setIsLoaded(true);
      });
  }, [pathname]);

  function ThemeToggle() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.removeAttribute("class");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="bg-primary-light dark:bg-primary-dark text-secondary-light dark:text-secondary-dark font-apercu font-bold">
      <ScrollRestoration />
      {pathname.includes("/verify") ? null : (
        <nav className="sticky top-0">
          <Navbar isLoggedIn={isLoggedIn} />
        </nav>
      )}

      <main className="min-h-screen">
        <Outlet context={isLoggedIn} />
        <button
          type="button"
          onClick={ThemeToggle}
          className={`fixed right-4 ${
            pathname.includes("/verify") ? "bottom-4" : "bottom-4 md:bottom-20"
          } border-[1px] rounded-full h-12 md:h-16 w-12 md:w-16 flex justify-center items-center border-primary-dark dark:border-primary text-secondary dark:text-secondary-dark bg-primary-light dark:bg-primary-dark hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out`}
        >
          <div>
            <img
              className="block dark:hidden h-10 md:h-12 w-10 md:w-12"
              src="/Footer/moon.svg"
              alt="Passage au thême sombre"
            />
            <img
              className="hidden dark:block h-10 md:h-12 w-10 md:w-12"
              src="/Footer/sun.svg"
              alt="Passage au thême clair"
            />
          </div>
        </button>
      </main>

      {pathname.includes("/verify") ? null : (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default App;

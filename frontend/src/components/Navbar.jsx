import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/checktoken`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setIsLoggedIn(true);
        }
      });
  }, []);

  return (
    <div className="h-16 md:h-24 flex items-center bg-primary-light dark:bg-primary-dark">
      <section className="MOBILE-MENU flex md:hidden justify-between px-4 w-screen">
        <Link to="/" className="flex items-center">
          Accueil
        </Link>
        <button
          type="button"
          className="HAMBURGER-ICON space-y-2"
          onClick={() => setIsNavOpen((prev) => !prev)} // toggle isNavOpen state on click
        >
          {" "}
          <span className="block h-0.5 w-8 bg-secondary-light dark:bg-secondary-dark" />
          <span className="block h-0.5 w-8 bg-secondary-light dark:bg-secondary-dark" />
          <span className="block h-0.5 w-8 bg-secondary-light dark:bg-secondary-dark" />
        </button>

        <div
          className={
            isNavOpen
              ? "absolute w-screen h-screen top-0 left-0 bg-primary-light dark:bg-primary-dark z-10 flex flex-col justify-evenly items-center"
              : "hidden"
          }
        >
          <button
            type="button"
            className="CROSS-ICON absolute top-0 right-0 px-4 py-4"
            onClick={() => setIsNavOpen(false)}
          >
            {" "}
            <svg
              className="h-8 w-8  text-secondary-light dark:text-secondary-dark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-center min-h-[250px]">
            <Link
              to="/"
              className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase"
              onClick={() => setIsNavOpen(false)}
            >
              Accueil
            </Link>
            {!isLoggedIn ? (
              <div className="flex flex-col">
                <Link
                  to="/login"
                  className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase"
                  onClick={() => setIsNavOpen(false)}
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link
                  to="/list"
                  className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase"
                  onClick={() => setIsNavOpen(false)}
                >
                  Mes Listes
                </Link>
              </div>
            )}
            {!isLoggedIn ? (
              <Link
                to="/sign-up"
                className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase"
                onClick={() => setIsNavOpen(false)}
              >
                Sign Up
              </Link>
            ) : (
              <Link
                to="/profil"
                className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase"
                onClick={() => setIsNavOpen(false)}
              >
                Profil
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="DESKTOP w-screen hidden md:flex justify-around">
        <Link to="/" className="flex items-center">
          Accueil
        </Link>
        {!isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <Link to="/login">Login</Link>
            <Link
              to="sign-up"
              className="p-1 border-[1px] border-secondary dark:border-secondary-dark rounded-[10px] ml-8"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <Link to="/list">Mes Listes</Link>
        )}

        {isLoggedIn && <Link to="/profil">Profil</Link>}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Navbar({ isLoggedIn }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="h-16 md:h-24 flex items-center bg-primary-light dark:bg-primary-dark">
      <section className="MOBILE-MENU flex md:hidden justify-between px-4 w-screen z-50">
        <Link
          to="/"
          className="flex items-center hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
        >
          Accueil
        </Link>
        <button
          type="button"
          className="HAMBURGER-ICON space-y-2 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
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
            className="CROSS-ICON absolute top-0 right-0 px-4 py-4 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
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
              className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              onClick={() => setIsNavOpen(false)}
            >
              Accueil
            </Link>
            {!isLoggedIn ? (
              <div className="flex flex-col">
                <Link
                  to="/login"
                  className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                  onClick={() => setIsNavOpen(false)}
                >
                  Connexion
                </Link>
              </div>
            ) : (
              <div className="flex flex-col">
                <Link
                  to="/list"
                  className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                  onClick={() => setIsNavOpen(false)}
                >
                  Mes Listes
                </Link>
              </div>
            )}
            {!isLoggedIn ? (
              <Link
                to="/register"
                className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                onClick={() => setIsNavOpen(false)}
              >
                Inscription
              </Link>
            ) : (
              <Link
                to="/profil"
                className="border-b border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark my-8 uppercase hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
                onClick={() => setIsNavOpen(false)}
              >
                Profil
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="DESKTOP w-screen hidden md:flex justify-around">
        <Link
          to="/"
          className="flex items-center hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
        >
          Accueil
        </Link>
        {!isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <Link
              to="/login"
              className=" hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            >
              Connexion
            </Link>
            <Link
              to="register"
              className="p-1 border-[1px] border-secondary dark:border-secondary-dark rounded-[10px] ml-8 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
            >
              Inscription
            </Link>
          </div>
        ) : (
          <Link
            to="/list"
            className=" hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
          >
            Mes Listes
          </Link>
        )}

        {isLoggedIn && (
          <Link
            to="/profil"
            className=" hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
          >
            Profil
          </Link>
        )}
      </div>
    </div>
  );
}

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

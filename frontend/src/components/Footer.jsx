function Footer() {
  return (
    <footer className="bg-primary-light dark:bg-primary-dark text-secondary dark:text-secondary-dark text-center text-lg">
      <hr className="w-[90%] md:w-[65%] m-auto mt-6 md:mt-10 border-secondary-light dark:border-secondary-dark" />
      <ul className="flex justify-evenly mt-8 md:mt-16 mb-8 md:mb-16">
        <li>
          <a href="https://github.com/Rapha2202">
            <img
              className="hidden dark:block h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/github-light.svg"
              alt="Logo Github"
            />
            <img
              className="block dark:hidden h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/github-dark.svg"
              alt="Logo Github"
            />
          </a>
        </li>
        <li>
          <a href="mailto:raphael.foulonbinet@gmail.com">
            <img
              className="hidden dark:block h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/email-light.svg"
              alt="Logo Email"
            />
            <img
              className="block dark:hidden h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/email-dark.svg"
              alt="Logo Email"
            />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/raphael-foulon-binet-575aa8290/">
            <img
              className="hidden dark:block h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/linkedin-light.svg"
              alt="Logo Linkedin"
            />
            <img
              className="block dark:hidden h-12 md:h-16 hover:scale-105 hover:transform hover:transition-all hover:duration-300 hover:ease-in-out"
              src="/Footer/linkedin-dark.svg"
              alt="Logo Linkedin"
            />
          </a>
        </li>
      </ul>
      <p className="pb-20 text-base md:text-lg">
        © 2024 - Raphaël Foulon-Binet
      </p>
    </footer>
  );
}

export default Footer;

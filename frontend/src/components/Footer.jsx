function Footer() {
  return (
    <footer className="bg-primary-light dark:bg-primary-dark text-secondary dark:text-secondary-dark text-center text-lg">
      <hr className="w-[90%] md:w-[65%] m-auto mt-6 md:mt-10 border-secondary-light dark:border-secondary-dark" />
      <ul className="flex justify-evenly mt-8 md:mt-16 mb-8 md:mb-16">
        <li>
          <a href="https://github.com/Rapha2202">
            <img
              className="hidden dark:block h-12 md:h-16"
              src="/github-light.svg"
              alt="Github"
            />
            <img
              className="block dark:hidden h-12 md:h-16"
              src="/github-dark.svg"
              alt="Github"
            />
          </a>
        </li>
        <li>
          <a href="mailto:raphael.foulonbinet@gmail.com">
            <img
              className="hidden dark:block h-12 md:h-16"
              src="/email-light.svg"
              alt="Mail"
            />
            <img
              className="block dark:hidden h-12 md:h-16"
              src="/email-dark.svg"
              alt="Mail"
            />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/raphael-foulon-binet-575aa8290/">
            <img
              className="hidden dark:block h-12 md:h-16"
              src="/linkedin-light.svg"
              alt="Linkedin"
            />
            <img
              className="block dark:hidden h-12 md:h-16"
              src="/linkedin-dark.svg"
              alt="Linkedin"
            />
          </a>
        </li>
      </ul>
      <p className="pb-20 text-base md:text-lg">
        © 2024 - Raphael Foulon-Binet
      </p>
    </footer>
  );
}

export default Footer;

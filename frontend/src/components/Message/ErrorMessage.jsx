import Lottie from "react-lottie-player";
import PropTypes from "prop-types";
import Error from "../../../public/Lottie/Error.json";

export default function ErrorMessage({ titre, message1, message2 }) {
  return (
    <main>
      <div className="flex justify-center items-center flex-col h-screen text-center">
        <Lottie
          loop
          animationData={Error}
          play
          className="w-[120px] h-[120px] md:w-[170px] md:h-[170px]"
        />
        <p className="text-2xl md:text-3xl">{titre}</p>
        <p className="text-base md:text-xl mt-2">{message1}</p>
        <p className="text-base md:text-xl">{message2}</p>
      </div>
    </main>
  );
}

ErrorMessage.propTypes = {
  titre: PropTypes.string,
  message1: PropTypes.string,
  message2: PropTypes.string,
};

ErrorMessage.defaultProps = {
  titre: "",
  message1: "",
  message2: "",
};

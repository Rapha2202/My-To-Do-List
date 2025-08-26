import Lottie from "react-lottie-player";
import PropTypes from "prop-types";
import Valid from "../../../public/Lottie/Valid.json";

export default function SuccessMessage({ titre, message1, message2 }) {
  return (
    <main>
      <div className="flex justify-center items-center flex-col h-screen text-center">
        <Lottie
          animationData={Valid}
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

SuccessMessage.propTypes = {
  titre: PropTypes.string,
  message1: PropTypes.string,
  message2: PropTypes.string,
};

SuccessMessage.defaultProps = {
  titre: "",
  message1: "",
  message2: "",
};

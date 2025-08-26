import { toast } from "react-toastify";

export default function errorToast(message) {
  toast.error(message, {
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

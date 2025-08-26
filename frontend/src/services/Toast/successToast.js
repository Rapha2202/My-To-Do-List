import { toast } from "react-toastify";

export default function successToast(message) {
  toast.success(message, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem("theme"),
  });
}

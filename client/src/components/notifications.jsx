import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useToast = () => {
  return {
    showSuccess: (message) => {
      toast.success(message);
    },
    showError: (message) => {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    showInfo: (message) => {
      toast.info(message);
    },
    showWarning: (message) => {
      toast.warning(message);
    },
  };
};

// add success notifySuccess

export default useToast;

import { useRef, useEffect } from "react";

function useAutoHeight(initialValue) {
  const ref = useRef(null);

  const adjustHeight = () => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [initialValue]);

  return [ref, adjustHeight];
}

export default useAutoHeight;

import { useState } from "react";

function useDarkMode(defaultMode = true) {
  const [darkMode, setDarkMode] = useState(defaultMode);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  return { darkMode, toggleDarkMode };
}

export default useDarkMode;

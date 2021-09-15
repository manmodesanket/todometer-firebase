import { useAppContext } from "../../context/AppContext";
import { Sun, Moon, LogOut } from "react-feather";
import { useEffect, useState } from "react";
import { getAuth, signOut } from "@firebase/auth";

export default function Navbar() {
  const { darkMode, toggleTheme, setLoadingAuth } = useAppContext();
  let [dark, setDark] = useState("light");
  const auth = getAuth();
  const currentUser = auth.currentUser;
  useEffect(() => {
    setDark(darkMode);
  }, [darkMode]);

  const handleSignout = () => {
    signOut(auth).then(() => {
      setLoadingAuth(true);
    });
  };

  return (
    <header className="w-full mx-auto">
      <nav className="flex justify-between items-center border-b-2">
        <div className="flex justify-items-center items-center ">
          <figure className="w-7 h-7">
            <img src="/todometer.png" alt="todometer" />
          </figure>
          <h1 className="font-bold text-3xl sm:text-4xl ml-2">todometer</h1>
        </div>
        {currentUser && (
          <LogOut onClick={() => handleSignout()} className="cursor-pointer" />
        )}
        <div
          className="cursor-pointer flex items-center text-2xl sm:text-xl  dark:hover:text-dark-200"
          onClick={() => toggleTheme()}
        >
          {dark === "light" ? <Moon /> : <Sun />}
        </div>
      </nav>
    </header>
  );
}

import Head from "next/head";
import { useEffect, useState } from "react";
import {
  AddItemForm,
  AuthForm,
  DateView,
  Meter,
  Navbar,
  TodoView,
} from "../components";
import { useAppContext } from "../context/AppContext";

export default function Home() {
  const { darkMode, user } = useAppContext();
  let [dark, setDark] = useState("light");
  useEffect(() => {
    setDark(darkMode);
  }, [darkMode]);
  return (
    <div className={dark === "dark" ? `${"dark"}` : ""}>
      <div className="w-full min-h-screen dark:bg-dark dark:text-white">
        <Head>
          <title>todometer</title>
          <link rel="icon" href="/todometer.png" />
        </Head>

        <main className="w-11/12 sm:w-9/12 min-h-screen mx-auto sm:px-80">
          <Navbar />
          {user ? (
            <>
              <DateView />
              <Meter />
              <AddItemForm />
              <TodoView />
            </>
          ) : (
            <AuthForm />
          )}
        </main>
      </div>
    </div>
  );
}

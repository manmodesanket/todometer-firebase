import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import "firebase/auth";
import useLocalStorage from "../hooks/useLocalStorage";
import { todoReducer } from "../reducer/TodoReducer";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_API_ID,
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppContextProvider({ children }) {
  // const [storedTodo, setStoredTodo] = useLocalStorage("todo", []);
  const [todoList, todoDispatch] = useReducer(todoReducer, []);
  const [pending, setPending] = useState([]);
  const [paused, setPaused] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [formType, setFormType] = useState("login");
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage("dark", "light");
  const [darkMode, setDarkMode] = useState(storedDarkMode);

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => listener();
  }, []);

  useEffect(async () => {
    let firebaseTodos = [];
    if (user !== null) {
      try {
        const snap = await getDocs(
          collection(db, auth.currentUser.displayName)
        );
        snap.forEach((doc) => {
          firebaseTodos.push(doc.data());
        });
      } catch (err) {}
    }
    todoDispatch({
      type: "ADD_ALL_ITEMS",
      payload: firebaseTodos,
    });
  }, [user]);

  useEffect(() => {
    setDarkMode(storedDarkMode);
  }, [storedDarkMode]);

  // useEffect(() => {
  //   setStoredTodo(todoList);
  // }, [todoList]);

  const toggleTheme = () => {
    setStoredDarkMode((currTheme) =>
      currTheme === "light" ? "dark" : "light"
    );
  };

  useEffect(() => {
    const pending = todoList.filter((item) => item.status === "pending");
    const paused = todoList.filter((item) => item.status === "paused");
    const completed = todoList.filter((item) => item.status === "completed");

    setPending(pending);
    setPaused(paused);
    setCompleted(completed);
  }, [todoList]);

  return (
    <AppContext.Provider
      value={{
        toggleTheme,
        firebase,
        db,
        loadingAuth,
        setLoadingAuth,
        formType,
        setFormType,
        auth,
        user,
        darkMode,
        pending,
        paused,
        completed,
        completedPercentage: completed.length / todoList.length,
        pausedPercentage: paused.length / todoList.length,
        todoDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

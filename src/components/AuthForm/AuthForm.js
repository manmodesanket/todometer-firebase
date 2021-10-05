import { useEffect, useRef, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "@firebase/auth";
import { useAppContext } from "../../context/AppContext";

export default function AuthForm() {
  const { formType, user, setLoadingAuth } = useAppContext();

  useEffect(() => {
    if (user != null) {
      setLoadingAuth(false);
    } else {
      setLoadingAuth(true);
    }
  }, [user]);

  return <>{formType === "login" ? <Login /> : <Signup />}</>;
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setLoadingAuth, formType, setFormType } = useAppContext();
  const [error, setError] = useState(null);
  let inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    if (username !== "" && password !== "") {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, username, password)
        .then(() => {
          setLoadingAuth(false);
        })
        .catch((error) => {
          setUsername("");
          setPassword("");
          setError(error.message);
        });
    } else {
      setError("Please fill all the details");
    }
  };

  return (
    <section>
      <form
        className="w-full relative mt-10 flex flex-col justify-center items-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2 className="text-xl font-bold my-2">Login Form</h2>
        <input
          value={username}
          ref={inputRef}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border-2 my-2 p-2 sm:p-4 rounded border-black dark:bg-inputColor"
          placeholder="Email"
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 p-2 sm:p-4 rounded border-black dark:bg-inputColor "
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full bg-green-300 dark:bg-green-500 p-2 my-4 border rounded"
        >
          <span className="font-bold">Login</span>
        </button>
        <button
          onClick={() => {
            setUsername("guest123@gmail.com");
            setPassword("guest123");
          }}
          className="w-full bg-green-300 dark:bg-green-500 p-2 my-4 border rounded"
        >
          <span className="font-bold">Guest Login</span>
        </button>
        <p>
          Don't have account{" "}
          <span
            onClick={() => setFormType("signup")}
            className="text-blue-200 border-b cursor-pointer"
          >
            Signup
          </span>
        </p>
      </form>
    </section>
  );
}

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingSignup, setLoadingSignUp] = useState(true);
  const [error, setError] = useState(null);
  const { setLoadingAuth, formType, setFormType } = useAppContext();
  let inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    if (username !== "" && email !== "" && password !== "") {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          updateProfile(auth.currentUser, { displayName: username });
          setLoadingSignUp(false);
          setLoadingAuth(false);
        })
        .catch((error) => {
          setUsername("");
          setEmail("");
          setPassword("");
          setError(error.message);
        });
    } else {
      setError("Please fill all the details");
    }
  };

  return (
    <section>
      <form
        className="w-full relative mt-10 flex flex-col justify-center items-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2 className="text-xl font-bold mb-2">Signup Form</h2>
        {error && <p className="mb-2">{error}</p>}
        <input
          value={username}
          type="text"
          ref={inputRef}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border-2 my-2 p-2 sm:p-4 rounded border-black dark:bg-inputColor"
          placeholder="Username"
        />
        <input
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-2 my-4 p-2 sm:p-4 rounded border-black dark:bg-inputColor"
          placeholder="Email"
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 p-2 sm:p-4 rounded border-black dark:bg-inputColor "
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full bg-green-300 dark:bg-green-500 p-2 my-4 border rounded"
        >
          <span className="font-bold">Signup</span>
        </button>
        <p className="text-red-200">
          Already have an account{" "}
          <span
            onClick={() => setFormType("login")}
            className="text-red-200 border-b cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </section>
  );
}

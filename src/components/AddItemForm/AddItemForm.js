import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { getAuth } from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function AddItemForm() {
  const { todoDispatch, db } = useAppContext();
  const [content, saveContent] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  let inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (content) {
      let newTodo = {
        id: uuidv4(),
        task: content,
        time: Date.now(),
        status: "pending",
      };
      setDoc(doc(db, user.displayName, newTodo.id), newTodo).then(() => {
        todoDispatch({
          type: "ADD_ITEM",
          payload: newTodo,
        });
      });
    }

    saveContent("");
    inputRef.current.focus();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <section>
      <form
        className="w-full relative mt-10 flex justify-center items-center"
        onSubmit={() => handleSubmit(e)}
      >
        <input
          value={content}
          ref={inputRef}
          onChange={(e) => saveContent(e.target.value)}
          className="w-full border-2 p-2 sm:p-4 rounded border-black dark:bg-inputColor "
          placeholder="Add new item"
        />
        <button
          type="submit"
          className="absolute right-6 w-6 h-6 flex items-center"
          onClick={handleSubmit}
        >
          <Image src="/plus.svg" alt="plus" width="24" height="24" />
        </button>
      </form>
    </section>
  );
}

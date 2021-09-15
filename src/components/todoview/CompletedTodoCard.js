import { getAuth } from "@firebase/auth";
import Image from "next/image";
import { useAppContext } from "../../context/AppContext";
import { removeTodo } from "../../utils/utils";

function CompleteTodoCard({ todoItem }) {
  const { todoDispatch, db } = useAppContext();
  const auth = getAuth();
  let displayName = "";
  if (auth.currentUser !== null) {
    displayName = auth.currentUser.displayName;
  }
  return (
    <article className="w-full mx-auto px-4 py-2 mt-5 border-2 border-black rounded flex justify-between items-center dark:bg-itemColor">
      <div className="font-bold">{todoItem.task}</div>
      <div className="w-4/12 sm:w-2/12 flex flex-row-reverse justify-between">
        <figure
          className="flex items-center cursor-pointer"
          onClick={async () =>
            await removeTodo({
              id: todoItem.id,
              dispatch: todoDispatch,
              username: displayName,
              db,
            })
          }
        >
          <Image src="/x.svg" alt="x" width="24" height="24" />
        </figure>
      </div>
    </article>
  );
}

export default CompleteTodoCard;

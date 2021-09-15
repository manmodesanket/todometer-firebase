import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export async function removeTodo({ id, dispatch, username, db }) {
  await deleteDoc(doc(db, username, id));
  dispatch({
    type: "REMOVE_ITEM",
    payload: id,
  });
}

export async function addTodoLater({ todo, dispatch, username, db }) {
  await updateDoc(doc(db, username, todo.id), {
    status: "paused",
  });
  dispatch({
    type: "ADD_TO_DO_LATER",
    payload: todo,
  });
}

export async function addToComplete({ todo, dispatch, username, db }) {
  await updateDoc(doc(db, username, todo.id), {
    status: "completed",
  });
  dispatch({
    type: "ADD_TO_COMPLETED",
    payload: todo,
  });
}

export async function addToPending({ todo, dispatch, username, db }) {
  await updateDoc(doc(db, username, todo.id), {
    status: "pending",
  });
  dispatch({
    type: "ADD_TO_PENDING",
    payload: todo,
  });
}

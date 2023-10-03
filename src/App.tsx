import React, { useState, useEffect } from "react";
import "./App.css";
import InputField from "./components/InputFiels";
import TodoList from "./components/TodoList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Todo } from "./model";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [CompletedTodos, setCompletedTodos] = useState<Array<Todo>>([]);

  const getTodosFromLocalStorage = (): Todo[] => {
    const todosString = localStorage.getItem("Todo[]");
    console.log(todosString, "tdd");

    if (todosString) {
      console.log("called if");

      return JSON.parse(todosString);
    }
    console.log("else called");

    return [];
  };

  const getCompletedTodosFromLocalStorage = (): Todo[] => {
    const todosString = localStorage.getItem("completedTodos");

    if (todosString) {
      return JSON.parse(todosString);
    }

    return [];
  };

  const saveTodosToLocalStorage = (todos: Todo[]): void => {
    localStorage.setItem("Todo[]", JSON.stringify(todos));
    return;
  };

  const saveCompletedTodosToLocalStorage = (todos: Todo[]): void => {
    localStorage.setItem("completedTodos", JSON.stringify(todos));
    return;
  };
  useEffect(() => {
    const Mytodos = getTodosFromLocalStorage();
    const MycompletedTodos = getCompletedTodosFromLocalStorage();
    if (Mytodos) {
      setTodos(Mytodos);
    }
    if (MycompletedTodos) {
      // Set completed todos if available in local storage
      setCompletedTodos(MycompletedTodos);
    }
  }, []);

  useEffect(() => {
    saveTodosToLocalStorage(todos);
  }, [todos]);
  useEffect(() => {
    console.log("save locals useefcgt");
    
    // This effect will run whenever 'CompletedTodos' state changes
    saveCompletedTodosToLocalStorage(CompletedTodos);
  }, [CompletedTodos]);
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.trim() == "") {
      setTodo("");
      return;
    }

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo, isDone: false }]);
      saveTodosToLocalStorage(todos);
      setTodo("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    console.log(result);

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let add;
    // eslint-disable-next-line prefer-const
    let active = todos;
    // eslint-disable-next-line prefer-const
    let complete = CompletedTodos;
    // Source Logic
    if (source.droppableId === "TodosList") {
      add = active[source.index];
      active.splice(source.index, 1);
    } else {
      add = complete[source.index];
      complete.splice(source.index, 1);
    }

    // Destination Logic
    if (destination.droppableId === "TodosList") {
      active.splice(destination.index, 0, add);
    } else {
      complete.splice(destination.index, 0, add);
    }

    setCompletedTodos(complete);
    saveCompletedTodosToLocalStorage(complete)
    setTodos(active);
    saveTodosToLocalStorage(active)
  };
  console.log(CompletedTodos, "ct");
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <span className="heading">Taskify</span>
        <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
        <TodoList
          todos={todos}
          setTodos={setTodos}
          saveTodosToLocalStorage={saveTodosToLocalStorage}
          CompletedTodos={CompletedTodos}
          setCompletedTodos={setCompletedTodos}
        />
      </div>
    </DragDropContext>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { Tile, ToastNotification } from "carbon-components-react";
import { useToasts } from "react-toast-notifications";
import * as todosService from "./services/todos";
import TaskList from "./components/TaskList";
import Task from "./components/Task";
import AddNewTask from "./components/AddNewTask";

export const PENDING_TASK_STATUS = 0;
export const COMPLETED_TASK_STATUS = 1;
export const ERROR_STATUS = 500;

function App() {
  const [allTasksState, setAllTasks] = useState({
    tasks: [],
    loading: false,
  });

  const [error, setError] = useState("");
  const [pendingTasksList, setPendingTasksList] = useState([]);
  const [completedTasksList, setCompletedTasksList] = useState([]);
  const [currentTaskLoading, toggleCurrentTaskLoading] = useState([]);

  const { addToast } = useToasts();

  const handleToggleCompletion = (todoId, status, password) => {
    if (!currentTaskLoading.includes(todoId))
      toggleCurrentTaskLoading([...currentTaskLoading, todoId]);
    todosService
      .updateTask({ status, todoId, password })
      .then((res) => {
        const todo = res.data;

        toggleCurrentTaskLoading(
          currentTaskLoading.filter((t) => t !== todo.id)
        );

        if (status === COMPLETED_TASK_STATUS) {
          setCompletedTasksList([todo, ...completedTasksList]);
          setPendingTasksList(
            pendingTasksList.filter((task) => task.id !== todo.id)
          );
          addToast("Tarefa Concluída 🚀", { appearance: "success" });
        }
        if (status === PENDING_TASK_STATUS) {
          setPendingTasksList([todo, ...pendingTasksList]);
          setCompletedTasksList(
            completedTasksList.filter((task) => task.id !== todo.id)
          );
          addToast("Tarefa Retornada 💣", { appearance: "info" });
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
        toggleCurrentTaskLoading(
          currentTaskLoading.filter((t) => t.id !== todoId)
        );
      });
  };

  useEffect(() => {
    setPendingTasksList(
      allTasksState.tasks.filter((task) => task.status === PENDING_TASK_STATUS)
    );
    setCompletedTasksList(
      allTasksState.tasks.filter(
        (task) => task.status === COMPLETED_TASK_STATUS
      )
    );
  }, [allTasksState]);

  useEffect(() => {
    setAllTasks({
      ...allTasksState,
      loading: true,
    });

    todosService
      .getAllTasks()
      .then(({ data }) => {
        setAllTasks({
          tasks: data,
          loading: false,
        });
      })
      .catch((error) => {
        setError(error.response.data.message);
        setAllTasks({
          tasks: [],
          loading: false,
        });
      });
  }, []);

  useEffect(() => {
    if (error)
      addToast(error, {
        appearance: "error",
        onDismiss: () => {
          setError("");
        },
      });
  }, [error]);

  return (
    <>
      <div
        style={{
          height: "80%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Tile style={{ height: "10%", fontSize: "25px", textAlign: "center" }}>
          🦔 Saipos
        </Tile>
        <div
          style={{
            height: "640px",
            width: "100%",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <TaskList id="pendingTasksList" title="Tarefas Pendentes 📋">
            {pendingTasksList.map((task) => {
              return (
                <Task
                  key={task.id}
                  {...task}
                  handleToggleCompletion={handleToggleCompletion}
                  loading={currentTaskLoading}
                />
              );
            })}
          </TaskList>
          <AddNewTask
            setPendingTasksList={setPendingTasksList}
            pendingTasksList={pendingTasksList}
          />
          <TaskList id="completedTasksList" title="Tarefas Completas ✅">
            {completedTasksList.map((task) => {
              return (
                <Task
                  key={task.id}
                  {...task}
                  handleToggleCompletion={handleToggleCompletion}
                  loading={currentTaskLoading}
                />
              );
            })}
          </TaskList>
        </div>
      </div>
    </>
  );
}

export default App;

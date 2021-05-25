import React, { useState, useEffect } from "react";
import { Tile } from "carbon-components-react";
import * as todosService from "./services/todos";
import TaskList from "./components/TaskList";
import Task from "./components/Task";

export const PENDING_TASK_STATUS = 0;
export const COMPLETED_TASK_STATUS = 1;

function App() {
  const [allTasksState, setAllTasks] = useState({
    tasks: [],
    loading: false,
    error: "",
  });

  const [pendingTasksList, setPendingTasksList] = useState([]);
  const [completedTasksList, setCompletedTasksList] = useState([]);
  const [currentTaskLoading, toggleCurrentTaskLoading] = useState([]);

  const handleToggleCompletion = (todoId, status, password) => {
    toggleCurrentTaskLoading([...currentTaskLoading, todoId]);
    todosService
      .updateTask({ status, todoId, password })
      .then((todo) => {
        setAllTasks({
          ...allTasksState,
          tasks: allTasksState.tasks.map((task) =>
            task.id === todoId ? todo : task
          ),
        });

        toggleCurrentTaskLoading(
          currentTaskLoading.filter((t) => t.id !== todoId)
        );
      })
      .catch((error) => {
        console.log(error);

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
      .then((tasks) =>
        setAllTasks({
          error: "",
          tasks,
          loading: false,
        })
      )
      .catch((error) => {
        setAllTasks({
          error: error.message,
          tasks: [],
          loading: false,
        });
      });
  }, []);

  return (
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
            console.log(task);
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
  );
}

export default App;

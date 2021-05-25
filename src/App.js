import React, { useState, useEffect } from "react";
import {
  Tile,
  TextInput,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "carbon-components-react";
import { useToasts } from "react-toast-notifications";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import * as todosService from "./services/todos";
import TaskList from "./components/TaskList";
import Task from "./components/Task";
import AddNewTask from "./components/AddNewTask";
import FillTasks from "./components/FillTasks";

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
  const [currentTaskLoading, toggleCurrentTaskLoading] = useState(0);

  const [openModal, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [returnTaskId, setReturnTaskId] = useState(0);

  const { addToast } = useToasts();

  const handleToggleReturn = (todoId) => {
    setReturnTaskId(todoId);
    setModalOpen(true);
  };

  useEffect(() => {
    const pendingTask = completedTasksList.find(
      (task) => task.status === PENDING_TASK_STATUS
    );

    if (pendingTask && returnTaskId.id !== returnTaskId) {
      handleToggleCompletion(pendingTask.id, COMPLETED_TASK_STATUS);
    }
  }, [completedTasksList]);

  useEffect(() => {
    const completedTask = pendingTasksList.find(
      (task) => task.status === COMPLETED_TASK_STATUS
    );

    if (completedTask) {
      handleToggleReturn(completedTask.id);
    }
  }, [pendingTasksList]);

  const handleToggleCompletion = (todoId, status, password) => {
    toggleCurrentTaskLoading(todoId);
    setError("");
    todosService
      .updateTask({ status, todoId, password })
      .then((res) => {
        const todo = res.data;

        toggleCurrentTaskLoading(0);

        if (status === COMPLETED_TASK_STATUS) {
          setCompletedTasksList([
            todo,
            ...completedTasksList.filter((t) => t.status > 0),
          ]);
          setPendingTasksList(
            pendingTasksList.filter((task) => task.id !== todo.id)
          );
          addToast("Tarefa Concluída 🚀", { appearance: "success" });
        }
        if (status === PENDING_TASK_STATUS) {
          setPendingTasksList([
            todo,
            ...pendingTasksList.filter((t) => t.status === 0),
          ]);
          setCompletedTasksList(
            completedTasksList.filter((task) => task.id !== todo.id)
          );
          setModalOpen(false);
          setPassword("");
          setReturnTaskId(0);
          addToast("Tarefa Retornada 💣", { appearance: "info" });
        }
      })
      .catch((error) => {
        const todo = allTasksState.tasks.find((t) => t.id === todoId);
        setError(error.response.data.message);
        if (status === PENDING_TASK_STATUS && todo) {
          setCompletedTasksList([
            todo,
            ...completedTasksList.filter((t) => t.status > 0),
          ]);
          setPendingTasksList(
            pendingTasksList.filter((task) => task.id !== todo.id)
          );
          setModalOpen(false);
          setPassword("");
          setReturnTaskId(0);
        }
        toggleCurrentTaskLoading(0);
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

  const columns = {
    completedTasksList: {
      set: setCompletedTasksList,
      list: completedTasksList,
    },
    pendingTasksList: { set: setPendingTasksList, list: pendingTasksList },
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId].list;
      const destColumn = columns[destination.droppableId].list;
      const sourceItems = [...sourceColumn];
      const destItems = [...destColumn];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      columns[source.droppableId].set([...sourceItems]);
      columns[destination.droppableId].set([...destItems]);
    } else {
      const column = columns[source.droppableId].list;
      const copiedItems = [...column];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      columns[source.droppableId].set([...copiedItems]);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <ComposedModal
          open={openModal}
          size="lg"
          onClose={() => setModalOpen(false)}
        >
          <ModalHeader>Autorização</ModalHeader>
          <ModalBody hasForm>
            <TextInput
              data-modal-primary-focus
              value={password}
              id={`pass-input`}
              labelText="Chave de supervisor"
              placeholder="Chave de supervisor"
              onChange={(e) => setPassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              kind="primary"
              onClick={() => {
                handleToggleCompletion(
                  returnTaskId,
                  PENDING_TASK_STATUS,
                  password
                );
                setModalOpen(false);
              }}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ComposedModal>
        <div
          style={{
            height: "80%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Tile
            style={{ height: "10%", fontSize: "25px", textAlign: "center" }}
          >
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
            <Droppable droppableId="pendingTasksList" key="pendingTasksList">
              {(provided, snapshot) => {
                return (
                  <div
                    id="pendingTasksList"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      height: "640px",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <TaskList
                      title={`Tarefas Pendentes 📋 - #${pendingTasksList.length}`}
                      loading={allTasksState.loading}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgrey",
                      }}
                    >
                      {pendingTasksList.map((task, index) => {
                        return (
                          <Draggable
                            key={`drag-pend-${task.id}`}
                            draggableId={`${task.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  key={`div-pend-${task.id}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Task
                                    {...task}
                                    handleToggleCompletion={
                                      handleToggleCompletion
                                    }
                                    handleToggleReturn={handleToggleReturn}
                                    loading={currentTaskLoading}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      ...provided.draggableProps.style,
                                    }}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    </TaskList>
                  </div>
                );
              }}
            </Droppable>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <AddNewTask
                setPendingTasksList={setPendingTasksList}
                pendingTasksList={pendingTasksList}
              />
              <FillTasks
                setPendingTasksList={setPendingTasksList}
                pendingTasksList={pendingTasksList}
              />
            </div>
            <Droppable
              droppableId="completedTasksList"
              key="completedTasksList"
            >
              {(provided, snapshot) => {
                return (
                  <div
                    id="completedTasksList"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      height: "640px",
                      display: "flex",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <TaskList
                      title={`Tarefas Completas ✅ - #${completedTasksList.length}`}
                      loading={allTasksState.loading}
                      style={{
                        background: snapshot.isDraggingOver
                          ? "lightblue"
                          : "lightgrey",
                      }}
                    >
                      {completedTasksList.map((task, index) => {
                        return (
                          <Draggable
                            key={`drag-comp-${task.id}`}
                            draggableId={`${task.id}`}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  key={`div-comp-${task.id}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Task
                                    {...task}
                                    handleToggleCompletion={
                                      handleToggleCompletion
                                    }
                                    handleToggleReturn={handleToggleReturn}
                                    loading={currentTaskLoading}
                                    style={{
                                      userSelect: "none",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      ...provided.draggableProps.style,
                                    }}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    </TaskList>
                  </div>
                );
              }}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { ComposedModal, Button } from "carbon-components-react";
import * as todosService from "../services/todos";
import { useToasts } from "react-toast-notifications";
import LottiePlayer from "./LottiePlayer";
import { taskCreator } from "../lotties/taskCreator";

export default function FillTasks({ setPendingTasksList, pendingTasksList }) {
  const [openModal, setModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToasts();

  const handleFillTasks = () => {
    setLoader(true);
    setError("");
    todosService
      .fillTasks()
      .then(({ data }) => {
        setModalOpen(false);
        setLoader(false);
        setPendingTasksList([...pendingTasksList, ...data]);
        addToast("Grupo de Tarefas Adicionado 💰", { appearance: "success" });
      })
      .catch((error) => {
        setLoader(false);
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (openModal) handleFillTasks();
  }, [openModal]);

  return (
    <>
      <Button
        style={{ height: "40px", margin: "auto 0px" }}
        kind="primary"
        onClick={() => setModalOpen(true)}
      >
        Estou Sem Tarefas
      </Button>

      <ComposedModal
        open={openModal}
        size="sm"
        onClose={() => setModalOpen(false)}
        style={{
          fontSize: "1.3em",
        }}
      >
        <LottiePlayer
          boxSize={{ height: "50%", width: "50%" }}
          animationData={taskCreator}
        />
        <p
          style={{
            fontSize: "1.3em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "1em",
          }}
        >
          Adicionando grupo de tarefas para passar o tempo
        </p>
      </ComposedModal>
    </>
  );
}

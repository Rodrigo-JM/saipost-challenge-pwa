import React, { useEffect, useState } from "react";
import {
  Tile,
  Checkbox,
  Modal,
  TextInput,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  InlineLoading,
} from "carbon-components-react";
import * as todosService from "../services/todos";
import { useToasts } from "react-toast-notifications";
import LottiePlayer from "./LottiePlayer";
import { taskCreator } from "../lotties/taskCreator";

export default function FillTasks({ setPendingTasksList, pendingTasksList }) {
  const [openModal, setModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToasts();

  const handleFillTasks = (data) => {
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
        {loader ? (
          <LottiePlayer
            boxSize={{ height: "50%", width: "50%" }}
            animationData={taskCreator}
          />
        ) : (
          <div style={{ height: "100%", width: "100%" }}>
            <ModalHeader>Criar Grupo de Tarefas</ModalHeader>
            <ModalBody>
              <p style={{ marginBottom: "1rem" }}>
                Adicione 3 novas tarefas pendentes para passar o tempo
              </p>
            </ModalBody>
            <ModalFooter>
              {!loader && (
                <Button kind="primary" onClick={() => handleFillTasks()}>
                  Confirmar
                </Button>
              )}
            </ModalFooter>
          </div>
        )}
      </ComposedModal>
    </>
  );
}

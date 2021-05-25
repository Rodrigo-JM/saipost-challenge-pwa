import React, { useEffect, useState } from "react";
import {
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

export default function AddNewTask({ setPendingTasksList, pendingTasksList }) {
  const [openModal, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToasts();

  const handleAddNewTask = (data) => {
    setLoader(true);
    setError("");
    todosService
      .createTask(data)
      .then(({ data }) => {
        setModalOpen(false);
        setLoader(false);
        setPendingTasksList([...pendingTasksList, data]);
        addToast("Tarefa Adicionada 💰", { appearance: "success" });
      })
      .catch((error) => {
        setLoader(false);
        setError(error.response.data.message);
      });
  };

  useEffect(() => {
    if (!openModal) {
      setName("");
      setEmail("");
      setDescription("");
    }
  }, [openModal]);

  return (
    <>
      <Button
        style={{ height: "40px", margin: "auto 0px" }}
        kind="primary"
        onClick={() => setModalOpen(true)}
      >
        Adicionar Tarefa
      </Button>

      <ComposedModal
        open={openModal}
        size="lg"
        onClose={() => setModalOpen(false)}
        style={{ fontSize: "1.3em" }}
      >
        <ModalHeader>Criar Nova Tarefa</ModalHeader>
        <ModalBody hasForm>
          <TextInput
            data-modal-primary-focus
            value={name}
            id={`new-task-name`}
            labelText="Nome de Reponsável"
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "1em" }}
          />
          <TextInput
            value={email}
            id={`new-task-email`}
            labelText="Email de Reponsável"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: "1em" }}
          />
          <TextInput
            value={description}
            id={`new-task-description`}
            labelText="Descrição da Tarefa"
            placeholder="Descrição"
            onChange={(e) => setDescription(e.target.value)}
            style={{ margin: "1em" }}
          />
        </ModalBody>
        <ModalFooter>
          {loader && <InlineLoading description="Loading..." />}
          {!!error && (
            <p style={{ color: "red", margin: "auto" }}>⛔️ {error}</p>
          )}
          <Button
            kind="primary"
            onClick={() =>
              handleAddNewTask({ name, email, description, defaultAdmin: true })
            }
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ComposedModal>
    </>
  );
}

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
import { PENDING_TASK_STATUS, COMPLETED_TASK_STATUS } from "../App";

export default function Task({
  id,
  name,
  description,
  statusHandler,
  index,
  email,
  status,
  handleToggleCompletion,
  loading,
}) {
  const [openModal, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const isLoading = loading == id;

  useEffect(() => {
    if (openModal === false) setPassword("");
  }, [openModal]);

  const handleSubmitReturn = (password) => {
    handleToggleCompletion(id, PENDING_TASK_STATUS, password);
    setModalOpen(false);
  };

  return (
    <>
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
            id={`pass-${id}`}
            labelText="Chave de supervisor"
            placeholder="Chave de supervisor"
            onChange={(e) => setPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button kind="primary" onClick={() => handleSubmitReturn(password)}>
            Confirmar
          </Button>
        </ModalFooter>
      </ComposedModal>
      {/* <Modal
        
      >
        <TextInput
          
        />
      </Modal> */}
      <Tile style={{ width: "100%", margin: "1px" }}>
        <p
          style={{
            fontSize: "21px",
            height: "30px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>
        <fieldset className="bx--fieldset">
          <legend className="bx--label">Status</legend>
          {isLoading ? (
            <InlineLoading description="Loading..." />
          ) : (
            <Checkbox
              labelText="Completed"
              disabled={loading !== 0}
              checked={!!status}
              onClick={() =>
                status === COMPLETED_TASK_STATUS
                  ? setModalOpen(true)
                  : handleToggleCompletion(id, COMPLETED_TASK_STATUS)
              }
              id={`checkbox-${id}`}
            />
          )}
        </fieldset>
      </Tile>
    </>
  );
}

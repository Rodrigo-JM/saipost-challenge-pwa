import React from "react";
import { Tile, Checkbox, InlineLoading } from "carbon-components-react";
import { COMPLETED_TASK_STATUS } from "../App";

function Task({
  id,
  name,
  description,
  email,
  status,
  handleToggleCompletion,
  handleToggleReturn,
  loading,
}) {
  const isLoading = loading == id;

  return (
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
                ? handleToggleReturn(id)
                : handleToggleCompletion(id, COMPLETED_TASK_STATUS)
            }
            id={`checkbox-${id}`}
          />
        )}
        <p
          style={{
            fontSize: "0.8em",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            fontStyle: "italic",
          }}
        >
          Res: {name} - E-mail: {email}
        </p>
      </fieldset>
    </Tile>
  );
}

export default Task;

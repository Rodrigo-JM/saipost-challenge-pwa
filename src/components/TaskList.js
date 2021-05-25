import React from "react";
import { Tile } from "carbon-components-react";

export default function TaskList({ children, title }) {
  return (
    <Tile
      style={{
        marginTop: "2em",
        width: "325px",
        padding: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "0.5px",
        border: "1px dotted #f3f3f3",
        borderRadius: "5px 5px 0 0;",
      }}
    >
      <p
        style={{
          height: "10%",
          fontSize: "25px",
          padding: "15px",
          borderBottom: "1px dotted #f3f3f3",
        }}
      >
        {title}
      </p>
      <Tile
        style={{
          backgroundColor: "#f3f3f3",
          width: "100%",
          height: "90%",
          overflowY: "scroll",
          padding: "0px 0.5px",
        }}
      >
        {children}
      </Tile>
    </Tile>
  );
}

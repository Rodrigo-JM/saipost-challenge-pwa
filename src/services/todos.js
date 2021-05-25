import { caller } from "./index";

export const getAllTasks = async () => {
  const { data } = await caller.get("/todos");
  return data;
};

export const createTask = async (body) => {
  const { data } = await caller.post("/todos", body);
  return data;
};

export const updateTask = async (body) => {
  const { data } = await caller.put("/todos", body);
  return data;
};

export const fillTasks = async () => {
  const { data } = await caller.post("/todos/fill-empty-tasks");
  return data;
};

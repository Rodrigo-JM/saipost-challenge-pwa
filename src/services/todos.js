import { caller } from "./index";

export const getAllTasks = async () => {
  return await caller.get("/todos");
};

export const createTask = async (body) => {
  return await caller.post("/todos", body);
};

export const updateTask = async (body) => {
  return await caller.put("/todos", body);
};

export const fillTasks = async () => {
  return await caller.post("/todos/fill-empty-tasks");
};

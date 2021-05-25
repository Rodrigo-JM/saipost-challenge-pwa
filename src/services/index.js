import axios from "axios";

export const caller = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

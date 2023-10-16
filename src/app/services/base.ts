import axios from "axios";

export const apiService = axios.create({
  baseURL: "/api",
});

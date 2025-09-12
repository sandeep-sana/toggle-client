import axios from "axios";
import { subDomain } from "./function";

const api = axios.create({
  baseURL: process.env.API,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = token;
      }

      const dbName = subDomain();
      if (dbName) {
        config.headers["dbName"] = dbName;
      } else {
        delete config.headers["dbName"];
      }
      const _id = localStorage.getItem('_id');
      if(_id){
        config.headers["_id"] = _id;
      }else{
        delete config.headers["_id"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

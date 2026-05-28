import axios from "axios";
import { getHeaders } from "../Api/api.service";

// we need to pass the baseURL as an object
const Axiosinstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  headers:getHeaders(),
  validateStatus:(status)=>{
    return status>=200 && status<=400;
  }
});

export default Axiosinstance;
import axios from "axios";
import { Baseurl } from "../confige";

export const axiosInstance = axios.create({
      baseURL: Baseurl,
      withCredentials: true,
});

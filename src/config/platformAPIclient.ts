import axios from "axios";
import { env } from "../utils/env";

const platformAPIClient = axios.create({
  baseURL: env.PLATFORM_API_URL,
  timeout: 20000,
  headers: { 'Authorization': `Key ${process.env.pi_api_key}` }
});

export default platformAPIClient;


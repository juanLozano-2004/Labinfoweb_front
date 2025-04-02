import axios from "axios";
import  {API_BASE_URL}  from "./globals";

export async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, { username, password });
    console.log("Response data:", response.data); 
    return response.data; 
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth";

export async function login(username: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
}

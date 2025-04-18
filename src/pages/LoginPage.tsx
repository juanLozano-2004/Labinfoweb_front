import React, { useState, useContext } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/LoginPage.css";
import loginImage from "../assets/login-image.jpg";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
    const authContext = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    if (!authContext) return null; 

    const { login } = authContext;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await login(username, password);
            navigate("/home");
          } catch (error) {
            console.error("Error en login:", error);
          }
    }

    return (
        <div className="login-container">
            <div className="left-side">
                <img src={loginImage} alt="Login" />
            </div>
            <div className="right-side">
                <div className="login-form">
                    <h2>Iniciar sesión</h2>
                    <form onSubmit={handleSubmit}>
                    <input type="username" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button>Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
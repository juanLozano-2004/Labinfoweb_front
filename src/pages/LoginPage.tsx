import React, { use, useState } from "react";
import "../styles/LoginPage.css";
import loginImage from "../assets/login-image.jpg";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setToken } = useAuth();

    const handleLoginButton = async () => {
        try {
            const req = JSON.stringify({
                username: username,
                password: password
            })
            const response = await fetch("http://localhost:8080/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
        
                body: req
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            console.log("Login successful:", data);
            // Manejar la respuesta aquí si es necesario
            setToken(data.token);
            window.location.href = "/home";
        } catch (error) {
            const errorr = (error as any)
            console.error("Error al iniciar sesión:", error);
            alert(`Error al iniciar sesión: ${errorr.message}`);
        }
    };

    return (
        <div className="login-container">
            <div className="left-side">
                <img src={loginImage} alt="Login" />
            </div>
            <div className="right-side">
                <div className="login-form">
                    <h2>Iniciar sesión</h2>
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button onClick={handleLoginButton}>Entrar</button>
                </div>
            </div>
        </div>
    );
}
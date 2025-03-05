import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleSignIn = () => {
        // Simulación de autenticación
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <button onClick={handleSignIn}>Sign in</button>
        </div>
    );
};

export default Login;
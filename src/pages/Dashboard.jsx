import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <div className="navbar">
                <img src="/logo.png" alt="Logo" className="logo" />
                <button onClick={() => alert("Cerrar sesión")}>Sign out</button>
            </div>

            {/* Menú lateral */}
            <div className="sidebar">
                <h3>Menu</h3>
                <button>Inicio</button>
                <button>Gestión de laboratorios</button>
                <button>Laboratorios</button>
                <button>Ver mis reservas</button>
            </div>

            {/* Contenido */}
            <div className="content">
                <img src="/imagen-dashboard.png" alt="Dashboard" />
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2025 Universidad XYZ</p>
            </footer>
        </div>
    );
};

export default Dashboard;

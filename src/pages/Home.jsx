import { Link } from 'react-router-dom';
import "./Home.css"; // Importa el CSS

function Home({ setIsAuthenticated }) {
return (
    <div className="home-container">
      {/* Navbar */}
    <nav className="navbar">
    <img src="images/Logo.png" alt="University Logo" />
        <div className="navbar-links">
        <Link to="/laboratorios">Laboratorios</Link>
        <Link to="/">Inicio</Link>
        <button onClick={() => setIsAuthenticated(true)}>Sign In</button>
        </div>
    </nav>
      {/* Contenido Principal */}
    <div className="home-content">
        <h1>Lab Info Web</h1>
        <p>Laboratorios de sistemas disponibles al alcance de un solo boton</p>
        <img src="images/labUno.jpg" alt="Lab" className="home-image" />
    </div>
      {/* Footer */}
    <footer className="footer">
        <div>
        <h3>Ofertas académicas</h3>
        <ul>
            <li>Carreras profesionales</li>
            <li>Especializaciones</li>
            <li>Maestrías</li>
            <li>Doctorados</li>
        </ul>
        </div>
        <div>
        <h3>Resources</h3>
        <ul>
            <li>Blog</li>
            <li>Best practices</li>
            <li>Developers</li>
        </ul>
        </div>
    </footer>
    </div>
    );
}
export default Home;
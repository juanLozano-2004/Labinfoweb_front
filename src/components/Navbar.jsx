import { Link } from "react-router-dom";

function Navbar() {
return (
    <nav>
    <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><link to="laboratorios">Laboratorios</link></li>
    </ul>
    </nav>
);
}

export default Navbar;

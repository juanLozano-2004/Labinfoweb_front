import { Link } from 'react-router-dom';
import "./Laboratorios.css"; // Importa el CSS

function Laboratorios() {
    const laboratorios = [
        { 
            id: 1, 
            nombre: "Laboratorio de Bases", 
            descripcion: "Equipado con el equipo para poder trabajar con bases de datos",
            imagen: "images/c1.jpg"
        },
        { 
            id: 2, 
            nombre: "Laboratorio de Computación", 
            descripcion: "Cuenta con computadoras de alto rendimiento para programación, simulaciones y análisis de datos.",
            imagen: "images/c2.jpg"
        },
        { 
            id: 3, 
            nombre: "Laboratorio de Redes", 
            descripcion: "Diseñado para realizar redes entre computadores",
            imagen: "images/c3.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="navbar bg-white shadow-md p-4 flex justify-between items-center">
                <img src="/images/Logo.png" alt="University Logo" className="h-12" />
                <div className="navbar-links flex gap-4">
                    <Link to="/laboratorios" className="text-gray-700 hover:text-blue-500">Laboratorios</Link>
                    <Link to="/" className="text-gray-700 hover:text-blue-500">Inicio</Link>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded-md">Sign In</button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <h1 className="text-3xl font-bold text-center my-6">Laboratorios Disponibles</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {laboratorios.map(lab => (
                    <div key={lab.id} className="bg-white shadow-md rounded-lg p-4">
                        <img src={lab.imagen} alt={lab.nombre} className="w-full h-40 object-cover rounded-md mb-4" />
                        <h2 className="text-xl font-semibold">{lab.nombre}</h2>
                        <p className="text-gray-600">{lab.descripcion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Laboratorios;

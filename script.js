document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showRegister = document.getElementById("show-register");
    const showLogin = document.getElementById("show-login");
    const loginContainer = document.querySelector(".login-container");
    const registerContainer = document.querySelector(".register-container");

    // Alternar entre formularios de registro y login
    showRegister.addEventListener("click", function() {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    });

    showLogin.addEventListener("click", function() {
        registerContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Registrar nuevo usuario
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const newUsername = document.getElementById("new-username").value;
        const newPassword = document.getElementById("new-password").value;

        if (localStorage.getItem(newUsername)) {
            alert("El usuario ya existe. Prueba con otro nombre.");
        } else {
            localStorage.setItem(newUsername, newPassword);
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            registerContainer.style.display = "none";
            loginContainer.style.display = "block";
        }
    });

    // Iniciar sesión
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        
        const storedPassword = localStorage.getItem(username);

        if (storedPassword && storedPassword === password) {
            alert("Inicio de sesión exitoso.");
            localStorage.setItem("loggedInUser", username);
            window.location.href = "Home.html"; // Redirige a Home
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    });

    // Verificar si el usuario tiene acceso a Home.html
    if (window.location.pathname.includes("Home.html")) {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (!loggedInUser) {
            alert("Acceso denegado. Debes iniciar sesión.");
            window.location.href = "Login.html"; 
        }
    }
});
/*Estilos para el Home------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario está logueado en páginas protegidas
    const protectedPages = ["Home.html", "Laboratory2.html"]; // Agrega más páginas si es necesario
    const currentPage = window.location.pathname.split("/").pop();

    if (protectedPages.includes(currentPage) && !localStorage.getItem("loggedInUser")) {
        alert("No tienes sesión iniciada. Serás redirigido al inicio.");
        window.location.href = "index.html";
    }

    // Evento para cerrar sesión
    const signOutButton = document.querySelector(".nav-link[href='signout.html']");
    if (signOutButton) {
        signOutButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("loggedInUser");

            // Borra el historial para evitar que el usuario regrese a la sesión cerrada
            window.location.replace("index.html");
        });
    }
});
/*Elementos para gestion de laboratorios ----------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
    const botonReservas = document.getElementById("btnReservas");
    const selectLaboratorios = document.getElementById("laboratorioSelect"); // Selección de laboratorio
    const calendario = document.getElementById("calendario");

    // Evento para mostrar el calendario solo si se ha seleccionado un laboratorio
    botonReservas.addEventListener("click", function () {
        if (selectLaboratorios.value === "--Selecciona--") {
            alert("Debe seleccionar un laboratorio (Reco, Bases o Sistemas)");
            return;
        }
        // Mostrar la tabla de calendario
        calendario.style.display = "block";
    });

    // Evento para los botones de reserva en el calendario
    document.querySelectorAll(".calendario button").forEach(button => {
        button.addEventListener("click", function () {
            // Verificar si el usuario aún tiene "--Selecciona--" en el dropdown
            if (selectLaboratorios.value === "--Selecciona--") {
                alert("Debe seleccionar un laboratorio  antes de reservar.");
                return;
            }

            if (this.classList.contains("no-disponible")) {
                alert("Este día no está disponible para reservas.");
            } else {
                window.location.href = "Formulario.html";
            }
        });
    });
});
/*Para el Formulario ----------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    const laboratorioSelect = document.getElementById("laboratorioSelect");
    const btnReservas = document.getElementById("btnReservas");
    const laboratorioInput = document.getElementById("laboratorio");
    const horaInicioSelect = document.getElementById("horaInicio");
    const horaFinSelect = document.getElementById("horaFin");
    const reservaForm = document.getElementById("reservaForm");
    const mensaje = document.getElementById("mensaje");

    // Guardar laboratorio seleccionado en localStorage
    if (btnReservas) {
        btnReservas.addEventListener("click", () => {
            const seleccionado = laboratorioSelect.value;
            if (seleccionado !== "--Selecciona--") {
                localStorage.setItem("laboratorioSeleccionado", seleccionado);
                alert(`Laboratorio seleccionado: ${seleccionado}`);
            } else {
                alert("Por favor, selecciona un laboratorio.");
            }
        });
    }

    // Obtener el laboratorio seleccionado en el formulario
    if (laboratorioInput) {
        const laboratorioGuardado = localStorage.getItem("laboratorioSeleccionado") || "No seleccionado";
        laboratorioInput.value = laboratorioGuardado;
    }

    // Opciones de horarios (7:00 AM - 7:00 PM en intervalos de 1.5 horas)
    const horas = ["07:00", "08:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

    if (horaInicioSelect && horaFinSelect) {
        horas.forEach((hora) => {
            let optionInicio = document.createElement("option");
            let optionFin = document.createElement("option");
            optionInicio.value = optionFin.value = hora;
            optionInicio.textContent = optionFin.textContent = hora;
            horaInicioSelect.appendChild(optionInicio);
            horaFinSelect.appendChild(optionFin);
        });
    }

    // Validación y guardado de reserva
    if (reservaForm) {
        reservaForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const horaInicio = horaInicioSelect.value;
            const horaFin = horaFinSelect.value;
            const equipos = document.getElementById("equipos").value;
            const laboratorioSeleccionado = localStorage.getItem("laboratorioSeleccionado") || "No seleccionado";

            if (horaInicio >= horaFin) {
                mensaje.textContent = "La hora de inicio debe ser menor que la hora de fin.";
                mensaje.style.color = "red";
                return;
            }

            // Obtener reservas existentes
            let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

            // Verificar que no haya conflictos de horario
            const conflicto = reservas.some(reserva => 
                reserva.laboratorio === laboratorioSeleccionado &&
                ((horaInicio >= reserva.horaInicio && horaInicio < reserva.horaFin) || 
                (horaFin > reserva.horaInicio && horaFin <= reserva.horaFin))
            );

            if (conflicto) {
                mensaje.textContent = "Ya hay una reserva en ese horario.";
                mensaje.style.color = "red";
                return;
            }

            // Guardar la reserva
            const nuevaReserva = {
                laboratorio: laboratorioSeleccionado,
                horaInicio,
                horaFin,
                equipos,
            };

            reservas.push(nuevaReserva);
            localStorage.setItem("reservas", JSON.stringify(reservas));

            mensaje.textContent = "Reserva confirmada con éxito.";
            mensaje.style.color = "green";
        });
    }
});
/*Parte de cancelar reservas --------------------------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const tablaReservas = document.getElementById("tablaReservas").getElementsByTagName('tbody')[0];

    // Obtener las reservas del localStorage
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    // Si hay reservas, cargarlas en la tabla
    if (reservas.length > 0) {
        reservas.forEach((reserva, index) => {
            const row = tablaReservas.insertRow();

            // Número de reserva
            const cellNumero = row.insertCell(0);
            cellNumero.textContent = index + 1;

            // Laboratorio
            const cellLaboratorio = row.insertCell(1);
            cellLaboratorio.textContent = reserva.laboratorio;

            // Día de la reserva
            const cellDia = row.insertCell(2);
            const fecha = new Date(reserva.horaInicio); // Convertir la hora de inicio en fecha
            const opcionesDia = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Formato de día completo
            cellDia.textContent = fecha.toLocaleDateString('es-ES', opcionesDia);

            // Hora de la reserva
            const cellHora = row.insertCell(3);
            cellHora.textContent = `${reserva.horaInicio} - ${reserva.horaFin}`;

            // Estado (verificar si está en proceso o activo)
            const cellEstado = row.insertCell(4);
            const estado = verificarEstado(reserva.horaInicio, reserva.horaFin);
            cellEstado.textContent = estado;

            // Botón de cancelar
            const cellCancelar = row.insertCell(5);
            const botonCancelar = document.createElement("button");
            botonCancelar.textContent = "Cancelar";
            botonCancelar.classList.add("btn-cancelar");
            botonCancelar.addEventListener("click", () => cancelarReserva(index));
            cellCancelar.appendChild(botonCancelar);
        });
    } else {
        const row = tablaReservas.insertRow();
        const cellMensaje = row.insertCell(0);
        cellMensaje.colSpan = 6;
        cellMensaje.textContent = "No tienes reservas registradas.";
        cellMensaje.style.textAlign = "center";
    }
});

// Función para cancelar la reserva
function cancelarReserva(indice) {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.splice(indice, 1); // Elimina la reserva del array
    localStorage.setItem("reservas", JSON.stringify(reservas)); // Guarda los cambios en localStorage

    // Recargar la página para reflejar los cambios en la tabla
    location.reload();
}

// Función para verificar el estado de la reserva (Activa o En Proceso)
function verificarEstado(horaInicio, horaFin) {
    const ahora = new Date();
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);

    // Si la hora actual está entre la hora de inicio y la hora de fin, la reserva está activa
    if (ahora >= inicio && ahora <= fin) {
        return "Activa";
    } else if (ahora > fin) {
        // Si la hora actual ya pasó la hora de fin, la reserva está en proceso
        return "En Proceso";
    } else {
        return "Pendiente";
    }
}

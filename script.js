class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria, imagen) {
        this._id = id;
        this._nombre = nombre;
        this._fecha = fecha;
        this._ubicacion = ubicacion;
        this._categoria = categoria;
        this._imagen = imagen;
    }

    getId() { return this._id; }
    getNombre() { return this._nombre; }
    getFecha() { return this._fecha; }
    getUbicacion() { return this._ubicacion; }
    getCategoria() { return this._categoria; }
    getImagen() { return this._imagen; }
}

class EventoPago extends Evento {
    constructor(id, nombre, fecha, ubicacion, categoria, precio, imagen) {
        super(id, nombre, fecha, ubicacion, categoria, imagen);
        this._precio = precio;
    }

    getPrecioTexto() { return "Entrada: S/ " + this._precio; }
}

const eventos = [
    new EventoPago(1, "Michael Jackson", "2026-11-15", "Estadio Nacional, Lima", "Concierto", 1500, "https://imgs.search.brave.com/KgTUzeqLZjcbJ7WeIlBEoWDfQCky95zB3DgMeEKbgvY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wYWxv/bWF5bmFjaG8uY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI2/LzA0L01pY2hhZWwt/SmFja3Nvbi1XZW1i/bGV5LmpwZw"),
    new EventoPago(2, "Trueno", "2026-11-22", "Costa 21, Lima", "Concierto", 250, "https://imgs.search.brave.com/ulUIZreIRaQOKiNMjpvHdPSUP0eKif9X8dHls9ntf9s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YnVlbnBsYW4uY29t/LmVjL3BpY3R1cmVz/Lzc0ZDBlZjFmLTNi/YmEtNGIyNy1iMzY0/LTRjNWE4ODFkOGU1/OC5qcGVn"),
    new EventoPago(3, "Saramalacara", "2026-12-05", "Concierto, Lima", "Concierto", 184, "https://imgs.search.brave.com/iXWpike3g8rkvLnyRXaoHT_mU1t4kGO6EjITZRhqoOU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZXRs/aXN0LmNsL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDI1LzEwL1Nh/cmFtYWxhY2FyYS1l/bi1UZWF0cm8tQ29s/aXNlby0lQzIlQTkt/Q2hlY2hvLUdhcmNp/YS1QYXJkby1AY2hl/Y2hvZm90b2dyYWZv/LTE5MTAyMDI1LV9D/RzcyNzExLmpwZw"),
    new EventoPago(5, "Justin Bieber", "2026-11-28", "Parque de la Exposición, Lima", "Concierto", 550, "https://imgs.search.brave.com/Nhffue0KNcOFNVnJVe9Ma5gA-dT17Gioefcw_msrynE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9mLnJh/ZGlvLWdycHAuaW8v/MjAyMi8xMS8xOC8x/OTM5MTlfMTM0Njk4/Ny5qcGc_aW1nZGlt/ZW5zaW9uPWxvb2s"),
    new EventoPago(6, "Rojuu", "2026-12-18", "Centro Cultural PUCP, Lima", "Concierto", 150, "https://imgs.search.brave.com/mA9VgwNZNDMm_QZSkjImSzr1RcRQfX_wS5GfVmC8vyc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmlzaXR2YWxlbmNp/YS5jb20vc2l0ZXMv/ZGVmYXVsdC9maWxl/cy9zdHlsZXMvZnVs/bF93aWR0aF9nYWxs/ZXJ5X2Rlc2t0b3Av/cHVibGljL21lZGlh/L21lZGlhLWltYWdl/cy9pbWFnZXMvQ2Fw/dHVyYSUyMGRlJTIw/cGFudGFsbGElMjAy/MDI1LTA3LTMwJTIw/YSUyMGxhcyUyMDgu/MjkuMTMuanBnP2l0/b2s9Q3owZ1JxMXE")
];

const listaEventos = document.getElementById("listaEventos");
const listaInscripciones = document.getElementById("listaInscripciones");
const filtroArtista = document.getElementById("filtroArtista");
const buscador = document.querySelector(".buscador");
const campoBuscar = document.getElementById("campoBuscar");
const botonMenu = document.getElementById("botonMenu");
const menuPrincipal = document.getElementById("menuPrincipal");
const mensajeEventos = document.getElementById("mensajeEventos");
const mensajeInscripciones = document.getElementById("mensajeInscripciones");
const avisoExito = document.getElementById("avisoExito");
const enlaceLogin = document.getElementById("enlaceLogin");
const seccionLogin = document.getElementById("iniciar-sesion");
const formInicioSesion = document.getElementById("formInicioSesion");
const mensajeLogin = document.getElementById("mensajeLogin");
const formContacto = document.getElementById("formContacto");

let sesionUsuario = JSON.parse(localStorage.getItem("eventraSesion") || "null");
let misInscripciones = JSON.parse(localStorage.getItem("eventraInscripciones") || "[]");
let slideActual = 0;

function guardarDatos() {
    localStorage.setItem("eventraInscripciones", JSON.stringify(misInscripciones));
    if (sesionUsuario) {
        localStorage.setItem("eventraSesion", JSON.stringify(sesionUsuario));
    } else {
        localStorage.removeItem("eventraSesion");
    }
}

function correoValido(correo) {
    return correo.includes("@") && correo.includes(".");
}

function formatearFecha(fechaISO) {
    var fecha = new Date(fechaISO + "T12:00:00");
    return fecha.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
}

function buscarEventoPorId(id) {
    for (var i = 0; i < eventos.length; i++) {
        if (eventos[i].getId() === id) {
            return eventos[i];
        }
    }
    return null;
}

function yaEstaInscrito(idEvento) {
    if (!sesionUsuario) return false;
    for (var i = 0; i < misInscripciones.length; i++) {
        if (misInscripciones[i].eventoId === idEvento && misInscripciones[i].correo === sesionUsuario.correo) {
            return true;
        }
    }
    return false;
}

function mostrarAviso(mensaje) {
    avisoExito.textContent = mensaje;
    avisoExito.hidden = false;
    setTimeout(function () {
        avisoExito.hidden = true;
    }, 3000);
}

function actualizarEnlaceSesion() {
    if (sesionUsuario) {
        enlaceLogin.textContent = "Hola, " + sesionUsuario.nombre.split(" ")[0];
        enlaceLogin.dataset.modo = "cerrar";
    } else {
        enlaceLogin.textContent = "Iniciar sesión";
        enlaceLogin.dataset.modo = "login";
    }
}

function crearTarjeta(ev, conCancelar) {
    var comprado = yaEstaInscrito(ev.getId());
    var tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-evento";

    var boton = "";
    if (conCancelar) {
        boton = '<button type="button" class="boton-peligro">Cancelar</button>';
    } else {
        var texto = comprado ? "Comprado" : "Comprar";
        var disabled = comprado ? " disabled" : "";
        boton = '<button type="button" class="boton-principal"' + disabled + '>' + texto + '</button>';
    }

    tarjeta.innerHTML =
        '<img src="' + ev.getImagen() + '" alt="' + ev.getNombre() + '">' +
        '<div class="tarjeta-cuerpo">' +
        '<span class="etiqueta">' + ev.getCategoria() + '</span>' +
        '<h3>' + ev.getNombre() + '</h3>' +
        '<p>' + formatearFecha(ev.getFecha()) + '</p>' +
        '<p>' + ev.getUbicacion() + '</p>' +
        '<p class="precio">' + ev.getPrecioTexto() + '</p>' +
        boton +
        '</div>';

    var botonReal = tarjeta.querySelector("button");
    if (conCancelar) {
        botonReal.onclick = function () { cancelarCompra(ev.getId()); };
    } else {
        botonReal.onclick = function () { comprarEvento(ev.getId()); };
    }

    return tarjeta;
}

function mostrarEventos(lista) {
    listaEventos.innerHTML = "";

    if (lista.length === 0) {
        mensajeEventos.textContent = "No se encontraron eventos.";
        return;
    }
    mensajeEventos.textContent = "";

    for (var i = 0; i < lista.length; i++) {
        listaEventos.appendChild(crearTarjeta(lista[i], false));
    }
}

function filtrarEventos(hacerScroll) {
    var artista = filtroArtista.value;
    var texto = campoBuscar.value.trim().toLowerCase();
    var resultado = [];

    for (var i = 0; i < eventos.length; i++) {
        var ev = eventos[i];
        var okCat = (artista === "todos" || ev.getNombre() === artista);
        var okTxt = (texto === "" || ev.getNombre().toLowerCase().includes(texto));
        if (okCat && okTxt) {
            resultado.push(ev);
        }
    }

    mostrarEventos(resultado);
    if (hacerScroll) {
        document.getElementById("eventos").scrollIntoView({ behavior: "smooth" });
    }
}

function comprarEvento(id) {
    if (!sesionUsuario) {
        seccionLogin.hidden = false;
        mensajeLogin.textContent = "Inicia sesión para comprar.";
        return;
    }

    if (yaEstaInscrito(id)) {
        mostrarAviso("Ya compraste este evento.");
        return;
    }

    var ev = buscarEventoPorId(id);
    if (!ev) return;

    if (!confirm("¿Deseas comprar entrada para \"" + ev.getNombre() + "\"?")) return;

    misInscripciones.push({
        eventoId: id,
        correo: sesionUsuario.correo,
        nombre: sesionUsuario.nombre
    });
    guardarDatos();
    actualizarPagina();
    mostrarAviso("¡Compra realizada!");
}

function mostrarMisEventos() {
    listaInscripciones.innerHTML = "";

    if (!sesionUsuario) {
        mensajeInscripciones.textContent = "Inicia sesión para ver tus conciertos.";
        return;
    }

    var mias = [];
    for (var i = 0; i < misInscripciones.length; i++) {
        if (misInscripciones[i].correo === sesionUsuario.correo) {
            mias.push(misInscripciones[i]);
        }
    }

    if (mias.length === 0) {
        mensajeInscripciones.textContent = "Aún no has comprado ningún evento.";
        return;
    }
    mensajeInscripciones.textContent = "";

    for (var j = 0; j < mias.length; j++) {
        var ev = buscarEventoPorId(mias[j].eventoId);
        if (ev) {
            listaInscripciones.appendChild(crearTarjeta(ev, true));
        }
    }
}

function actualizarPagina() {
    filtrarEventos(false);
    mostrarMisEventos();
}

function cancelarCompra(id) {
    if (!confirm("¿Seguro que deseas cancelar esta compra?")) return;

    var nuevas = [];
    for (var i = 0; i < misInscripciones.length; i++) {
        if (!(misInscripciones[i].eventoId === id && misInscripciones[i].correo === sesionUsuario.correo)) {
            nuevas.push(misInscripciones[i]);
        }
    }
    misInscripciones = nuevas;
    guardarDatos();
    actualizarPagina();
    mostrarAviso("Compra cancelada.");
}

function armarCarrusel() {
    var pista = document.getElementById("carruselPista");
    var puntos = document.getElementById("carruselPuntos");
    if (!pista || !puntos) return;

    pista.innerHTML = "";
    puntos.innerHTML = "";

    for (var i = 0; i < eventos.length; i++) {
        var slide = document.createElement("div");
        slide.className = "carrusel-slide";
        slide.innerHTML = '<img src="' + eventos[i].getImagen() + '" alt="' + eventos[i].getNombre() + '">';
        pista.appendChild(slide);

        var punto = document.createElement("button");
        punto.type = "button";
        punto.className = "carrusel-punto" + (i === 0 ? " activo" : "");
        punto.setAttribute("data-index", i);
        punto.onclick = function () {
            irASlide(Number(this.getAttribute("data-index")));
        };
        puntos.appendChild(punto);
    }

    function irASlide(n) {
        if (n < 0) n = eventos.length - 1;
        if (n >= eventos.length) n = 0;
        slideActual = n;
        pista.style.transform = "translateX(-" + (slideActual * 100) + "%)";

        for (var p = 0; p < puntos.children.length; p++) {
            puntos.children[p].classList.remove("activo");
        }
        puntos.children[slideActual].classList.add("activo");
    }

    setInterval(function () {
        irASlide(slideActual + 1);
    }, 4000);
}

enlaceLogin.addEventListener("click", function (event) {
    event.preventDefault();
    if (enlaceLogin.dataset.modo === "cerrar") {
        sesionUsuario = null;
        guardarDatos();
        actualizarEnlaceSesion();
        seccionLogin.hidden = true;
        actualizarPagina();
        mostrarAviso("Cerraste sesión.");
        return;
    }
    seccionLogin.hidden = false;
    mensajeLogin.textContent = "";
});

document.getElementById("cerrarLogin").addEventListener("click", function () {
    seccionLogin.hidden = true;
});

formInicioSesion.addEventListener("submit", function (event) {
    event.preventDefault();

    var nombre = document.getElementById("nombreLogin").value.trim();
    var correo = document.getElementById("correoLogin").value.trim().toLowerCase();
    var contrasena = document.getElementById("contrasenaLogin").value;

    if (nombre.length < 2) {
        mensajeLogin.textContent = "Escribe tu nombre.";
        return;
    }
    if (!correoValido(correo)) {
        mensajeLogin.textContent = "El correo no es válido.";
        return;
    }
    if (contrasena.length < 6) {
        mensajeLogin.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
    }

    sesionUsuario = { nombre: nombre, correo: correo };
    guardarDatos();
    actualizarEnlaceSesion();
    seccionLogin.hidden = true;
    actualizarPagina();
    mostrarAviso("¡Bienvenido, " + nombre + "!");
});

formContacto.addEventListener("submit", function (event) {
    event.preventDefault();
    formContacto.reset();
    mostrarAviso("Mensaje enviado. Te responderemos pronto.");
});

buscador.addEventListener("submit", function (event) {
    event.preventDefault();
    filtrarEventos(true);
});

campoBuscar.addEventListener("input", function () {
    filtrarEventos(false);
});

filtroArtista.addEventListener("change", function () {
    filtrarEventos(true);
});

botonMenu.addEventListener("click", function () {
    var abierto = menuPrincipal.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
});

if (sesionUsuario) {
    seccionLogin.hidden = true;
}
actualizarEnlaceSesion();
mostrarEventos(eventos);
mostrarMisEventos();
armarCarrusel();

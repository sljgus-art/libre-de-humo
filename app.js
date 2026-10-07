// ======================================
// LIBRE DE HUMO v2
// ======================================

const LOGROS = [
    { dias: 1, nombre: "🌱 Primer día" },
    { dias: 3, nombre: "💪 Tres días" },
    { dias: 7, nombre: "🏅 Una semana" },
    { dias: 30, nombre: "🥉 Un mes" },
    { dias: 90, nombre: "🥈 Tres meses" },
    { dias: 180, nombre: "🥇 Seis meses" },
    { dias: 365, nombre: "💎 Un año" }
];

const HITOS_SALUD = [
    {
        dias: 0.014,
        titulo: "20 minutos",
        texto: "La frecuencia cardiaca comienza a normalizarse."
    },
    {
        dias: 0.5,
        titulo: "12 horas",
        texto: "Disminuye el monóxido de carbono en sangre."
    },
    {
        dias: 2,
        titulo: "48 horas",
        texto: "Mejoran el gusto y el olfato."
    },
    {
        dias: 14,
        titulo: "2 semanas",
        texto: "Mejora la circulación."
    },
    {
        dias: 90,
        titulo: "3 meses",
        texto: "Aumenta la función pulmonar."
    },
    {
        dias: 365,
        titulo: "1 año",
        texto: "Disminuye significativamente el riesgo cardiovascular."
    }
];

const FRASES = [
    "Cada cigarrillo rechazado es una victoria.",
    "No necesitas fumar para superar este momento.",
    "Respira, aguanta unos minutos y sigue adelante.",
    "Tu salud te agradecerá este esfuerzo.",
    "Las ganas pasan. Los beneficios permanecen.",
    "Hoy es un gran día para seguir libre de humo.",
    "Lo estás haciendo mejor de lo que crees."
];

// ======================================
// INICIO
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    comprobarConfiguracion();

    cargarTodo();

    mostrarPantalla("inicio");

    setInterval(() => {
        actualizarDashboard();
    }, 1000);

});

// ======================================
// UTILIDADES
// ======================================

function cargarTodo() {
    actualizarDashboard();
    cargarSalud();
    cargarMotivos();
    cargarDiario();
    cargarLogros();
}

function obtenerConfiguracion() {
    return JSON.parse(localStorage.getItem("configuracionLibreHumo"));
}

function actualizarElemento(id, valor) {
    const el = document.getElementById(id);

    if (el) {
        el.textContent = valor;
    }
}

// ======================================
// CONFIGURACION
// ======================================

function guardarConfiguracion() {

    const configuracion = {
        fechaAbandono: document.getElementById("fechaAbandono").value,
        cigarrillosDia: parseInt(document.getElementById("cigarrillosDia").value) || 0,
        precioCajetilla: parseFloat(document.getElementById("precioCajetilla").value) || 0,
        cigarrillosCajetilla: parseInt(document.getElementById("cigarrillosCajetilla").value) || 20,
        anosFumando: parseInt(document.getElementById("anosFumando").value) || 0
    };

    localStorage.setItem(
        "configuracionLibreHumo",
        JSON.stringify(configuracion)
    );

    comprobarConfiguracion();
    cargarTodo();
}

function comprobarConfiguracion() {

    const config = obtenerConfiguracion();

    const configScreen =
        document.getElementById("pantalla-configuracion");

    const inicioScreen =
        document.getElementById("pantalla-inicio");

    if (!config || !config.fechaAbandono) {

        configScreen.classList.remove("oculto");
        inicioScreen.classList.add("oculto");

    } else {

        configScreen.classList.add("oculto");
        inicioScreen.classList.remove("oculto");
    }
}

// ======================================
// NAVEGACION
// ======================================

function mostrarPantalla(nombre) {

    const pantallas =
        document.querySelectorAll(".pantalla");

    pantallas.forEach(p => {
        p.classList.add("oculto");
    });

    const destino =
        document.getElementById(`pantalla-${nombre}`);

    if (destino) {
        destino.classList.remove("oculto");
    }

    actualizarDashboard();
}

// ======================================
// TIEMPO SIN FUMAR
// ======================================

function obtenerTiempoSinFumar() {

    const config = obtenerConfiguracion();

    if (!config || !config.fechaAbandono) {
        return null;
    }

    const inicio = new Date(config.fechaAbandono);
    const ahora = new Date();

    const diferencia = ahora - inicio;

    const dias =
        Math.floor(diferencia / (1000 * 60 * 60 * 24));

    const horas =
        Math.floor(
            (diferencia % (1000 * 60 * 60 * 24))
            / (1000 * 60 * 60)
        );

    const minutos =
        Math.floor(
            (diferencia % (1000 * 60 * 60))
            / (1000 * 60)
        );

    return {
        dias,
        horas,
        minutos,
        milisegundos: diferencia
    };
}

// ======================================
// DASHBOARD
// ======================================

function actualizarDashboard() {

    const config = obtenerConfiguracion();

    if (!config) return;

    const tiempo = obtenerTiempoSinFumar();

    if (!tiempo) return;

    const dias = tiempo.dias;

    const cigarrillosEvitados =
        dias * config.cigarrillosDia;

    const dinero =
        (cigarrillosEvitados /
            config.cigarrillosCajetilla)
        * config.precioCajetilla;

    const salud =
        Math.min(
            Math.round((dias / 365) * 100),
            100
        );

    actualizarElemento(
        "diasSinFumar",
        `${dias}d ${tiempo.horas}h ${tiempo.minutos}m`
    );

    actualizarElemento(
        "cigarrillosEvitados",
        cigarrillosEvitados
    );

    actualizarElemento(
        "dineroAhorrado",
        `${dinero.toFixed(2)} €`
    );

    actualizarElemento(
        "saludRecuperada",
        `${salud}%`
    );

    actualizarProximoLogro(dias);
}

function actualizarProximoLogro(diasActuales) {

    const siguiente =
        LOGROS.find(
            logro => diasActuales < logro.dias
        );

    const el =
        document.getElementById("proximoLogro");

    if (!el) return;

    if (siguiente) {

        const porcentaje =
            Math.round(
                (diasActuales / siguiente.dias) * 100
            );

        el.textContent =
            `${siguiente.nombre} (${porcentaje}%)`;

    } else {

        el.textContent =
            "💎 Leyenda sin humo";
    }
}

// ======================================
// SALUD
// ======================================

function cargarSalud() {

    const lista =
        document.getElementById("listaSalud");

    if (!lista) return;

    lista.innerHTML = "";

    const tiempo = obtenerTiempoSinFumar();

    const dias = tiempo ? tiempo.dias : 0;

    HITOS_SALUD.forEach(hito => {

        const conseguido =
            dias >= hito.dias;

        lista.innerHTML += `
            <div class="timeline-item ${conseguido ? "completado" : "pendiente"}">
                <h3>${conseguido ? "✅" : "⏳"} ${hito.titulo}</h3>
                <p>${hito.texto}</p>
            </div>
        `;
    });
}

// ======================================
// MOTIVOS
// ======================================

function obtenerMotivos() {
    return JSON.parse(
        localStorage.getItem("motivos")
    ) || [];
}

function agregarMotivo() {

    const input =
        document.getElementById("nuevoMotivo");

    const texto =
        input.value.trim();

    if (!texto) return;

    const motivos =
        obtenerMotivos();

    motivos.push(texto);

    localStorage.setItem(
        "motivos",
        JSON.stringify(motivos)
    );

    input.value = "";

    cargarMotivos();
}

function cargarMotivos() {

    const lista =
        document.getElementById("listaMotivos");

    if (!lista) return;

    lista.innerHTML =
        obtenerMotivos()
        .map(m => `
            <div class="motivo">
                💪 ${m}
            </div>
        `)
        .join("");
}

// ======================================
// DIARIO
// ======================================

function obtenerDiario() {
    return JSON.parse(
        localStorage.getItem("diario")
    ) || [];
}

function guardarEntradaDiario() {

    const entrada = {
        fecha: new Date().toLocaleString(),
        nivel:
            document.getElementById(
                "nivelAnsiedad"
            ).value,
        situacion:
            document.getElementById(
                "situacion"
            ).value,
        comentario:
            document.getElementById(
                "comentario"
            ).value
    };

    const diario =
        obtenerDiario();

    diario.unshift(entrada);

    localStorage.setItem(
        "diario",
        JSON.stringify(diario)
    );

    document.getElementById(
        "situacion"
    ).value = "";

    document.getElementById(
        "comentario"
    ).value = "";

    cargarDiario();
}

function cargarDiario() {

    const historial =
        document.getElementById(
            "historialDiario"
        );

    if (!historial) return;

    historial.innerHTML =
        obtenerDiario()
        .map(item => `
            <div class="registro">
                <p><strong>📅</strong> ${item.fecha}</p>
                <p><strong>🔥</strong> ${item.nivel}/10</p>
                <p><strong>📍</strong> ${item.situacion}</p>
                <p>${item.comentario}</p>
            </div>
        `)
        .join("");
}

// ======================================
// LOGROS
// ======================================

function cargarLogros() {

    const lista =
        document.getElementById(
            "listaLogros"
        );

    if (!lista) return;

    const tiempo =
        obtenerTiempoSinFumar();

    const dias =
        tiempo ? tiempo.dias : 0;

    lista.innerHTML = "";

    LOGROS.forEach(logro => {

        const conseguido =
            dias >= logro.dias;

        lista.innerHTML += `
            <div class="logro ${conseguido ? "conseguido" : "bloqueado"}">
                ${conseguido ? "✅" : "🔒"} ${logro.nombre}
            </div>
        `;
    });
}

// ======================================
// EMERGENCIA
// ======================================

function activarEmergencia() {

    const contenedor =
        document.getElementById(
            "emergenciaContenido"
        );

    let segundos = 300;

    const frase =
        FRASES[
            Math.floor(
                Math.random() * FRASES.length
            )
        ];

    contenedor.innerHTML = `
        <div class="card">
            <h3>🚨 Mantente fuerte</h3>

            <p>${frase}</p>

            <br>

            <h2 id="contadorEmergencia">
                05:00
            </h2>

            <p>
                Respira:
                4 segundos inspirar,
                4 mantener,
                6 exhalar.
            </p>
        </div>
    `;

    const contador =
        document.getElementById(
            "contadorEmergencia"
        );

    const intervalo =
        setInterval(() => {

            segundos--;

            const min =
                String(
                    Math.floor(segundos / 60)
                ).padStart(2, "0");

            const seg =
                String(
                    segundos % 60
                ).padStart(2, "0");

            contador.textContent =
                `${min}:${seg}`;

            if (segundos <= 0) {

                clearInterval(intervalo);

                contador.textContent =
                    "✅ Superado";

            }

        }, 1000);
}

// ======================================
// AJUSTES
// ======================================

function reiniciarDatos() {

    const confirmar =
        confirm(
            "¿Seguro que deseas borrar todos los datos?"
        );

    if (!confirmar) return;

    localStorage.clear();

    location.reload();
}

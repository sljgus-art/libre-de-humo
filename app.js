// =========================
// LIBRE DE HUMO APP
// =========================

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
    { dias: 0.01, titulo: "20 minutos", texto: "La frecuencia cardiaca empieza a normalizarse." },
    { dias: 0.5, titulo: "12 horas", texto: "Disminuye el monóxido de carbono en sangre." },
    { dias: 2, titulo: "48 horas", texto: "Mejoran el gusto y el olfato." },
    { dias: 14, titulo: "2 semanas", texto: "Mejora la circulación." },
    { dias: 90, titulo: "3 meses", texto: "Aumenta la capacidad pulmonar." },
    { dias: 365, titulo: "1 año", texto: "Disminuye significativamente el riesgo cardiovascular." }
];

// =========================
// INICIO
// =========================

document.addEventListener("DOMContentLoaded", () => {

    comprobarConfiguracion();

    actualizarDashboard();

    cargarMotivos();

    cargarDiario();

    cargarLogros();

    cargarSalud();

});

// =========================
// CONFIGURACIÓN
// =========================

function guardarConfiguracion() {

    const configuracion = {
        fechaAbandono: document.getElementById("fechaAbandono").value,
        cigarrillosDia: parseInt(document.getElementById("cigarrillosDia").value) || 0,
        precioCajetilla: parseFloat(document.getElementById("precioCajetilla").value) || 0,
        cigarrillosCajetilla: parseInt(document.getElementById("cigarrillosCajetilla").value) || 20,
        anosFumando: parseInt(document.getElementById("anosFumando").value) || 0
    };

    localStorage.setItem("configuracionLibreHumo", JSON.stringify(configuracion));

    comprobarConfiguracion();
    actualizarDashboard();
}

function obtenerConfiguracion() {
    return JSON.parse(localStorage.getItem("configuracionLibreHumo"));
}

function comprobarConfiguracion() {

    const config = obtenerConfiguracion();

    const pantallaConfig = document.getElementById("pantalla-configuracion");
    const pantallaInicio = document.getElementById("pantalla-inicio");

    if (!config || !config.fechaAbandono) {
        pantallaConfig.classList.remove("oculto");
        pantallaInicio.classList.add("oculto");
    } else {
        pantallaConfig.classList.add("oculto");
        pantallaInicio.classList.remove("oculto");
    }
}

// =========================
// NAVEGACIÓN
// =========================

function mostrarPantalla(nombre) {

    document.querySelectorAll(".pantalla").forEach(p => {
        p.classList.add("oculto");
    });

    const pantalla = document.getElementById(`pantalla-${nombre}`);

    if (pantalla) {
        pantalla.classList.remove("oculto");
    }

    actualizarDashboard();
}

// =========================
// DASHBOARD
// =========================

function calcularDiasSinFumar() {

    const config = obtenerConfiguracion();

    if (!config || !config.fechaAbandono) return 0;

    const inicio = new Date(config.fechaAbandono);
    const ahora = new Date();

    const diferencia = ahora - inicio;

    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
}

function actualizarDashboard() {

    const config = obtenerConfiguracion();

    if (!config) return;

    const dias = calcularDiasSinFumar();

    const cigarrillosEvitados =
        dias * config.cigarrillosDia;

    const dinero =
        (cigarrillosEvitados / config.cigarrillosCajetilla) *
        config.precioCajetilla;

    const salud =
        Math.min(Math.round((dias / 365) * 100), 100);

    actualizarElemento("diasSinFumar", `${dias} días`);
    actualizarElemento("cigarrillosEvitados", cigarrillosEvitados);
    actualizarElemento("dineroAhorrado", `${dinero.toFixed(2)} €`);
    actualizarElemento("saludRecuperada", `${salud}%`);

    mostrarProximoLogro(dias);
}

function actualizarElemento(id, valor) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function mostrarProximoLogro(diasActuales) {

    const logro = LOGROS.find(l => diasActuales < l.dias);

    const elemento = document.getElementById("proximoLogro");

    if (!elemento) return;

    if (logro) {
        elemento.textContent = `${logro.nombre} (${logro.dias} días)`;
    } else {
        elemento.textContent = "💎 Leyenda sin humo";
    }
}

// =========================
// SALUD
// =========================

function cargarSalud() {

    const lista = document.getElementById("listaSalud");

    if (!lista) return;

    const dias = calcularDiasSinFumar();

    lista.innerHTML = "";

    HITOS_SALUD.forEach(hito => {

        const conseguido = dias >= hito.dias;

        lista.innerHTML += `
            <div class="timeline-item ${conseguido ? "completado" : "pendiente"}">
                <h3>${conseguido ? "✅" : "⏳"} ${hito.titulo}</h3>
                <p>${hito.texto}</p>
            </div>
        `;
    });
}

// =========================
// MOTIVOS
// =========================

function obtenerMotivos() {
    return JSON.parse(localStorage.getItem("motivos")) || [];
}

function agregarMotivo() {

    const textarea = document.getElementById("nuevoMotivo");

    const texto = textarea.value.trim();

    if (!texto) return;

    const motivos = obtenerMotivos();

    motivos.push(texto);

    localStorage.setItem("motivos", JSON.stringify(motivos));

    textarea.value = "";

    cargarMotivos();
}

function cargarMotivos() {

    const contenedor = document.getElementById("listaMotivos");

    if (!contenedor) return;

    const motivos = obtenerMotivos();

    contenedor.innerHTML = motivos
        .map(m =>
            `<div class="motivo"><strong>💪</strong> ${m}</div>`
        )
        .join("");
}

// =========================
// DIARIO
// =========================

function obtenerDiario() {
    return JSON.parse(localStorage.getItem("diario")) || [];
}

function guardarEntradaDiario() {

    const entrada = {
        fecha: new Date().toLocaleString(),
        nivel: document.getElementById("nivelAnsiedad").value,
        situacion: document.getElementById("situacion").value,
        comentario: document.getElementById("comentario").value
    };

    const diario = obtenerDiario();

    diario.unshift(entrada);

    localStorage.setItem("diario", JSON.stringify(diario));

    document.getElementById("situacion").value = "";
    document.getElementById("comentario").value = "";

    cargarDiario();
}

function cargarDiario() {

    const contenedor = document.getElementById("historialDiario");

    if (!contenedor) return;

    const diario = obtenerDiario();

    contenedor.innerHTML = diario.map(item => `
        <div class="registro">
            <p><strong>📅</strong> ${item.fecha}</p>
            <p><strong>🔥 Deseo:</strong> ${item.nivel}/10</p>
            <p><strong>📍 Situación:</strong> ${item.situacion}</p>
            <p><strong>📝</strong> ${item.comentario}</p>
        </div>
    `).join("");
}

// =========================
// LOGROS
// =========================

function cargarLogros() {

    const lista = document.getElementById("listaLogros");

    if (!lista) return;

    const dias = calcularDiasSinFumar();

    lista.innerHTML = "";

    LOGROS.forEach(logro => {

        const conseguido = dias >= logro.dias;

        lista.innerHTML += `
            <div class="logro ${conseguido ? "conseguido" : "bloqueado"}">
                ${conseguido ? "✅" : "🔒"} ${logro.nombre}
            </div>
        `;
    });
}

// =========================
// EMERGENCIA
// =========================

function activarEmergencia() {

    const dias = calcularDiasSinFumar();

    const config = obtenerConfiguracion();

    let dinero = 0;
    let cigarrillos = 0;

    if (config) {

        cigarrillos =
            dias * config.cigarrillosDia;

        dinero =
            (cigarrillos / config.cigarrillosCajetilla) *
            config.precioCajetilla;
    }

    const motivos = obtenerMotivos();

    const razon =
        motivos.length > 0
            ? motivos[Math.floor(Math.random() * motivos.length)]
            : "Tu salud merece este esfuerzo.";

    document.getElementById("emergenciaContenido").innerHTML = `
        <div class="card">

            <h3>Respira profundamente</h3>

            <p class="mensaje-motivador">
                Inhala 4 segundos<br>
                Mantén 4 segundos<br>
                Exhala 6 segundos
            </p>

            <br>

            <h3>💪 Recuerda tu motivo</h3>

            <p>${razon}</p>

            <br>

            <h3>📊 Tu progreso</h3>

            <p>🚭 ${dias} días sin fumar</p>
            <p>🚬 ${cigarrillos} cigarrillos evitados</p>
            <p>💰 ${dinero.toFixed(2)} € ahorrados</p>

            <br>

            <h3>❤️ Aguanta 5 minutos</h3>

            <p>
                La mayoría de los deseos intensos de fumar
                desaparecen en pocos minutos.
            </p>

        </div>
    `;
}

// =========================
// AJUSTES
// =========================

function reiniciarDatos() {

    const confirmar = confirm(
        "¿Seguro que quieres borrar todos los datos?"
    );

    if (!confirmar) return;

    localStorage.clear();

    location.reload();
}

// =========================
// ACTUALIZACIONES AUTOMÁTICAS
// =========================

setInterval(() => {

    actualizarDashboard();
    cargarLogros();

}, 60000);

import { crearPNJ } from "./crear-pnj.mjs";

const MODULE_ID = "macros-elena";
const { DialogV2 } = foundry.applications.api;

/* -------------------------------------------- */
/*  Utilidades                                   */
/* -------------------------------------------- */

/** Personajes de jugadores, sin plantillas, ordenados por nombre. */
function getPCs() {
  return game.actors
    .filter(a => !a.name.includes("_template") && a.hasPlayerOwner)
    .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
}

const prop = (a, ...keys) => {
  const props = a.system?.props ?? {};
  for (const k of keys) if (props[k] !== undefined && props[k] !== null) return props[k];
  return "-";
};

const esc = s => foundry.utils.escapeHTML(String(s ?? "-"));

/** Color según valor (salud/estabilidad). */
function getColor(valor) {
  const v = Number(valor);
  if (Number.isNaN(v)) return "#888";
  if (v < 4) return "#7a0000";
  if (v < 7) return "#cc0000";
  if (v < 11) return "#ff4500";
  if (v < 16) return "#d48a00";
  return "#008f00";
}

/**
 * Tabla HTML con estilo fijo (texto oscuro sobre filas claras, legible también con el tema oscuro).
 * @param {{label: string, align?: string, width?: string}[]} columns
 * @param {string[][]} rows   Celdas ya escapadas (HTML)
 */
function table(columns, rows) {
  const th = columns.map(c =>
    `<th style="text-align:${c.align ?? "center"}; padding:8px;${c.width ? ` width:${c.width};` : ""}">${c.label}</th>`).join("");
  return `
    <table class="macros-elena-table" style="width:100%; border-collapse:collapse; font-size:14px; color:#222;
      box-shadow:0 0 8px rgba(0,0,0,0.15); border-radius:6px; overflow:hidden; table-layout:fixed; margin:0;">
      <thead style="background-color:#333; color:white;"><tr>${th}</tr></thead>
      <tbody>${tableRows(columns, rows)}</tbody>
    </table>`;
}

function tableRows(columns, rows) {
  return rows.map((cells, i) => {
    const bg = i % 2 === 0 ? "#f9f9f9" : "#efefef";
    const tds = cells.map((cell, j) =>
      `<td style="padding:8px; text-align:${columns[j].align ?? "center"}; word-wrap:break-word;">${cell}</td>`).join("");
    return `<tr style="background-color:${bg}; border-bottom:1px solid #ccc;">${tds}</tr>`;
  }).join("");
}

function showTable(title, html, width = 800, extra = {}) {
  return DialogV2.prompt({
    window: { title, resizable: true },
    position: { width },
    content: html,
    ok: { label: "Cerrar", icon: "fa-solid fa-xmark" },
    rejectClose: false,
    ...extra
  });
}

/* -------------------------------------------- */
/*  Macros                                       */
/* -------------------------------------------- */

/** Recalcula las proezas máximas de cada PJ: 5 + floor((FUE + INT) / 2). */
async function actualizarProezas() {
  if (!game.user.isGM) return ui.notifications.warn("Solo el GM puede actualizar proezas.");
  for (const a of getPCs()) {
    try {
      const actual = prop(a, "proezas_valor");
      const fue = Number(prop(a, "val_atr3", "fuerza_pj"));
      const int = Number(prop(a, "val_atr4", "inteligencia_pj"));
      const max = 5 + Math.floor((fue + int) / 2);
      if (Number.isNaN(max)) {
        ui.notifications.warn(`Error al actualizar ${a.name}: valores inválidos.`);
        console.warn(`${MODULE_ID} |`, a);
        continue;
      }
      await a.update({ "system.props.proezas_valor": max });
      ui.notifications.info(`${a.name}: Proezas ${actual} → ${max}`);
    } catch (err) {
      console.error(`${MODULE_ID} | Error al procesar ${a.name}:`, err);
      ui.notifications.error(`Fallo al actualizar ${a.name}`);
    }
  }
}

/** Tabla con los defectos leve/grave de cada PJ. */
function defectos() {
  const columns = [
    { label: "Nombre", align: "left", width: "30%" },
    { label: "Defecto Leve" },
    { label: "Defecto Grave" }
  ];
  const rows = getPCs().map(a => [esc(a.name), esc(prop(a, "defecto_leve")), esc(prop(a, "defecto_grave"))]);
  return showTable("Resumen de Defectos", table(columns, rows), 700);
}

/** Tabla completa de atributos de cada PJ. */
function datosPJ() {
  const columns = [
    { label: "Nombre", align: "left", width: "22%" },
    { label: "FUE" }, { label: "INT" }, { label: "AGI" }, { label: "APL" }, { label: "PER" },
    { label: "SALUD" }, { label: "ESTAB" }, { label: "PROEZAS" }
  ];
  const rows = getPCs().map(a => [
    esc(a.name),
    esc(prop(a, "val_atr3", "fuerza_pj")),
    esc(prop(a, "val_atr4", "inteligencia_pj")),
    esc(prop(a, "habpas1_valor")),
    esc(prop(a, "habpas2_valor")),
    esc(prop(a, "habpas2_valor_copy1")),
    esc(prop(a, "salud_valor")),
    esc(prop(a, "estabilidad_valor")),
    esc(prop(a, "proezas_valor"))
  ]);
  return showTable("Resumen de Personajes", table(columns, rows), 1000);
}

/** Estado actual de cada PJ (salud/estabilidad coloreadas) con botón Actualizar. */
function estadoPJs() {
  const columns = [
    { label: "Nombre", align: "left", width: "25%" },
    { label: "Proezas" }, { label: "Salud" }, { label: "Estabilidad" },
    { label: "Agilidad" }, { label: "Aplomo" }, { label: "Perspicacia" }
  ];
  const colored = v => `<span style="color:${getColor(v)}; font-weight:bold;">${esc(v)}</span>`;
  const getRows = () => getPCs().map(a => [
    esc(a.name),
    esc(prop(a, "proezas_valor")),
    colored(prop(a, "salud_valor")),
    colored(prop(a, "estabilidad_valor")),
    esc(prop(a, "habpas1_valor")),
    esc(prop(a, "habpas2_valor")),
    esc(prop(a, "habpas2_valor_copy1"))
  ]);
  return DialogV2.wait({
    window: { title: "Resumen de Atributos y Estado", resizable: true },
    position: { width: 1000 },
    content: table(columns, getRows()),
    rejectClose: false,
    buttons: [
      { action: "refresh", label: "Actualizar", icon: "fa-solid fa-rotate", default: true,
        callback: () => null }, // el refresco lo gestiona el listener de render, sin cerrar
      { action: "close", label: "Cerrar", icon: "fa-solid fa-xmark" }
    ],
    render: (event, dialog) => {
      const btn = dialog.element.querySelector('button[data-action="refresh"]');
      btn.addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        dialog.element.querySelector(".macros-elena-table tbody").innerHTML = tableRows(columns, getRows());
      }, { capture: true });
    }
  });
}

/** Crea una escena rectangular sin cuadrícula, negra y con luz global, y la activa. */
async function escenaRapida() {
  if (!game.user.isGM) return ui.notifications.warn("Solo el GM puede crear escenas.");
  const scene = await Scene.create({
    name: "Escena Rectangular Gridless",
    backgroundColor: "#000000",
    width: 2500, height: 1500, padding: 0,
    grid: { type: CONST.GRID_TYPES.GRIDLESS, alpha: 0 },
    tokenVision: false,
    fog: { exploration: false },
    environment: { globalLight: { enabled: true } }
  });
  if (scene) {
    ui.notifications.info("Escena creada.");
    await scene.activate();
  }
}

/* -------------------------------------------- */

const api = { actualizarProezas, defectos, datosPJ, estadoPJs, escenaRapida, crearPNJ };

Hooks.once("init", () => {
  game.modules.get(MODULE_ID).api = api;
});

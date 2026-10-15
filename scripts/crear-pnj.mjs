/* -------------------------------------------- */
/*  Crear PNJ aleatorio (plantilla PNJ Ysystem)  */
/* -------------------------------------------- */
// Usa la plantilla «PNJ_Ysystem_template V2» del módulo hojas-pj-ysystem (Darokin-rpg) tal cual:
// sus 4 habilidades (Atletismo, Fuerza bruta, Lucha, Puntería) con los atributos que trae la hoja.
// Si la plantilla no está en el mundo, la importa del compendio «Actores Ysystem».
// Todas las tablas de abajo se pueden editar a gusto.

const PNJ_TEMPLATE = "PNJ_Ysystem_template V2";
const PNJ_PACK = "hojas-pj-ysystem.actores-ysystem";
const PNJ_FOLDER = "PNJ generados";

// Atributos de la hoja PNJ: 1 Carisma, 2 Destreza, 3 Fuerza, 4 Inteligencia, 5 Percepción
const CAR = 1, DES = 2, FUE = 3, INT = 4, PER = 5;
// Habilidades de la hoja PNJ de Darokin (clave hab<N> de la plantilla)
const ATLETISMO = 1, FUERZA_BRUTA = 7, LUCHA = 12, PUNTERIA = 19;

const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = list => list[Math.floor(Math.random() * list.length)];
const pickN = (list, n) => [...list].sort(() => Math.random() - 0.5).slice(0, n);

// [nombres, apodos] por género, para que concuerden («Urraca la Roja», «Nuño el Tuerto»)
const NOMBRES = [
  [["Aldric", "Berenguer", "Dagoberto", "Fortún", "Godofredo", "Íñigo", "Leovigildo", "Nuño", "Pelayo", "Ramiro",
    "Tello", "Velasco", "Zoilo", "Bermudo", "Ermengol"],
   ["el Tuerto", "el Callado", "el Manco", "el Zorro", "el Carnicero", "el Cuervo", "el Viejo", "Mano de Hierro",
    "Pies Ligeros", "Medio Oreja"]],
  [["Brunilda", "Casilda", "Elvira", "Gelmira", "Hildegarda", "Jimena", "Mencía", "Oria", "Quiteria", "Sancha",
    "Urraca", "Ximena", "Amalasunta", "Toda", "Leonor"],
   ["la Roja", "la Viuda", "la Lechuza", "la Sombra", "la Tuerta", "la Callada", "la Vieja", "Mano de Hierro",
    "Pies Ligeros", "Medio Oreja"]]
];
const nombreAleatorio = () => {
  const [nombres, apodos] = pick(NOMBRES);
  return `${pick(nombres)} ${pick(apodos)}`;
};

const TIPOS = {
  fuerte: {
    etiqueta: "Enemigo fuerte",
    disposition: -1,
    atributos: () => ({ [CAR]: rnd(0, 2), [DES]: rnd(3, 5), [FUE]: rnd(5, 7), [INT]: rnd(0, 2), [PER]: rnd(2, 4) }),
    // dados (1-3) de cada habilidad
    habilidades: () => ({ [ATLETISMO]: rnd(2, 3), [FUERZA_BRUTA]: 3, [LUCHA]: 3, [PUNTERIA]: rnd(1, 2) }),
    salud: () => rnd(15, 20),
    estabilidad: () => rnd(8, 12),
    profesiones: ["Mercenario", "Matón de taberna", "Bandolero", "Guardia de la puerta", "Gladiador",
      "Leñador", "Herrero renegado", "Cazarrecompensas", "Desertor", "Carnicero"],
    frases: ["«Esto no es nada personal.»", "«¿Quién va primero?»", "«Te voy a partir en dos.»",
      "«He matado a gente mejor que tú.»", "«Me pagan por romper huesos.»"],
    talentos: [
      "Mole: ignora el primer punto de daño de cada ataque.",
      "Golpe brutal: con un crítico en Lucha, el objetivo cae al suelo.",
      "Incansable: no sufre penalizaciones por heridas hasta tener Salud 3 o menos.",
      "Embestida: puede gastar su turno en derribar a un enemigo con Fuerza bruta.",
      "Furia: cuando pierde la mitad de su Salud, +1 dado en Lucha."
    ],
    // [arma, daño]
    armas: [["Hacha de guerra", 5], ["Mandoble", 6], ["Maza", 5], ["Garrote con clavos", 4], ["Espada", 4], ["Martillo de guerra", 6]],
    armasExtra: [["Puños", 1], ["Cuchillo", 2], ["Jabalinas", 3], ["Honda", 2]],
    // [armadura, bono, penalización]
    armaduras: [["Cota de malla", 4, 1], ["Cuero tachonado", 2, 0], ["Brigantina", 3, 1], ["Pelliza gruesa", 1, 0]],
    escudo: 0.5
  },
  debil: {
    etiqueta: "Enemigo débil",
    disposition: -1,
    atributos: () => ({ [CAR]: rnd(0, 2), [DES]: rnd(1, 3), [FUE]: rnd(1, 3), [INT]: rnd(0, 2), [PER]: rnd(1, 2) }),
    habilidades: () => ({ [ATLETISMO]: 1, [FUERZA_BRUTA]: 1, [LUCHA]: rnd(1, 2), [PUNTERIA]: 1 }),
    salud: () => rnd(6, 10),
    estabilidad: () => rnd(5, 9),
    profesiones: ["Ratero", "Matón de poca monta", "Recluta novato", "Pordiosero", "Cuatrero",
      "Aprendiz de bandido", "Guardia borracho", "Cobrador de peajes", "Siervo armado", "Saqueador"],
    frases: ["«¡No me hagáis daño!»", "«El jefe dijo que sería fácil…»", "«¡A por ellos! …¿Vais vosotros primero?»",
      "«Yo solo vigilaba.»", "«Dame la bolsa y nadie sale herido. Creo.»"],
    talentos: [
      "Cobarde: huye en cuanto pierde la mitad de su Salud.",
      "En grupo: +1 dado en Lucha si hay otro aliado suyo cerca del objetivo.",
      "Escurridizo: +1 dado en Atletismo para escapar.",
      "Chivato: si lo capturan, cuenta todo lo que sabe.",
      "Sin talento: es carne de cañón y lo sabe."
    ],
    armas: [["Cuchillo", 2], ["Garrote", 3], ["Hoz", 2], ["Lanza corta", 3]],
    armasExtra: [["Puños", 1], ["Piedras", 1], ["Honda", 2]],
    armaduras: [["Harapos", 0, 0], ["Ropa acolchada", 1, 0], ["Ninguna", 0, 0]],
    escudo: 0.15
  },
  aliado: {
    etiqueta: "Aliado",
    disposition: 1,
    atributos: () => {
      // Reparte 13 puntos como un PJ, máximo 6 por atributo
      const atr = { [CAR]: 0, [DES]: 0, [FUE]: 0, [INT]: 0, [PER]: 0 };
      for (let p = 0; p < 13;) {
        const k = rnd(1, 5);
        if (atr[k] < 6) { atr[k]++; p++; }
      }
      return atr;
    },
    habilidades: () => ({ [ATLETISMO]: rnd(1, 3), [FUERZA_BRUTA]: rnd(1, 3), [LUCHA]: rnd(1, 3), [PUNTERIA]: rnd(1, 3) }),
    salud: () => rnd(10, 18),
    estabilidad: () => rnd(12, 22),
    profesiones: ["Posadera", "Guía de montaña", "Curandero", "Juglar", "Buhonero", "Escudero",
      "Cazadora", "Pescador", "Monje errante", "Ladronzuela", "Barquero", "Herbolaria"],
    frases: ["«Conozco un atajo.»", "«Os debo una, y yo pago mis deudas.»", "«No me gusta esto, pero voy.»",
      "«Con el estómago lleno se piensa mejor.»", "«Si salimos de esta, invito yo.»"],
    talentos: [
      "Conocido en la zona: siempre sabe a quién preguntar.",
      "Ojo avizor: es difícil sorprenderle; +1 a la Iniciativa.",
      "Leal: una vez por sesión puede recibir un golpe destinado a un PJ.",
      "Buen brazo: +1 dado en Puntería con armas arrojadizas.",
      "Ágil: +1 dado en Atletismo para huir o perseguir."
    ],
    armas: [["Cuchillo", 2], ["Espada corta", 3], ["Arco", 4], ["Bastón", 3], ["Lanza", 4], ["Hacha de mano", 3]],
    armasExtra: [["Honda", 2], ["Puños", 1]],
    armaduras: [["Ropa de viaje", 1, 0], ["Jubón de cuero", 2, 0], ["Ninguna", 0, 0]],
    escudo: 0.25
  }
};

const PERTENENCIAS = [
  "Bolsa con monedas", "Odre de vino", "Cuerda (10 m)", "Antorcha", "Pedernal y yesca", "Raciones para 3 días",
  "Mapa arrugado", "Amuleto de hueso", "Carta sin abrir", "Llave oxidada", "Dados trucados", "Ungüento curativo",
  "Manta", "Anillo con sello", "Piedra de afilar", "Frasco de aceite", "Ganzúas", "Recuerdo de la familia"
];
const MOTIVACIONES = [
  "Busca venganza por algo que le arrebataron.", "Quiere dinero, mucho y rápido.", "Protege a alguien que le importa.",
  "Obedece órdenes de alguien a quien teme.", "Quiere demostrar lo que vale.", "Huye de su pasado.",
  "Cree firmemente en una causa.", "Solo quiere volver a casa."
];
const SECRETOS = [
  "Debe dinero a gente peligrosa.", "Tiene un hijo del que nadie sabe nada.", "Fue antes de otro bando.",
  "Teme a la oscuridad.", "Traicionó a alguien que confiaba en su palabra.", "Sabe dónde hay algo escondido.",
  "Está enfermo/a y lo oculta.", "Su nombre no es el verdadero."
];

function generarPNJ(tipoKey, nombre) {
  const t = TIPOS[tipoKey];
  const props = {};

  const atr = t.atributos();
  for (let i = 1; i <= 5; i++) props[`val_atr${i}`] = String(atr[i]);

  // Solo se marcan los dados; nombre y atributo de cada habilidad quedan como en la hoja de Darokin
  for (const [n, dados] of Object.entries(t.habilidades())) {
    for (let c = 1; c <= 3; c++) props[`check${c}hab${n}`] = c <= dados;
  }

  const salud = t.salud();
  props.Salud_max = String(salud);
  props.salud_valor = String(salud);
  // Los botones de estabilidad de la hoja van del 3 al 27
  props.estabilidad_valor = String(Math.min(27, Math.max(3, t.estabilidad())));

  props.Profesion_pj = pick(t.profesiones);
  props.frase_pj = pick(t.frases);
  props.talento_pj = pick(t.talentos);

  const armas = [pick(t.armas)];
  if (Math.random() < 0.6) armas.push(pick(t.armasExtra));
  props.tabla_combate = Object.fromEntries(armas.map(([arma, dano], i) =>
    [String(i), { $deleted: false, arma, dano: String(dano) }]));

  const [armadura, bono, pen] = pick(t.armaduras);
  props.tipo_armadura = armadura;
  props.bono_armadura = String(bono);
  props.penalizacion_armadura = String(pen);
  if (Math.random() < t.escudo) {
    props.tipo_armadura_copy1 = pick(["Rodela", "Escudo de madera", "Escudo redondo"]);
    props.bono_escudo = String(rnd(1, 2));
  } else {
    props.tipo_armadura_copy1 = "Ninguno";
    props.bono_escudo = "0";
  }
  props.penalizacion_escudo = "0";

  props.pertenencias = Object.fromEntries(pickN(PERTENENCIAS, rnd(2, 4)).map((p, i) =>
    [String(i), { $deleted: false, nombrepert: p }]));

  props.trasfondo_pj = `<p><strong>${t.etiqueta}.</strong> ${pick(MOTIVACIONES)}</p>`;
  props.trasfondo_pj_copy1 = `<p><strong>Secreto:</strong> ${pick(SECRETOS)}</p>`;

  return { name: nombre || nombreAleatorio(), props };
}

/** Busca la plantilla PNJ en el mundo; si no está, la importa del compendio de hojas-pj-ysystem. */
async function getPNJTemplate() {
  const enMundo = game.actors.find(a => a.type === "_template" && a.name === PNJ_TEMPLATE);
  if (enMundo) return enMundo;
  const pack = game.packs.get(PNJ_PACK);
  const entry = pack && (await pack.getIndex()).find(e => e.name === PNJ_TEMPLATE);
  if (!entry) return null;
  ui.notifications.info("Importando la plantilla PNJ desde el compendio «Actores Ysystem»…");
  return game.actors.importFromCompendium(pack, entry._id);
}

async function getFolder() {
  return game.folders.find(f => f.type === "Actor" && f.name === PNJ_FOLDER)
    ?? Folder.create({ name: PNJ_FOLDER, type: "Actor" });
}

export async function crearPNJ() {
  if (!game.user.isGM) return ui.notifications.warn("Solo la directora de juego puede crear PNJ.");

  const tpl = await getPNJTemplate();
  if (!tpl) {
    const tpls = game.actors.filter(a => a.type === "_template").map(a => a.name).join(", ") || "ninguna";
    return ui.notifications.error(`No encuentro la plantilla «${PNJ_TEMPLATE}» ni el módulo hojas-pj-ysystem. Plantillas en este mundo: ${tpls}`);
  }

  const leer = (btn, tipo) => ({
    tipo,
    nombre: btn.form.elements.nombre.value.trim(),
    abrir: btn.form.elements.abrir.checked
  });
  const eleccion = await foundry.applications.api.DialogV2.wait({
    window: { title: "Crear PNJ aleatorio", icon: "fa-solid fa-dice" },
    position: { width: 420 },
    content: `
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" name="nombre" placeholder="Vacío = nombre aleatorio">
      </div>
      <div class="form-group">
        <label>Abrir la hoja al crearlo</label>
        <input type="checkbox" name="abrir" checked>
      </div>
      <p style="margin-top:8px">¿Qué tipo de PNJ quieres?</p>`,
    buttons: [
      { action: "fuerte", label: "Enemigo fuerte", icon: "fa-solid fa-hand-fist", default: true, callback: (ev, btn) => leer(btn, "fuerte") },
      { action: "debil", label: "Enemigo débil", icon: "fa-solid fa-person-running", callback: (ev, btn) => leer(btn, "debil") },
      { action: "aliado", label: "Aliado", icon: "fa-solid fa-handshake", callback: (ev, btn) => leer(btn, "aliado") }
    ],
    rejectClose: false
  });
  if (!eleccion?.tipo) return;

  const { name, props } = generarPNJ(eleccion.tipo, eleccion.nombre);
  const tipo = TIPOS[eleccion.tipo];
  const folder = await getFolder();

  const actor = await Actor.create({
    name,
    type: "character",
    folder: folder?.id,
    prototypeToken: {
      name,
      actorLink: tipo.disposition > 0,
      disposition: tipo.disposition,
      displayName: 30
    },
    system: { template: tpl.id, props }
  });
  await actor.reloadTemplate(tpl.id);

  const atr = ["CAR", "DES", "FUE", "INT", "PER"].map((a, i) => `${a} ${props[`val_atr${i + 1}`]}`).join(" · ");
  await ChatMessage.create({
    whisper: ChatMessage.getWhisperRecipients("GM"),
    speaker: { alias: "Crear PNJ" },
    content: `<p><strong>${foundry.utils.escapeHTML(name)}</strong> — ${tipo.etiqueta}</p>
      <p>${foundry.utils.escapeHTML(props.Profesion_pj)}<br>${atr}<br>Salud ${props.Salud_max} · Estabilidad ${props.estabilidad_valor}</p>`
  });
  ui.notifications.info(`PNJ creado: ${name} (${tipo.etiqueta})`);
  if (eleccion.abrir) actor.sheet.render(true);
  return actor;
}

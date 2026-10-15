# Macros de Elena

Módulo de Foundry VTT (v13–v14) que agrupa mis macros de partida para Ysystem (Custom System Builder). Se activa o desactiva por mundo desde *Gestionar módulos*.

## Instalación

En Foundry (o TheForge) → *Instalar módulo* → pega este manifest:

```
https://github.com/egparraga/macros-elena/releases/latest/download/module.json
```

Luego abre el compendio **Macros de Elena** y arrastra las macros a la barra.

## Macros

| Macro | Qué hace |
|---|---|
| Actualizar Proezas | Recalcula proezas máximas: 5 + ⌊(FUE+INT)/2⌋ (solo GM) |
| Defectos | Tabla con defecto leve y grave de cada PJ |
| Datos Personajes | Tabla con todos los atributos |
| Estado PJs (actualizable) | Proezas, salud y estabilidad coloreadas, con botón *Actualizar* |
| Escena rápida | Crea y activa una escena negra 2500×1500 sin cuadrícula y con luz global |
| Crear PNJ | Genera un PNJ aleatorio (enemigo fuerte, enemigo débil o aliado) con la hoja `PNJ_Ysystem_template V2` de [hojas-pj-ysystem](https://github.com/Darokin-rpg/hojas-pj-ysystem); si falta en el mundo la importa del compendio (solo GM) |

Las macros del compendio solo llaman a `game.modules.get("macros-elena").api`; si el módulo está desactivado muestran un aviso.

## Desarrollo

- Lógica: `scripts/main.mjs` (generador de PNJ en `scripts/crear-pnj.mjs`)
- Macros del compendio: `src/packs/macros/*.json`
- Recompilar el compendio (con Foundry parado): `node src/build-pack.mjs` (usa la `classic-level` de `~/foundryvtt`, o `FOUNDRY_DIR=...`)

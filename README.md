# WiseForgeStudio Headquarters

Fase 1 funcional de un headquarters multiagente local-first para coordinar organizaciones de agentes de IA enfocadas en desarrollo de software.

## Alcance de esta fase

- Backend local sin dependencias externas.
- Persistencia local en disco con auditoria y event trail.
- Motor de gobierno con reglas de planning y aprobaciones por riesgo.
- Dashboard ejecutivo, org chart, backlog operativo, approvals, sessions e infrastructure lab.
- Headquarters map 2D estilo pixel-office conectado a datos reales.
- Seed inicial para operar el proyecto interno `HQ Bootstrap`.

## Restricciones respetadas

- No ejecuta tareas sin un plan aprobado.
- Riesgos medios, altos y criticos pasan por su flujo de gobierno.
- Adaptadores de agentes desacoplados por proveedor.
- Costo cero: sin servicios obligatorios ni dependencias de pago.
- Operacion local-first con opcion de companion web en LAN.

## Ejecutar

```bash
npm start
```

Servidor por defecto: `http://localhost:4786`

En Windows tambien puedes usar:

```bash
npm run start:windows
```

o ejecutar directamente:

```bash
start-headquarters.cmd
```

Diagnostico rapido:

```bash
npm run doctor
```

Para companion web en red local:

```bash
node src/server.mjs --host 0.0.0.0 --port 4786
```

## Fases siguientes

1. Adaptadores reales de ejecucion para Codex/Claude/Gemini.
2. Session manager con terminales por agente y control de comandos.
3. Autenticacion local + companion movil endurecido.
4. Persistencia transaccional (SQLite) y colas/event bus dedicados.
5. War room en tiempo real, rollback operativo y automatizacion por politicas.

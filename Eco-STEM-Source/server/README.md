# Eco-STEM Backend

Backend base para conectar el frontend de Eco-STEM con SQL Server, IA, pagos, correo y WhatsApp.

## Pasos

1. Copia `.env.example` a `.env`.
2. Ajusta credenciales de SQL Server y ejecuta `database/EcoStemDB.sql`.
3. Instala dependencias con `npm install`.
4. Inicia con `npm run dev`.

## Endpoints

- `GET /health`
- `GET /api/status`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/analysis/vision`
- `POST /api/analysis/save`
- `POST /api/chat`
- `POST /api/contact`
- `POST /api/subscriptions/purchase`
- `POST /api/iot`
- `POST /api/preferences/cookies`
- `POST /api/preferences/newsletter`

## Produccion

- Reemplaza `PAYMENT_PROVIDER=demo` por una pasarela real.
- Configura `OPENAI_API_KEY` para chat y vision.
- Configura SMTP real para notificaciones por correo.
- Cambia el servicio WhatsApp demo por Twilio u otro proveedor.

## Estado del sistema

Consulta `GET /api/status` para verificar si:

- SQL Server esta conectado.
- OpenAI esta configurado.
- SMTP esta listo.
- el proveedor de pagos esta en `demo` o real.
- el proveedor de WhatsApp esta en `demo` o real.

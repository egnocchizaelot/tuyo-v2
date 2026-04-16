# Tuyo v2

Plataforma colaborativa de donaciones — Tuyo.uy

## Estructura del proyecto

```
tuyo-v2/
├── api/                            # Backend nuevo — Tuyo v2
├── web/                            # Frontend nuevo — Tuyo v2
├── legacy/                         # Código existente de Tuyo v1
│   ├── api/                        # Backend — Django REST Framework + PostgreSQL
│   │   └── ab.config
│   ├── web/                        # Frontend — AngularJS 1.x SPA
│   │   └── ab.config
│   └── functions/                  # Cloud functions — emails y notificaciones
│       └── ab.config
└── specs/                          # Specs para el Abstract Architect pipeline
```

## Architect

Este proyecto está estructurado para ser procesado por Abstract Architect. Cada sub-proyecto legacy (`legacy/web/`, `legacy/api/`, `legacy/functions/`) tiene su propio `ab.config` con la configuración del stack.

Para correr el pipeline:

```bash
python architect/main.py /path/to/tuyo-v2 --auto
```

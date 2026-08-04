# Prerequisites

# Setup 

# Start

## Frontend

To start the frontend run the following command:
```bash
cd frontend
npm run dev
```

## Backend 

To start the backend run the following command:
```bash
cd backend
poetry run flask \
    --app vulniverse_api \
    run \
    --debug
```

# Structure

The idea is to have a standalone web application to edit vulnerability records which can be exported and embedded into [Vulnerability-Lookup](https://github.com/vulnerability-lookup/vulnerability-lookup)

```
Vulniverse
├── Vue 3 editor
│   ├── standalone web application
│   └── embeddable <vulniverse-editor>
│
└── Flask backend
    ├── standalone record storage
    ├── schema validation
    ├── CPE Editor proxy
    └── external publication integrations
```

# Build Embeddable Editor

```bash
cd frontend
npm run build:element
```

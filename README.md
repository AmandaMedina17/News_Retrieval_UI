# News Retrieval UI

Interfaz de usuario para el sistema de recuperación de noticias. 

## 📋 Requisitos previos

- **Node.js** (versión 18 o superior) y **npm** (para ejecución local)
- **Docker** y **Docker Compose** (para ejecución containerizada)

## 🔧 Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/AmandaMedina17/News_Retrieval_UI.git
cd News_Retrieval_UI
```

### 2. Configurar variables de entorno
Copia el archivo de ejemplo y, si es necesario, modifica los valores:

```bash
cp .env.example .env
```

Las variables disponibles son:

- VITE_BACKEND_URL: URL del backend (por defecto http://localhost:8000)

- VITE_FRONTEND_PORT: puerto del frontend (por defecto 5173)

- VITE_SEARCH_LIMIT: número de resultados por búsqueda (por defecto 9)

## 🚀 Ejecución

La aplicación estará disponible en http://localhost:5173 (o el puerto definido en VITE_FRONTEND_PORT). 

### Opción 1: Con npm (recomendado)

```bash
npm install
npm run dev
```

### Opción 2: Con Docker Compose

Construye y levanta el contenedor:

```bash
docker compose up --build
```
El código fuente se monta como volumen, por lo que los cambios locales se reflejarán automáticamente (hot‑reload).

## 🔗 Comunicación con el backend
El frontend se conecta al backend usando la URL definida en VITE_BACKEND_URL. Por defecto es http://localhost:8000. Si el backend corre en un puerto diferente, ajusta esta variable.

El backend del sistema está disponible en el siguiente repositorio:
- [News Retrieval System](https://github.com/Bazan49/News_Retrieval_System)
#  SmartTravel - Aplicación de Planificación de Viajes

<p align="center">
  <img src="https://img.shields.io/badge/Flask-Python-blue?style=for-the-badge&logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-yellow?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

## 📋 Descripción del Proyecto

**SmartTravel** es una aplicación web moderna de planificación de viajes que permite a los usuarios explorar destinos turísticos de todo el mundo. La aplicación proporciona información en tiempo real sobre el clima, lugares de interés turístico, hoteles, videos relacionados y un asistente virtual potenciado por inteligencia artificial.

<img width="1919" height="977" alt="image" src="https://github.com/user-attachments/assets/d8c0d47a-5335-4aa4-be55-07d6e650c748" />

### ✨ Características Principales

<img width="1919" height="805" alt="image" src="https://github.com/user-attachments/assets/6650f166-76e2-42b7-8209-24d2ad8baf13" />
<img width="1918" height="1076" alt="image" src="https://github.com/user-attachments/assets/20e704ca-045a-4fa9-b283-bebe080189a6" />
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/af7dc4eb-60e6-4882-a7a0-8494faaae53d" />


- 🔍 **Búsqueda de Destinos**: Explora cualquier ciudad o lugar del mundo
- 🌤️ **Clima en Tiempo Real**: Consulta el clima actual y pronóstico de 14 días
- 🗺️ **Mapas Interactivos**: Visualiza lugares turísticos y hoteles en un mapa
- 🏨 **Búsqueda de Hoteles**: Encuentra hoteles con precios, calificación y amenidades
- 🎥 **Videos de YouTube**: Mira videos promocionales del destino
- 💬 **Asistente Virtual (AI)**: Chatbot potenciado por Google Gemini para recomendaciones de viaje
- 📱 **Diseño Responsivo**: Compatible con dispositivos móviles y escritorio

---

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/23609b9a-a944-4945-8fd5-2f52f4cfe4ca" />
<img width="1919" height="936" alt="image" src="https://github.com/user-attachments/assets/e6f6a7fe-eed3-4079-a66d-fe9893ba7d77" />
<img width="1918" height="896" alt="image" src="https://github.com/user-attachments/assets/77968729-86ba-45ab-b976-6da0820829cc" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/62168a27-382a-491f-96db-67bb401ed0ab" />
<img width="1919" height="1074" alt="image" src="https://github.com/user-attachments/assets/e540e9a5-2510-468b-a90a-0efdddfb8459" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/faf46096-f140-4d25-88d9-b3904af1d604" />
<img width="1919" height="1078" alt="image" src="https://github.com/user-attachments/assets/f0f2dc26-882c-410a-a297-f5eb22c7cf42" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/adadd906-df3f-43cd-b658-6bff1f79c152" />
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/94c2cd88-2918-4c2c-8fe4-d61a6a9ee1cf" />
<img width="1919" height="1077" alt="image" src="https://github.com/user-attachments/assets/6ae90154-df5c-4c95-8b08-ef8d44618521" />
<img width="1919" height="1076" alt="image" src="https://github.com/user-attachments/assets/9b6784d3-9fde-4219-8ae9-205fded15b0e" />



## 🏗️ Estructura del Proyecto

```
PaginaTresApi/
├── app.py                      # Aplicación principal Flask
├── README.md                   # Documentación del proyecto
├── templates/                  # Plantillas HTML
│   ├── base.html              # Plantilla base
│   ├── index.html             # Página de inicio
│   └── buscar.html             # Página de búsqueda de destinos
└── static/                     # Archivos estáticos
    ├── css/
    │   └── style.css          # Estilos CSS
    └── js/
        ├── buscar.js          # Lógica de búsqueda y resultados
        ├── chatbot.js         # Funcionalidad del chatbot
        └── menu.js            # Menú de navegación
```

---

## 🔌 APIs Utilizadas

La aplicación integra múltiples APIs para proporcionar información completa sobre los destinos:

### 1. WeatherAPI
|属性|Descripción|
|---|---|
| **API** | [WeatherAPI.com](https://www.weatherapi.com/) |
| **Uso** | Datos meteorológicos actuales y pronóstico de 14 días |
| **Endpoints** | `/api/clima/<ciudad>`, `/api/clima/forecast/<ciudad>` |
| **Datos Obtenidos** | Temperatura, humedad, viento, condiciones climáticas, icono del clima |

### 2. Geoapify
|属性|Descripción|
|---|---|
| **API** | [Geoapify Places API](https://www.geoapify.com/places-api) |
| **Uso** | Geocodificación y búsqueda de lugares de interés |
| **Endpoints** | Geocoding: `https://api.geoapify.com/v1/geocode/search` |
| | Places: `https://api.geoapify.com/v2/places` |
| **Categorías** | turismo, hoteles, restaurantes, museos, entretenimiento |
| **Datos Obtenidos** | Coordenadas, nombres, direcciones, categorías de lugares |

### 3. YouTube Data API
|属性|Descripción|
|---|---|
| **API** | [Google YouTube Data API v3](https://developers.google.com/youtube/v3) |
| **Uso** | Videos promocionales y comentarios |
| **Endpoints** | Search: `https://www.googleapis.com/youtube/v3/search` |
| | Comments: `https://www.googleapis.com/youtube/v3/commentThreads` |
| **Datos Obtenidos** | Título, thumbnail, video ID, comentarios |

### 4. Google Gemini API
|属性|Descripción|
|---|---|
| **API** | [Google Generative Language API](https://ai.google.dev/) |
| **Uso** | Asistente virtual de viajes con IA |
| **Endpoint** | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` |
| **Modelo** | Gemini 2.5 Flash |
| **Función** | Responder preguntas sobre viajes, recomendaciones de destinos |

### 5. Wikipedia API
|属性|Descripción|
|---|---|
| **API** | [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) |
| **Uso** | Información general e imágenes de destinos |
| **Endpoints** | Search: `https://es.wikipedia.org/w/api.php` |
| | Summary: `https://es.wikipedia.org/api/rest_v1/page/summary/{title}` |
| **Datos Obtenidos** | Resumen histórico, título, miniaturas/imágenes |

### 6. Hotels API
|属性|Descripción|
|---|---|
| **API** | [Hotels-API.com](https://hotels-api.com/) |
| **Uso** | Búsqueda de hoteles disponibles |
| **Endpoint** | `https://api.hotels-api.com/v1/hotels/search` |
| **Datos Obtenidos** | Nombre, dirección, calificación, precio, amenidades, contacto |

---

## 🚀 Endpoints de la API

### Rutas Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Página de inicio |
| GET | `/buscar` | Página de búsqueda de destinos |

### Endpoints de Datos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/clima/<ciudad>` | Obtiene el clima actual de una ciudad |
| GET | `/api/clima/forecast/<ciudad>` | Obtiene el pronóstico de 14 días |
| GET | `/api/destino?q=<nombre>` | Obtiene información completa de un destino |
| POST | `/api/chatbot` | Envía mensaje al asistente de IA |
| GET | `/api/youtube/comments/<video_id>` | Obtiene comentarios de un video |

---

## 💻 Instalación y Ejecución

### Prerrequisitos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### 1. Clonar el Repositorio

```
bash
git clone <url-del-repositorio>
cd PaginaTresApi
```

### 2. Crear un Entorno Virtual (Recomendado)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```
bash
pip install flask flask-socketio requests
```



### 4. Ejecutar la Aplicación

```
bash
python app.py
```

La aplicación estará disponible en: `http://localhost:5000`

---

## 🎨 Tecnologías y Dependencias

### Backend
- **Flask** - Framework web ligeroask-SocketIO
- **Fl** - Comunicación en tiempo real
- **Requests** - Cliente HTTP para APIs externas

### Frontend
- **HTML5** - Estructura de páginas
- **CSS3** - Estilos y diseño responsivo
- **JavaScript (ES6+)** - Interactividad del cliente
- **Font Awesome 6.4** - Iconos
- **Leaflet.js** - Mapas interactivos

### APIs Externas
- WeatherAPI.com
- Geoapify
- Google YouTube Data API
- Google Gemini AI
- Wikipedia MediaWiki API
- Hotels-API.com

---

## 📱 Diseño Responsivo

La aplicación está diseñada para funcionar en diferentes tamaños de pantalla:

| Dispositivo | Ancho | Características |
|-------------|-------|-----------------|
| Móvil | < 768px | Menú hamburguesa, diseño vertical |
| Tablet | 768px - 1024px | Layout adaptativo |
| Desktop | > 1024px | Diseño completo con paneles |

---

## 🔧 Funcionalidades del Frontend

### Página de Inicio (`index.html`)
- Carrusel de imágenes hero
- Sección de funcionalidades
- Información del creador
- Estadísticas sobre viajes
- Botón de llamada a la acción

### Página de Búsqueda (`buscar.html`)
- Campo de búsqueda con sugerencias
- Resultados dinámicos:
  - Imágenes del destino (carrusel)
  - Descripción de Wikipedia
  - Pronóstico del clima (14 días)
  - Hoteles disponibles
  - Lugares turísticos
  - Videos de YouTube
- Mapas interactivos con Leaflet
- Reproductor de video con comentarios
- Chatbot flotante

### Chatbot (`chatbot.js`)
- Interfaz de chat flotante
- Integración con Google Gemini
- Mensajes en tiempo real
- Indicador de escritura

---

## 👨‍💻 Creador

**César Fernando González Avalos**

Desarrollador web apasionado por crear aplicaciones dedicadas a la planificación de viajes con información en tiempo real y de calidad.

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/09488914-97b9-47fe-a73a-abd8f8390ede" />




---



<div align="center">

⭐️ ¡Explora el mundo con SmartTravel! ⭐️

</div>

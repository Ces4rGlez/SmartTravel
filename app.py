from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import requests

HEADERS = {
    "User-Agent": "SmartTravelApp/1.0 (oscar@example.com)"
}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

WEATHER_API_KEY = '5d59724dcc154ee7a4423953261502'
GEOAPIFY_API_KEY = '4afde1db85ac452e99ff785b0b6c3d93'
YOUTUBE_API_KEY = 'AIzaSyDfWxQpxDxD_VSAiFFyE4YwVjZ9Zgd2Euk'
GEMINI_API_KEY = 'AIzaSyDdlh9qqcA2bOluQuReCuK8-NveFeWboqM' #M

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/buscar')
def buscar():
    return render_template('buscar.html')

@app.route('/api/clima/<ciudad>')
def get_clima(ciudad):
    url = f"https://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={ciudad}&lang=es"
    try:
        response = requests.get(url)
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/clima/forecast/<ciudad>')
def get_clima_forecast(ciudad):
    url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={ciudad}&days=14&lang=es"
    try:
        response = requests.get(url)
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def obtener_info_wikipedia(nombre):
    try:
        search_url = "https://es.wikipedia.org/w/api.php"
        params = {
            "action": "query",
            "list": "search",
            "srsearch": nombre,
            "format": "json"
        }

        search_res = requests.get(search_url, params=params, headers=HEADERS).json()

        if not search_res.get("query", {}).get("search"):
            return None

        titulo = search_res["query"]["search"][0]["title"]

        summary_url = f"https://es.wikipedia.org/api/rest_v1/page/summary/{titulo}"
        res = requests.get(summary_url, headers=HEADERS)

        if res.status_code != 200:
            return None

        data = res.json()

        return {
            "resumen": data.get("extract"),
            "titulo": data.get("title"),
            "imagen": data.get("thumbnail", {}).get("source") if data.get("thumbnail") else None
        }

    except Exception as e:
        print("Error Wikipedia:", e)
        return None

def obtener_imagenes(nombre):
    try:
        search_url = "https://es.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": nombre,
            "format": "json"
        }

        search_res = requests.get(search_url, params=search_params, headers=HEADERS).json()

        if not search_res.get("query", {}).get("search"):
            return []

        titulo = search_res["query"]["search"][0]["title"]

        images_url = "https://es.wikipedia.org/w/api.php"
        images_params = {
            "action": "query",
            "titles": titulo,
            "prop": "images",
            "format": "json"
        }

        images_res = requests.get(images_url, params=images_params, headers=HEADERS).json()
        pages = images_res.get("query", {}).get("pages", {})
        imagenes = []

        for page in pages.values():
            for img in page.get("images", []):
                nombre_img = img["title"]

                if nombre_img.lower().endswith((".jpg", ".jpeg", ".png")):
                    file_url = "https://es.wikipedia.org/w/api.php"
                    file_params = {
                        "action": "query",
                        "titles": nombre_img,
                        "prop": "imageinfo",
                        "iiprop": "url",
                        "format": "json"
                    }

                    file_res = requests.get(file_url, params=file_params, headers=HEADERS).json()
                    file_pages = file_res.get("query", {}).get("pages", {})

                    for fpage in file_pages.values():
                        info = fpage.get("imageinfo")
                        if info:
                            imagenes.append(info[0]["url"])

                if len(imagenes) >= 5:
                    break

        return imagenes[:5]

    except Exception as e:
        print("Error imágenes:", e)
        return []

def obtener_lugares_con_coords(lon, lat):
    try:
        if not lon or not lat:
            return []
        
        places_url = "https://api.geoapify.com/v2/places"
        places_params = {
            "categories": "tourism.attraction,tourism.sights,accommodation.hotel,entertainment.museum,catering.restaurant",
            "filter": f"circle:{lon},{lat},10000",
            "limit": 20,
            "apiKey": GEOAPIFY_API_KEY
        }

        places_res = requests.get(places_url, params=places_params).json()

        lugares = []
        for f in places_res.get("features", []):
            p = f["properties"]
            lugares.append({
                "nombre": p.get("name", "Sin nombre"),
                "direccion": p.get("formatted", "Dirección no disponible"),
                "categoria": p.get("categories", []),
                "lat": f["geometry"]["coordinates"][1],
                "lon": f["geometry"]["coordinates"][0]
            })

        print(f"Lugares encontrados: {len(lugares)}")
        return lugares
    except Exception as e:
        print("Error obtener_lugares_con_coords:", e)
        return []

def obtener_hoteles_con_coords(nombre, lon, lat):
    try:
        if not lon or not lat:
            return []
        
        # Buscamos hoteles usando Hotels-API
        hotels_url = "https://api.hotels-api.com/v1/hotels/search"
        hotels_headers = {
            "X-API-KEY": "5546fcc8d1253a0ed4564206b040d65f4124b949e4f16caaab7b14a0229ff20b",
            "Content-Type": "application/json"
        }
        
        hotels_params = {
            "city": nombre,
            "limit": 15
        }
        
        hotels_res = requests.get(hotels_url, headers=hotels_headers, params=hotels_params)
        
        if hotels_res.status_code != 200:
            print(f"Error Hotels API: {hotels_res.status_code} - {hotels_res.text}")
            return []
        
        data = hotels_res.json()
        
        hoteles = []
        for hotel in data.get("data", []):
            hoteles.append({
                "nombre": hotel.get("name", "Hotel sin nombre"),
                "direccion": hotel.get("address", "Dirección no disponible"),
                "calificacion": float(hotel.get("rating", 0)) if hotel.get("rating") else 0,
                "precio": hotel.get("price", {}).get("amount", "N/A"),
                "moneda": hotel.get("price", {}).get("currency", ""),
                "descripcion": hotel.get("description", ""),
                "amenidades": hotel.get("amenities", []),
                "lat": float(hotel.get("latitude", lat)) if hotel.get("latitude") else lat,
                "lon": float(hotel.get("longitude", lon)) if hotel.get("longitude") else lon,
                "telefono": hotel.get("phone", ""),
                "sitio_web": hotel.get("website", "")
            })
        
        print(f"Hoteles encontrados: {len(hoteles)}")
        return hoteles
    except Exception as e:
        print("Error obtener_hoteles_con_coords:", e)
        return []



def obtener_videos_youtube(nombre):
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": f"{nombre} turismo viaje",
            "key": YOUTUBE_API_KEY,
            "type": "video",
            "maxResults": 6,
            "order": "relevance"
        }

        response = requests.get(url, params=params)
        data = response.json()

        videos = []
        for item in data.get("items", []):
            videos.append({
                "id": item["id"]["videoId"],
                "titulo": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
            })

        return videos
    except Exception as e:
        print("Error YouTube:", e)
        return []

@app.route("/api/youtube/comments/<video_id>")
def obtener_comentarios_youtube(video_id):
    try:
        url = "https://www.googleapis.com/youtube/v3/commentThreads"
        params = {
            "part": "snippet",
            "videoId": video_id,
            "key": YOUTUBE_API_KEY,
            "maxResults": 10,
            "order": "relevance"
        }

        response = requests.get(url, params=params)
        data = response.json()

        comentarios = []
        for item in data.get("items", []):
            comment = item["snippet"]["topLevelComment"]["snippet"]
            comentarios.append({
                "autor": comment["authorDisplayName"],
                "texto": comment["textDisplay"],
                "fecha": comment["publishedAt"],
                "likes": comment["likeCount"]
            })

        return jsonify({"comentarios": comentarios})
    except Exception as e:
        print("Error comentarios YouTube:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/destino")
def destino():
    nombre = request.args.get("q")
    if not nombre:
        return jsonify({"error": "Falta parámetro"}), 400

    print(f"\n=== BUSCANDO: {nombre} ===")
    
    # PRIMERO: Obtener coordenadas UNA SOLA VEZ
    coordenadas = None
    lon = None
    lat = None
    
    try:
        geo_url = "https://api.geoapify.com/v1/geocode/search"
        geo_params = {
            "text": nombre,
            "apiKey": GEOAPIFY_API_KEY,
            "limit": 1
        }
        geo_res = requests.get(geo_url, params=geo_params, headers=HEADERS).json()
        if geo_res.get("features"):
            coords = geo_res["features"][0]["geometry"]["coordinates"]
            lon, lat = coords
            coordenadas = {"lat": lat, "lon": lon}
    except Exception as e:
        print(f"Error obteniendo coordenadas: {e}")
    
    # SEGUNDO: Obtener datos con las coordenadas
    wiki = obtener_info_wikipedia(nombre)
    imagenes = obtener_imagenes(nombre)
    videos = obtener_videos_youtube(nombre)
    
    # TERCERO: Obtener lugares y hoteles CON las coordenadas obtenidas
    lugares = obtener_lugares_con_coords(lon, lat) if lon and lat else []
    hoteles = obtener_hoteles_con_coords(nombre, lon, lat) if lon and lat else []

    print(f"Resultado: lugares={len(lugares)}, hoteles={len(hoteles)}")
    
    resultado = {
        "wikipedia": wiki,
        "imagenes": imagenes,
        "lugares": lugares,
        "videos": videos,
        "hoteles": hoteles,
        "coordenadas": coordenadas
    }
    
    return jsonify(resultado)


@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    try:
        data = request.json
        if not data or "mensaje" not in data:
            return jsonify({"respuesta": "Cuerpo de solicitud inválido"}), 400
            
        mensaje = data.get("mensaje", "")
        
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY.strip()}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": f"Eres un asistente de viajes. Responde en español. Usuario: {mensaje}"
                }]
            }]
        }
        
        response = requests.post(url, json=payload)
        result = response.json()

        # ESTO IMPRIMIRÁ EL ERROR REAL EN TU TERMINAL
        if response.status_code != 200:
            print("--- ERROR DE GOOGLE API ---")
            print(result) 
            return jsonify({"respuesta": f"Error de API: {result.get('error', {}).get('message', 'Desconocido')}"}), response.status_code

        # Validar si Google bloqueó la respuesta por seguridad
        if "candidates" in result and result["candidates"]:
            candidate = result["candidates"][0]
            if "content" in candidate:
                respuesta = candidate["content"]["parts"][0]["text"]
                return jsonify({"respuesta": respuesta})
            else:
                return jsonify({"respuesta": "Google bloqueó la respuesta por políticas de seguridad."})
        
        return jsonify({"respuesta": "No recibí candidatos de respuesta."}), 500
            
    except Exception as e:
        print("--- ERROR INTERNO DEL SERVIDOR ---")
        print(str(e))
        return jsonify({"respuesta": "Error crítico en el servidor."}), 500

@socketio.on('connect')
def handle_connect():
    emit('weather_update', {'message': 'Conectado al servidor'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Cliente desconectado')

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)

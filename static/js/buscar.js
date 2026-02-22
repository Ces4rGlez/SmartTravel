let map = null;
let markers = [];
let mapaActivo = false;
let carouselAutoPlay = null;
function toggleSearchPanel() {
    const layout = document.getElementById('buscar-layout');
    const searchHeader = document.getElementById('search-header');
    const btnToggle = document.getElementById('btn-toggle-search');
    const resultsArea = document.getElementById('results-area');
    
    searchHeader.classList.toggle('collapsed');
    layout.classList.toggle('fullscreen');
    
    if (layout.classList.contains('fullscreen')) {
        btnToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
        btnToggle.style.left = '0';
        resultsArea.style.gridColumn = '1 / -1';
    } else {
        btnToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        resultsArea.style.gridColumn = 'auto';
    }
}

function closeMobileSearch() {
    const searchHeader = document.getElementById('search-header');
    searchHeader.classList.remove('active');
}


async function buscarDestino(e) {
    e.preventDefault();
    const destino = document.getElementById('destino').value;
    const resultados = document.getElementById('resultados');
    
    resultados.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Explorando ${destino}...</p>
        </div>
    `;
    
    try {
        const [dataDestino, dataClima] = await Promise.all([
            fetch(`/api/destino?q=${encodeURIComponent(destino)}`).then(r => r.json()),
            fetch(`/api/clima/forecast/${encodeURIComponent(destino)}`).then(r => r.json())
        ]);
        
        if (!dataDestino) {
            throw new Error('No se encontró información del destino');
        }
        
        mostrarResultados(destino, dataDestino, dataClima);
    } catch (error) {
        console.error("Error:", error);
        resultados.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>No pudimos encontrar información</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function mostrarResultados(nombreDestino, data, dataClima) {
    const resultados = document.getElementById('resultados');
    let html = '';

    if (data.imagenes && data.imagenes.length > 0 && data.wikipedia) {
        html += `
            <section class="imagenes-hero">
                <div class="imagenes-carousel-bg">
                    <div class="carousel-bg-track" id="carousel-bg-track">
                        ${data.imagenes.map((img, idx) => `
                            <div class="carousel-bg-item ${idx === 0 ? 'active' : ''}">
                                <img src="${img}" alt="Imagen ${idx + 1}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="hero-info-overlay">
                        <div class="hero-info-content">
                            <h1>${data.wikipedia.titulo || nombreDestino}</h1>
                        </div>
                    </div>
                    <div class="carousel-controls">
                        <button class="carousel-control-btn" onclick="moverCarouselBg(-1)">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-control-btn" onclick="moverCarouselBg(1)">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>
            <section class="descripcion-destino">
  <div class="descripcion-inner">
    <div class="descripcion-deco">
      <span class="deco-line"></span>
      <span class="deco-icon">✦</span>
      <span class="deco-line"></span>
    </div>
    <blockquote class="descripcion-texto">
      <p>${data.wikipedia.resumen || 'Información no disponible'}</p>
    </blockquote>
    <div class="descripcion-footer">
      <span class="descripcion-source">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        Fuente: Wikipedia
      </span>
    </div>
  </div>
</section>
        `;
    }

    html += `
        <div class="mapa-trigger">
            <button class="btn-ver-mapa" onclick="abrirMapa(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                <i class="fas fa-map-location-dot"></i>
                <span>Ver Mapa Interactivo</span>
            </button>
        </div>
    `;

    if (dataClima && dataClima.forecast) {
        const forecast = dataClima.forecast.forecastday;
        html += `
            <section class="resultado-seccion clima-seccion">
                <div class="seccion-header">
                    <h2><i class="fas fa-cloud-sun"></i> Pronóstico del Clima (14 días)</h2>
                </div>
                <div class="clima-actual-banner">
                    <div class="clima-main">
                        <div class="clima-icon-large">
                            <img src="${dataClima.current.condition.icon}" alt="${dataClima.current.condition.text}">
                        </div>
                        <div class="clima-temp-main">
                            <span class="temp-number">${Math.round(dataClima.current.temp_c)}</span>
                            <span class="temp-unit">°C</span>
                        </div>
                    </div>
                    <div class="clima-detalles-main">
                        <h3>${dataClima.current.condition.text}</h3>
                        <div class="clima-stats">
                            <div class="stat-item">
                                <i class="fas fa-water"></i>
                                <span>Humedad: ${dataClima.current.humidity}%</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-wind"></i>
                                <span>Viento: ${dataClima.current.wind_kph} km/h</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-eye"></i>
                                <span>Visibilidad: ${dataClima.current.vis_km} km</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="forecast-grid">
                    ${forecast.map(day => `
                        <div class="forecast-card">
                            <div class="forecast-date">${new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="forecast-icon">
                            <div class="forecast-temp">
                                <span class="temp-max">${Math.round(day.day.maxtemp_c)}°</span>
                                <span class="temp-min">${Math.round(day.day.mintemp_c)}°</span>
                            </div>
                            <div class="forecast-condition">${day.day.condition.text}</div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    if (data.hoteles && Array.isArray(data.hoteles) && data.hoteles.length > 0) {
        html += `
            <section class="resultado-seccion hoteles-seccion">
                <div class="seccion-header">
                    <h2><i class="fas fa-bed"></i> Hoteles Disponibles (${data.hoteles.length})</h2>
                </div>
                <div class="hoteles-grid">
                    ${data.hoteles.map(hotel => {
                        const estrellas = '⭐'.repeat(Math.round(hotel.calificacion || 0));
                        const precio = hotel.precio !== "N/A" ? `${hotel.precio} ${hotel.moneda}` : 'Consultar precio';
                        
                        return `
                            <div class="hotel-card">
                                <div class="hotel-content">
                                    <h3>${hotel.nombre}</h3>
                                    <div class="hotel-rating">
                                        ${estrellas} 
                                        <span class="rating-number">${hotel.calificacion}/5</span>
                                    </div>
                                    <p class="hotel-direccion">
                                        <i class="fas fa-location-dot"></i> 
                                        ${hotel.direccion}
                                    </p>
                                    ${hotel.descripcion ? `<p class="hotel-descripcion">${hotel.descripcion.substring(0, 150)}...</p>` : ''}
                                    <div class="hotel-precio-box">
                                        <span class="precio-label">Desde</span>
                                        <span class="precio-valor">${precio}</span>
                                    </div>
                                    ${hotel.amenidades && hotel.amenidades.length > 0 ? `
                                        <div class="hotel-amenidades">
                                            ${hotel.amenidades.slice(0, 4).map(amenidad => 
                                                `<span class="amenidad"><i class="fas fa-check"></i> ${amenidad}</span>`
                                            ).join('')}
                                        </div>
                                    ` : ''}
                                    <div class="hotel-actions">
                                        ${hotel.telefono ? `<a href="tel:${hotel.telefono}" class="btn-hotel-action"><i class="fas fa-phone"></i></a>` : ''}
                                        ${hotel.sitio_web ? `<a href="${hotel.sitio_web}" target="_blank" class="btn-hotel-action btn-hotel-primary">Ver más</a>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    if (data.lugares && Array.isArray(data.lugares) && data.lugares.length > 0) {
        html += `
            <section class="resultado-seccion lugares-seccion">
                <div class="seccion-header">
                    <h2><i class="fas fa-map-marked-alt"></i> Lugares Turísticos y Atractivos (${data.lugares.length})</h2>
                </div>
                <div class="lugares-grid">
                    ${data.lugares.slice(0, 12).map(lugar => `
                        <div class="lugar-card">
                            <div class="lugar-icon">
                                ${lugar.categoria.includes('tourism') ? '<i class="fas fa-landmark"></i>' :
                                  lugar.categoria.includes('museum') ? '<i class="fas fa-university"></i>' :
                                  lugar.categoria.includes('restaurant') ? '<i class="fas fa-utensils"></i>' :
                                  lugar.categoria.includes('entertainment') ? '<i class="fas fa-theater-masks"></i>' :
                                  '<i class="fas fa-map-pin"></i>'}
                            </div>
                            <div class="lugar-info">
                                <h3>${lugar.nombre}</h3>
                                <p class="lugar-direccion">
                                    <i class="fas fa-location-dot"></i>
                                    ${lugar.direccion}
                                </p>
                                ${lugar.categoria.length > 0 ? `
                                    <div class="lugar-tags">
                                        ${lugar.categoria.slice(0, 2).map(cat => 
                                            `<span class="tag">${cat.split('.')[1] || cat}</span>`
                                        ).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    if (data.videos && data.videos.length > 0) {
        html += `
            <section class="resultado-seccion videos-seccion">
                <div class="seccion-header">
                    <h2><i class="fas fa-video"></i> Videos del Destino</h2>
                </div>
                <div class="videos-grid-custom">
                    ${data.videos.map(video => `
                        <div class="video-card-custom" data-video-id="${video.id}">
                            <div class="video-thumbnail">
                                <img src="${video.thumbnail}" alt="${video.titulo}">
                                <div class="video-overlay" onclick="abrirVideoModal('${video.id}', '${video.titulo.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-play-circle"></i>
                                </div>
                            </div>
                            <div class="video-info">
                                <h4>${video.titulo}</h4>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }
    
    resultados.innerHTML = html;
    resultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    iniciarAutoPlayCarousel();
}

let currentBgSlide = 0;

function moverCarouselBg(direccion) {
    const track = document.getElementById('carousel-bg-track');
    if (!track) return;
    
    const items = track.querySelectorAll('.carousel-bg-item');
    if (items.length === 0) return;
    
    items[currentBgSlide].classList.remove('active');
    currentBgSlide = (currentBgSlide + direccion + items.length) % items.length;
    items[currentBgSlide].classList.add('active');
    
    iniciarAutoPlayCarousel();
}

function iniciarAutoPlayCarousel() {
    if (carouselAutoPlay) {
        clearInterval(carouselAutoPlay);
    }
    
    carouselAutoPlay = setInterval(() => {
        const track = document.getElementById('carousel-bg-track');
        if (!track) {
            clearInterval(carouselAutoPlay);
            return;
        }
        
        const items = track.querySelectorAll('.carousel-bg-item');
        if (items.length === 0) {
            clearInterval(carouselAutoPlay);
            return;
        }
        
        items[currentBgSlide].classList.remove('active');
        currentBgSlide = (currentBgSlide + 1) % items.length;
        items[currentBgSlide].classList.add('active');
    }, 5000);
}

function abrirMapa(data) {
    const modal = document.getElementById('mapa-modal');
    modal.classList.add('active');
    
    setTimeout(() => {
        inicializarMapa(data);
    }, 100);
}

function cerrarMapa() {
    const modal = document.getElementById('mapa-modal');
    modal.classList.remove('active');
    if (map) {
        map.remove();
        map = null;
    }
}

function expandirMapa() {
    const content = document.getElementById('mapa-modal-content');
    content.classList.toggle('fullscreen');
}

function inicializarMapa(data) {
    if (!data.coordenadas) {
        console.warn("No hay coordenadas disponibles");
        return;
    }

    if (!map) {
        map = L.map('mapa').setView([data.coordenadas.lat, data.coordenadas.lon], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    } else {
        map.setView([data.coordenadas.lat, data.coordenadas.lon], 12);
        markers.forEach(m => map.removeLayer(m));
        markers = [];
    }

    const mainMarker = L.circleMarker([data.coordenadas.lat, data.coordenadas.lon], {
        radius: 100,
        fillColor: "#f5a9a9",
        color: "#f09090",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map);

    mainMarker.bindPopup(`<b>${data.wikipedia?.titulo || 'Destino'}</b>`);
    markers.push(mainMarker);

    if (data.lugares && Array.isArray(data.lugares) && data.lugares.length > 0) {
        data.lugares.forEach((lugar) => {
            const marker = L.marker([lugar.lat, lugar.lon], {
                title: lugar.nombre
            }).addTo(map);

            marker.bindPopup(`
                <div class="popup-lugar">
                    <h4>${lugar.nombre}</h4>
                    <p>${lugar.direccion}</p>
                    <small>${lugar.categoria.slice(0, 2).join(', ')}</small>
                </div>
            `);

            markers.push(marker);
        });
    }

    if (data.hoteles && Array.isArray(data.hoteles) && data.hoteles.length > 0) {
        data.hoteles.forEach((hotel) => {
            const hotelIcon = L.divIcon({
                className: 'hotel-marker-custom',
                html: '<div style="background: linear-gradient(135deg, #f5a9a9, #f5c2c2); width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(245, 169, 169, 0.5); border: 3px solid white;"><i class="fas fa-bed" style="transform: rotate(45deg); color: #1a1a1a; font-size: 1.2rem;"></i></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            const hotelMarker = L.marker([hotel.lat, hotel.lon], {
                icon: hotelIcon,
                title: hotel.nombre
            }).addTo(map);

            const estrellas = '⭐'.repeat(Math.round(hotel.calificacion || 0));
            const precio = hotel.precio !== "N/A" ? `${hotel.precio} ${hotel.moneda}` : 'Consultar precio';

            hotelMarker.bindPopup(`
                <div class="popup-hotel">
                    ${hotel.imagen ? `<img src="${hotel.imagen}" alt="${hotel.nombre}" class="hotel-popup-img" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">` : ''}
                    <h4>${hotel.nombre}</h4>
                    <div class="hotel-rating">${estrellas} (${hotel.calificacion}/5)</div>
                    <p class="hotel-direccion"><i class="fas fa-location-dot"></i> ${hotel.direccion}</p>
                    <p class="hotel-precio"><i class="fas fa-tag"></i> Desde ${precio}</p>
                    ${hotel.telefono ? `<p class="hotel-telefono"><i class="fas fa-phone"></i> ${hotel.telefono}</p>` : ''}
                    ${hotel.sitio_web ? `<a href="${hotel.sitio_web}" target="_blank" class="hotel-link" style="color: var(--primary);">Visitar sitio web</a>` : ''}
                </div>
            `);

            markers.push(hotelMarker);
        });
    }
}

function abrirVideoModal(videoId, titulo) {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player-container');
    const modalTitulo = document.getElementById('video-modal-titulo');
    
    modalTitulo.textContent = titulo;
    
    // Limpiar contenido previo
    playerContainer.innerHTML = '';
    
    modal.classList.add('active');
    
    // Esperar a que el modal se renderice completamente
    setTimeout(() => {
        playerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                frameborder="0">
            </iframe>
        `;
    }, 100);
    
    cargarComentariosModal(videoId);
}


function cerrarVideoModal() {
    const modal = document.getElementById('video-modal');
    const playerContainer = document.getElementById('video-player-container');
    
    playerContainer.innerHTML = '';
    modal.classList.remove('active');
}

async function cargarComentariosModal(videoId) {
    const comentariosList = document.getElementById('comentarios-modal-lista');
    comentariosList.innerHTML = '<div style="padding: 20px; text-align: center;"><div class="loading-spinner"></div></div>';

    try {
        const response = await fetch(`/api/youtube/comments/${videoId}`);
        const data = await response.json();

        if (data.comentarios && data.comentarios.length > 0) {
            let html = '';
            html += data.comentarios.map(comentario => `
                <div class="comentario-item">
                    <div class="comentario-header">
                        <strong>${comentario.autor}</strong>
                        <span class="comentario-fecha">${new Date(comentario.fecha).toLocaleDateString('es-ES')}</span>
                    </div>
                    <p class="comentario-texto">${comentario.texto}</p>
                    <div class="comentario-likes">
                        <i class="fas fa-thumbs-up"></i> ${comentario.likes}
                    </div>
                </div>
            `).join('');
            comentariosList.innerHTML = html;
        } else {
            comentariosList.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">No hay comentarios disponibles</p>';
        }
    } catch (error) {
        comentariosList.innerHTML = `<p style="padding: 20px; color: var(--error);">Error al cargar comentarios: ${error.message}</p>`;
    }
}

function buscarSugerencia(destino) {
    document.getElementById('destino').value = destino;
    buscarDestino({preventDefault: () => {}});
}

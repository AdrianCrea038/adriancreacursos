// ================================================
// cursos.js - FUNCIONES DE LA PÁGINA DE CURSOS
// ================================================

// Datos desde admin
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
let videos = JSON.parse(localStorage.getItem('videos')) || [];
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Forzar que el admin tenga acceso a todo
let adminEncontrado = usuarios.find(u => u.login === 'adrian');
if (adminEncontrado) {
    adminEncontrado.playlists = ['all'];
} else {
    usuarios.push({
        id: 1,
        nombre: "Adrian Reyes",
        login: "adrian",
        pass: "admin123",
        email: "adrian@adriancreativo.com",
        rol: "admin",
        playlists: ['all']
    });
}
localStorage.setItem('usuarios', JSON.stringify(usuarios));

// Usuario actual
let usuarioActual = null;
try {
    const sesion = sessionStorage.getItem('usuario_actual');
    if (sesion) {
        usuarioActual = JSON.parse(sesion);
        if (usuarioActual.login === 'adrian') {
            usuarioActual.playlists = ['all'];
            sessionStorage.setItem('usuario_actual', JSON.stringify(usuarioActual));
        }
    }
} catch(e) {
    sessionStorage.removeItem('usuario_actual');
}

// ================================================
// FUNCIONES
// ================================================
function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${mensaje}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ================================================
// LOGIN
// ================================================
function abrirModalLogin() {
    document.getElementById('loginModal').classList.add('active');
}

function iniciarSesion() {
    const login = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    
    const usuario = usuarios.find(u => u.login === login && u.pass === pass);
    
    if (usuario) {
        if (usuario.login === 'adrian') {
            usuario.playlists = ['all'];
        }
        
        usuarioActual = usuario;
        sessionStorage.setItem('usuario_actual', JSON.stringify(usuario));
        cerrarModal('loginModal');
        actualizarBoton();
        renderizarContenido();
        mostrarToast(`✅ Bienvenido ${usuario.nombre}`);
    } else {
        alert('❌ Usuario o contraseña incorrectos');
    }
}

function cerrarSesion() {
    usuarioActual = null;
    sessionStorage.removeItem('usuario_actual');
    actualizarBoton();
    renderizarContenido();
    mostrarToast('👋 Sesión cerrada');
}

function actualizarBoton() {
    const btn = document.getElementById('loginBtn');
    if (usuarioActual) {
        btn.innerHTML = `<i class="fas fa-user-check"></i> ${usuarioActual.nombre}`;
        btn.onclick = mostrarMenu;
    } else {
        btn.innerHTML = '<i class="fas fa-user"></i> Iniciar sesión';
        btn.onclick = abrirModalLogin;
    }
}

function mostrarMenu() {
    // Eliminar menú anterior si existe
    const menuExistente = document.querySelector('.user-menu');
    if (menuExistente) menuExistente.remove();

    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <p style="color:#BFFF00; margin-bottom:10px;"><strong>${usuarioActual.nombre}</strong></p>
        <p style="color:rgba(255,255,255,0.5); margin-bottom:15px;">@${usuarioActual.login}</p>
        <button class="btn-logout" onclick="cerrarSesion()">Cerrar sesión</button>
    `;
    document.body.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', function cerrar(e) {
            if (!menu.contains(e.target) && !e.target.closest('#loginBtn')) {
                menu.remove();
                document.removeEventListener('click', cerrar);
            }
        });
    }, 100);
}

// ================================================
// MOSTRAR CONTENIDO
// ================================================
function renderizarContenido() {
    const container = document.getElementById('contenidoPrincipal');
    
    if (!usuarioActual) {
        container.innerHTML = `
            <div class="no-access">
                <i class="fas fa-lock"></i>
                <h3>Inicia sesión para ver tus cursos</h3>
                <button class="btn-login" onclick="abrirModalLogin()">Iniciar sesión</button>
            </div>
        `;
        return;
    }

    let misPlaylists = [];
    if (usuarioActual.playlists) {
        if (usuarioActual.playlists.includes('all')) {
            misPlaylists = playlists;
        } else {
            misPlaylists = playlists.filter(p => 
                usuarioActual.playlists.includes(p.id)
            );
        }
    }

    if (misPlaylists.length === 0) {
        container.innerHTML = `
            <div class="no-access">
                <i class="fas fa-box-open"></i>
                <h3>No tienes cursos asignados</h3>
                <p>Contacta al administrador para obtener acceso</p>
            </div>
        `;
        return;
    }

    let html = '<div class="playlists-grid">';
    
    misPlaylists.forEach(playlist => {
        const videosPlaylist = videos.filter(v => v.playlistId === playlist.id);
        
        let videosHtml = '';
        if (videosPlaylist.length === 0) {
            videosHtml = '<p style="color:rgba(255,255,255,0.3); text-align:center; padding:20px;">Próximamente videos</p>';
        } else {
            videosPlaylist.forEach(video => {
                let thumbnail = video.thumbnail;
                if (!thumbnail && video.tipo === 'youtube') {
                    const match = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                    const videoId = match ? match[1] : '';
                    thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                } else if (!thumbnail) {
                    thumbnail = 'https://images.unsplash.com/photo-1574717024453-354056af4e7f?w=320&h=180&fit=crop';
                }
                
                videosHtml += `
                    <div class="video-item" onclick="reproducirVideo('${video.id}')">
                        <div class="video-thumbnail">
                            <img src="${thumbnail}" alt="${video.titulo}">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="video-info">
                            <h4>${video.titulo}</h4>
                            <div class="video-meta">
                                <span><i class="fas fa-clock"></i> ${video.duracion || '—'}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        html += `
            <div class="playlist-card">
                <div class="playlist-image">
                    ${playlist.imagen ? 
                        `<img src="${playlist.imagen}" alt="${playlist.nombre}">` : 
                        `<i class="fas fa-image"></i>`
                    }
                </div>
                <div class="playlist-header">
                    <h3>${playlist.nombre || 'Sin nombre'}</h3>
                    <p>${playlist.descripcion || ''}</p>
                    <div class="playlist-meta">
                        <span><i class="fas fa-video"></i> ${videosPlaylist.length} videos</span>
                    </div>
                </div>
                <div class="video-list">
                    ${videosHtml}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// ================================================
// REPRODUCIR VIDEO
// ================================================
function reproducirVideo(videoId) {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const container = document.getElementById('videoPlayerContainer');
    const titleEl = document.getElementById('currentVideoTitle');

    if (video.tipo === 'youtube') {
        const match = video.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const videoId = match ? match[1] : '';
        container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    } else if (video.tipo === 'vimeo') {
        const match = video.url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
        const videoId = match ? match[1] : '';
        container.innerHTML = `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    } else if (video.tipo === 'cloudinary') {
        container.innerHTML = `<video src="${video.url}" controls autoplay style="width:100%;height:100%;"></video>`;
    }

    titleEl.textContent = video.titulo;
    document.getElementById('videoPlayerModal').classList.add('active');
}

function cerrarVideoPlayer() {
    document.getElementById('videoPlayerModal').classList.remove('active');
    document.getElementById('videoPlayerContainer').innerHTML = '';
}

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarBoton();
    renderizarContenido();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Hacer funciones globales
    window.abrirModalLogin = abrirModalLogin;
    window.iniciarSesion = iniciarSesion;
    window.cerrarSesion = cerrarSesion;
    window.reproducirVideo = reproducirVideo;
    window.cerrarVideoPlayer = cerrarVideoPlayer;
    window.cerrarModal = cerrarModal;
});
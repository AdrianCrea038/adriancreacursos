// ====================
// Datos en localStorage - Adiran Reyes Crea
// ====================
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || {
        "admin": {
            password: "admin123",
            role: "admin",
            name: "Adiran Reyes",
            permisos: { cursos: true }
        }
    };
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getVideos() {
    const stored = JSON.parse(localStorage.getItem('videos')) || null;
    if (stored && Array.isArray(stored) && stored.length > 0) return stored;
    // Video de ejemplo por defecto (se usará solo si no hay videos guardados)
    return [
        {
            title: 'Video de ejemplo: Introducción',
            url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
            description: 'Este es un video de demostración. Reemplázalo desde el panel de administración.'
        }
    ];
}

function saveVideos(videos) {
    localStorage.setItem('videos', JSON.stringify(videos));
}

function getHeroImg() {
    return localStorage.getItem('heroImg') || 'https://unfocussed.com/cdn/shop/articles/How_to_Use_Color_Contrasts_for_Impact.png?crop=center&format=jpg&height=1200&v=1734760004&width=2400';
}

function saveHeroImg(url) {
    localStorage.setItem('heroImg', url);
}

function getPortafolios() {
    return JSON.parse(localStorage.getItem('portafolios')) || [];
}

function savePortafolios(data) {
    localStorage.setItem('portafolios', JSON.stringify(data));
}

// ====================
// Redes Sociales
// ====================
function getSocialMedia() {
    return JSON.parse(localStorage.getItem('socialMedia')) || {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        tiktok: 'https://tiktok.com',
        whatsapp: '+1234567890'
    };
}

function saveSocialMedia(data) {
    localStorage.setItem('socialMedia', JSON.stringify(data));
}

function loadSocialMediaSection() {
    const container = document.getElementById('social-media-container');
    if (!container) return;
    
    const social = getSocialMedia();
    container.innerHTML = '';
    
    const networks = [
        { name: 'Facebook', icon: '📘', key: 'facebook' },
        { name: 'Instagram', icon: '📷', key: 'instagram' },
        { name: 'YouTube', icon: '📺', key: 'youtube' },
        { name: 'TikTok', icon: '🎵', key: 'tiktok' },
        { name: 'WhatsApp', icon: '💬', key: 'whatsapp' }
    ];
    
    networks.forEach(network => {
        const link = social[network.key] || '#';
        const isWhatsApp = network.key === 'whatsapp';
        const href = isWhatsApp ? `https://wa.me/${social[network.key]?.replace(/\D/g, '')}` : link;
        
        const card = document.createElement('a');
        card.href = href;
        card.target = '_blank';
        card.rel = 'noopener';
        card.className = 'social-media-card';
        card.innerHTML = `
            <span class="social-media-icon">${network.icon}</span>
            <span class="social-media-name">${network.name}</span>
        `;
        container.appendChild(card);
    });
}

// ====================
// Funciones globales de usuario
// ====================
function getCurrentUser() {
    const cu = localStorage.getItem('currentUser');
    try { return cu ? JSON.parse(cu) : null; } catch (e) { return null; }
}

function setCurrentUserFromUsers(username) {
    const users = getUsers();
    if (!users[username]) return;
    const u = {
        username,
        name: users[username].name || username,
        role: users[username].role || 'client',
        permisos: users[username].permisos || {}
    };
    localStorage.setItem('currentUser', JSON.stringify(u));
}

// ====================
// Playlists - Gestión de contenido por listas
// ====================
function getPlaylists() {
    const stored = JSON.parse(localStorage.getItem('playlists')) || null;
    if (stored && Array.isArray(stored) && stored.length > 0) return stored;
    // Crear playlist de ejemplo por defecto
    const defaultPlaylist = {
        id: 'default-' + Date.now(),
        name: 'Mi Primer Curso',
        videoIds: [0] // referencia al primer video
    };
    localStorage.setItem('playlists', JSON.stringify([defaultPlaylist]));
    return [defaultPlaylist];
}

function savePlaylists(data) {
    localStorage.setItem('playlists', JSON.stringify(data));
}

function getUserPlaylistAccess() {
    const cu = localStorage.getItem('currentUser');
    if (!cu) return [];
    try {
        const user = JSON.parse(cu);
        return JSON.parse(localStorage.getItem(`userPlaylists_${user.username}`)) || [];
    } catch (e) {
        return [];
    }
}

// ====================
// Cerrar sesión
// ====================
document.querySelectorAll('#logout').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});

// Cargar checkboxes de playlists en la sección de crear usuario
function loadNewUserPlaylistsCheckboxes() {
    const container = document.getElementById('new-user-playlists');
    if (!container) return;
    
    const playlists = getPlaylists();
    container.innerHTML = '';
    
    if (playlists.length === 0) {
        container.innerHTML = '<small style="opacity:0.7;">No hay playlists creadas aún</small>';
    } else {
        playlists.forEach(playlist => {
            const label = document.createElement('label');
            label.style.cssText = 'display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = playlist.id;
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(playlist.name));
            container.appendChild(label);
        });
    }
}

// Abrir editor de playlists para un usuario específico
function openPlaylistEditor(username) {
    const playlists = getPlaylists();
    const userPlaylists = JSON.parse(localStorage.getItem(`userPlaylists_${username}`)) || [];
    const users = getUsers();
    const user = users[username] || {};
    const userPermisos = user.permisos || {};
    
    if (playlists.length === 0) {
        alert('No hay playlists creadas. Crea una primero en la sección "Playlists de Videos".');
        return;
    }
    
    // Crear un contenedor temporal para los checkboxes
    const container = document.createElement('div');
    container.style.cssText = 'display:grid; gap:8px; margin:15px 0; padding:12px; background:rgba(255,107,0,0.1); border-radius:6px;';
    
    const title = document.createElement('h4');
    title.textContent = `Asignar Acceso a "${username}"`;
    title.style.cssText = 'margin:0 0 10px 0; color:#00d4d4; font-size:13px;';
    container.appendChild(title);
    
    // Sección de Permisos de Acceso (Cursos y Panel)
    const permisosSection = document.createElement('div');
    permisosSection.style.cssText = 'margin-bottom:10px; padding:8px; background:rgba(255,255,255,0.08); border-radius:4px;';
    
    const permisosTitle = document.createElement('div');
    permisosTitle.textContent = 'Permisos de Acceso:';
    permisosTitle.style.cssText = 'font-size:12px; font-weight:bold; margin-bottom:6px; color:#fff;';
    permisosSection.appendChild(permisosTitle);
    
    const cursosLabel = document.createElement('label');
    cursosLabel.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; padding:6px; font-size:12px;';
    const cursosCheckbox = document.createElement('input');
    cursosCheckbox.type = 'checkbox';
    cursosCheckbox.className = 'temp-permisos-checkbox';
    cursosCheckbox.value = 'cursos';
    cursosCheckbox.checked = userPermisos.cursos === true;
    cursosLabel.appendChild(cursosCheckbox);
    cursosLabel.appendChild(document.createTextNode('Acceso a Cursos'));
    permisosSection.appendChild(cursosLabel);
    
    const panelLabel = document.createElement('label');
    panelLabel.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; padding:6px; font-size:12px;';
    const panelCheckbox = document.createElement('input');
    panelCheckbox.type = 'checkbox';
    panelCheckbox.className = 'temp-permisos-checkbox';
    panelCheckbox.value = 'panel';
    panelCheckbox.checked = userPermisos.panel === true;
    panelLabel.appendChild(panelCheckbox);
    panelLabel.appendChild(document.createTextNode('Acceso a Panel de Control'));
    permisosSection.appendChild(panelLabel);
    
    container.appendChild(permisosSection);
    
    // Sección de Playlists
    const playlistsTitle = document.createElement('div');
    playlistsTitle.textContent = 'Playlists de Cursos:';
    playlistsTitle.style.cssText = 'font-size:12px; font-weight:bold; margin:6px 0; color:#fff;';
    container.appendChild(playlistsTitle);
    
    const checkboxContainer = document.createElement('div');
    checkboxContainer.style.cssText = 'display:grid; gap:6px;';
    
    playlists.forEach(playlist => {
        const label = document.createElement('label');
        label.style.cssText = 'display:flex; align-items:center; gap:8px; cursor:pointer; padding:8px; background:rgba(255,255,255,0.05); border-radius:4px; font-size:12px;';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = playlist.id;
        checkbox.checked = userPlaylists.includes(playlist.id);
        checkbox.dataset.username = username;
        checkbox.className = 'temp-playlist-checkbox';
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(`${playlist.name} (${playlist.videoIds.length} videos)`));
        checkboxContainer.appendChild(label);
    });
    
    container.appendChild(checkboxContainer);
    
    // Botones para guardar/cancelar
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display:flex; gap:8px; margin-top:10px;';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar Cambios';
    saveBtn.style.cssText = 'flex:1; background:#00d4d4; color:#0f1622; padding:6px 12px; border:none; border-radius:4px; cursor:pointer; font-size:12px;';
    saveBtn.addEventListener('click', () => {
        // Guardar playlists
        const checked = Array.from(checkboxContainer.querySelectorAll('.temp-playlist-checkbox:checked')).map(cb => cb.value);
        localStorage.setItem(`userPlaylists_${username}`, JSON.stringify(checked));
        
        // Guardar permisos
        const newPermisos = {};
        Array.from(container.querySelectorAll('.temp-permisos-checkbox:checked')).forEach(cb => {
            newPermisos[cb.value] = true;
        });
        
        users[username].permisos = newPermisos;
        saveUsers(users);
        
        container.remove();
        loadAdminPanel();
        alert(`Acceso actualizado para ${username}`);
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.cssText = 'flex:1; background:#666; color:#fff; padding:6px 12px; border:none; border-radius:4px; cursor:pointer; font-size:12px;';
    cancelBtn.addEventListener('click', () => {
        container.remove();
    });
    
    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(cancelBtn);
    container.appendChild(buttonContainer);
    
    // Insertar el editor después de la lista de usuarios
    const usersList = document.getElementById('users-list');
    if (usersList) {
        usersList.parentNode.insertBefore(container, usersList.nextSibling);
    }
}
function loadAdminPanel() {
    const list = document.getElementById('users-list');
    if (!list) return;
    list.innerHTML = '';
    const users = getUsers();

    for (let user in users) {
        if (user === 'admin') continue;

        const li = document.createElement('li');
        const userPlaylists = JSON.parse(localStorage.getItem(`userPlaylists_${user}`)) || [];
        const playlists = getPlaylists();
        const playlistNames = playlists
            .filter(p => userPlaylists.includes(p.id))
            .map(p => p.name)
            .join(', ') || 'Ninguna';
        
        li.innerHTML = `
            <div>
                <strong>${user}</strong><br>
                Contraseña: <span style="color:#00d4d4;">${users[user].password}</span><br>
                Permisos: ${Object.keys(users[user].permisos || {}).join(', ') || 'Ninguno'}<br>
                <small style="opacity:0.7;">Acceso a playlists: ${playlistNames}</small>
            </div>
            <div>
                <button class="edit-playlists" data-user="${user}" style="background:#ff9500; color:#fff; padding:6px 10px; border:none; border-radius:4px; cursor:pointer; font-size:11px; margin-right:5px;">Editar Acceso</button>
                <button class="edit-password" data-user="${user}" style="background:#00d4d4; color:#0f1622; padding:6px 10px; border:none; border-radius:4px; cursor:pointer; font-size:11px; margin-right:5px;">Cambiar Contraseña</button>
                <button class="delete-user" data-user="${user}" style="background:#ff4444; color:#fff; padding:6px 10px; border:none; border-radius:4px; cursor:pointer; font-size:11px;">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    }

    document.querySelectorAll('.edit-playlists').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = e.target.dataset.user;
            openPlaylistEditor(username);
        });
    });

    document.querySelectorAll('.edit-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = e.target.dataset.user;
            const newPass = prompt(`Nueva contraseña para ${username}:`);
            if (newPass !== null && newPass.trim() !== '') {
                users[username].password = newPass.trim();
                saveUsers(users);
                loadAdminPanel();
            }
        });
    });

    document.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const username = e.target.dataset.user;
            if (confirm(`¿Eliminar permanentemente al usuario "${username}"?`)) {
                delete users[username];
                saveUsers(users);
                loadAdminPanel();
            }
        });
    });
}

document.getElementById('add-user-btn')?.addEventListener('click', () => {
    const username = document.getElementById('new-username')?.value.trim();
    const password = document.getElementById('new-password')?.value;
    const select = document.getElementById('new-permisos');
    const selected = select ? Array.from(select.selectedOptions).map(o => o.value) : [];
    const permisos = {};
    selected.forEach(p => permisos[p] = true);

    if (!username || !password) {
        alert('Completa usuario y contraseña');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('Este usuario ya existe');
        return;
    }

    users[username] = {
        password,
        role: "client",
        name: username.charAt(0).toUpperCase() + username.slice(1),
        permisos
    };
    saveUsers(users);
    
    // Guardar playlists seleccionadas para el nuevo usuario
    const playlistCheckboxes = document.querySelectorAll('#new-user-playlists input[type="checkbox"]:checked');
    const selectedPlaylists = Array.from(playlistCheckboxes).map(cb => cb.value);
    if (selectedPlaylists.length > 0) {
        localStorage.setItem(`userPlaylists_${username}`, JSON.stringify(selectedPlaylists));
    }
    
    loadAdminPanel();
    loadNewUserPlaylistsCheckboxes();
    alert(`Usuario "${username}" creado`);
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    if (select) select.selectedIndex = -1;
    document.querySelectorAll('#new-user-playlists input[type="checkbox"]').forEach(cb => cb.checked = false);
});

// ====================
// Videos - CONFIGURACIÓN QUE FUNCIONA EN 2026 (nocookie + referrerpolicy)
// Helper: convierte varias formas de URL de YouTube a la URL de embed (nocookie)
// Acepta: https://www.youtube.com/watch?v=ID, https://youtu.be/ID, https://www.youtube.com/embed/ID, o solo el ID
// Retorna null si no reconoce un ID válido
function toEmbedUrl(url) {
    if (!url) return null;
    url = url.trim();
    try {
        const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        if (embedMatch) return 'https://www.youtube-nocookie.com/embed/' + embedMatch[1];

        const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        if (vMatch) return 'https://www.youtube-nocookie.com/embed/' + vMatch[1];

        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        if (shortMatch) return 'https://www.youtube-nocookie.com/embed/' + shortMatch[1];

        const idOnly = url.match(/^([a-zA-Z0-9_-]{11})$/);
        if (idOnly) return 'https://www.youtube-nocookie.com/embed/' + idOnly[1];

        return null;
    } catch (e) {
        return null;
    }
}

// Extrae el ID del video (11 caracteres) desde varias formas de URL
function getVideoId(url) {
    if (!url) return null;
    const mEmbed = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (mEmbed) return mEmbed[1];
    const mV = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (mV) return mV[1];
    const mShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (mShort) return mShort[1];
    const mId = url.match(/([a-zA-Z0-9_-]{11})$/);
    if (mId) return mId[1];
    return null;
}

// Obtener un video por su índice (para playlists)
function getVideoById(index) {
    const videos = getVideos();
    return videos[index] || null;
}

function loadVideos() {
    const list = document.getElementById('cursos-list');
    const mgmtList = document.getElementById('video-management-list');

    // En cursos.html: mostrar playlists
    if (list) {
        const playlists = getPlaylists();
        const cu = getCurrentUser();
        let allowedPlaylists = [];

        // Si el usuario es admin, ver todas las playlists; si no, solo las asignadas
        if (cu && cu.role === 'admin') {
            allowedPlaylists = playlists;
        } else {
            const userAccess = getUserPlaylistAccess();
            allowedPlaylists = playlists.filter(p => userAccess.includes(p.id));
        }

        list.innerHTML = '';
        
        if (allowedPlaylists.length === 0) {
            list.innerHTML = '<p style="text-align:center; grid-column:1/-1; font-size:20px; opacity:0.7;">No tienes acceso a ninguna playlist. Contacta al administrador.</p>';
        } else {
            allowedPlaylists.forEach(playlist => {
                const playlistSection = document.createElement('div');
                playlistSection.className = 'animate-on-scroll';
                playlistSection.style.gridColumn = '1/-1';
                playlistSection.innerHTML = `<h3 style="margin-top:30px; margin-bottom:15px; color:#00d4d4;">${playlist.name}</h3>`;
                list.appendChild(playlistSection);
                
                playlist.videoIds.forEach(videoId => {
                    const video = getVideoById(videoId);
                    if (!video) return;
                    
                    const card = document.createElement('div');
                    card.className = 'card animate-on-scroll video-row';

                    const embedBase = toEmbedUrl(video.url) || video.url;
                    const embedUrlBase = embedBase + '?rel=0&modestbranding=1';

                    // Left column: title + video placeholder (thumbnail -> click to play)
                    const left = document.createElement('div');
                    left.className = 'video-left';
                    left.style.cssText = 'flex:0 0 50%; min-width:320px; max-width:50%; box-sizing:border-box;';

                    const leftTitle = document.createElement('h3');
                    leftTitle.textContent = video.title;
                    leftTitle.style.cssText = 'margin-bottom:8px; color:#00d4d4; font-size:14px;';
                    left.appendChild(leftTitle);

                    const videoHolder = document.createElement('div');
                    videoHolder.className = 'video-placeholder';
                    videoHolder.style.cssText = 'position:relative; padding-bottom:56.25%; height:0; overflow:hidden; background:#000; border-radius:12px;';

                    const vidId = getVideoId(video.url);
                    const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/hqdefault.jpg` : null;
                    if (thumb) {
                        const img = document.createElement('img');
                        img.src = thumb;
                        img.alt = video.title;
                        img.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;';
                        videoHolder.appendChild(img);
                    } else {
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#fff;';
                        placeholder.textContent = 'Video';
                        videoHolder.appendChild(placeholder);
                    }

                    const playBtn = document.createElement('div');
                    playBtn.className = 'play-overlay';
                    playBtn.innerHTML = '►';
                    playBtn.style.cssText = 'position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:64px; color:#fff; opacity:0.95; text-shadow:0 0 20px rgba(0,0,0,0.8); cursor:pointer;';
                    videoHolder.appendChild(playBtn);

                    // on click, replace placeholder with iframe (autoplay)
                    playBtn.addEventListener('click', () => {
                        const iframe = document.createElement('iframe');
                        iframe.src = embedUrlBase + '&autoplay=1';
                        iframe.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; border:0;';
                        iframe.title = video.title;
                        iframe.frameBorder = '0';
                        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        iframe.allowFullscreen = true;
                        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                        // remove children and insert iframe
                        videoHolder.innerHTML = '';
                        videoHolder.appendChild(iframe);
                    });

                    left.appendChild(videoHolder);

                    // Right column: description, likes, comments
                    const right = document.createElement('div');
                    right.className = 'video-right';
                    right.style.cssText = 'flex:0 0 50%; padding-left:24px; min-width:260px; box-sizing:border-box;';

                    const desc = document.createElement('p');
                    desc.style.cssText = 'opacity:0.9; margin-bottom:12px;';
                    desc.textContent = video.description || 'Sin descripción';
                    right.appendChild(desc);

                    // Comments section (styled light background, black text)
                    const commentsKey = `videoComments_${videoId}`;
                    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');

                    const commentsSection = document.createElement('div');
                    commentsSection.className = 'comments-section';
                    commentsSection.style.cssText = 'margin-top:10px; padding:12px; background:#f0f0f0; color:#000; border-radius:8px;';

                    const commentsTitle = document.createElement('div');
                    commentsTitle.textContent = 'Comentarios:';
                    commentsTitle.style.cssText = 'font-weight:600; margin-bottom:8px; color:#000;';
                    commentsSection.appendChild(commentsTitle);

                    const commentsList = document.createElement('div');
                    commentsList.style.cssText = 'display:flex; flex-direction:column; gap:10px; margin-bottom:12px; max-height:300px; overflow:auto;';
                    function renderComments() {
                        commentsList.innerHTML = '';
                        const c = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        c.forEach((cm, cmIdx) => {
                            const item = document.createElement('div');
                            item.className = 'comment';
                            item.style.cssText = 'background:#ffffff; color:#000; padding:8px; border-radius:8px; font-size:13px; position:relative;';
                            
                            // Header con usuario, fecha y botones
                            const header = document.createElement('div');
                            header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;';
                            
                            const userInfo = document.createElement('div');
                            userInfo.innerHTML = `<strong style="color:#00d4d4">${cm.user || 'Anon'}</strong> <span style="opacity:0.7; font-size:12px; margin-left:8px; color:#000">${new Date(cm.time).toLocaleString()}</span>`;
                            header.appendChild(userInfo);
                            
                            const actions = document.createElement('div');
                            actions.style.cssText = 'display:flex; gap:6px;';
                            
                            // Botón editar (lápiz)
                            const editBtn = document.createElement('button');
                            editBtn.innerHTML = '✏️';
                            editBtn.style.cssText = 'background:transparent; border:none; cursor:pointer; font-size:14px; padding:2px 6px; opacity:0.7; hover-opacity:1;';
                            editBtn.title = 'Editar comentario';
                            
                            // Botón borrar (basura)
                            const delBtn = document.createElement('button');
                            delBtn.innerHTML = '🗑️';
                            delBtn.style.cssText = 'background:transparent; border:none; cursor:pointer; font-size:14px; padding:2px 6px; opacity:0.7;';
                            delBtn.title = 'Eliminar comentario';
                            
                            actions.appendChild(editBtn);
                            actions.appendChild(delBtn);
                            header.appendChild(actions);
                            
                            item.appendChild(header);
                            
                            // Contenido del comentario
                            const textDiv = document.createElement('div');
                            textDiv.style.cssText = 'margin-top:4px; color:#000; word-wrap:break-word;';
                            textDiv.textContent = cm.text;
                            item.appendChild(textDiv);
                            
                            // Handler editar
                            editBtn.addEventListener('click', () => {
                                const newText = prompt('Editar comentario:', cm.text);
                                if (newText !== null && newText.trim() !== '') {
                                    const arr = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                                    if (arr[cmIdx]) {
                                        arr[cmIdx].text = newText.trim();
                                        arr[cmIdx].time = Date.now();
                                        localStorage.setItem(commentsKey, JSON.stringify(arr));
                                        renderComments();
                                    }
                                }
                            });
                            
                            // Handler borrar
                            delBtn.addEventListener('click', () => {
                                if (confirm('¿Eliminar este comentario?')) {
                                    const arr = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                                    arr.splice(cmIdx, 1);
                                    localStorage.setItem(commentsKey, JSON.stringify(arr));
                                    renderComments();
                                }
                            });
                            
                            commentsList.appendChild(item);
                        });
                    }
                    renderComments();
                    commentsSection.appendChild(commentsList);

                    const commentForm = document.createElement('div');
                    commentForm.style.cssText = 'display:flex; gap:8px;';
                    const commentInput = document.createElement('input');
                    commentInput.type = 'text';
                    commentInput.placeholder = 'Escribe un comentario...';
                    commentInput.style.cssText = 'flex:1; padding:10px; border-radius:10px; border:1px solid #ccc; background:#ffffff; color:#000; font-size:15px;';
                    const commentBtn = document.createElement('button');
                    commentBtn.textContent = 'Enviar';
                    commentBtn.style.cssText = 'background:#00d4d4; border:none; color:#0f1622; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:14px;';
                    commentForm.appendChild(commentInput);
                    commentForm.appendChild(commentBtn);
                    commentsSection.appendChild(commentForm);

                    // Handlers for comments
                    commentBtn.addEventListener('click', () => {
                        const text = (commentInput.value || '').trim();
                        if (!text) return;
                        const cu = getCurrentUser();
                        const usern = cu ? cu.username : 'Anon';
                        const c = JSON.parse(localStorage.getItem(commentsKey) || '[]');
                        c.push({ user: usern, text, time: Date.now() });
                        localStorage.setItem(commentsKey, JSON.stringify(c));
                        commentInput.value = '';
                        renderComments();
                    });

                    // After comments, place the like button below
                    const likesKey = `videoLikes_${videoId}`;
                    const storedLikes = JSON.parse(localStorage.getItem(likesKey) || '{}');
                    storedLikes.count = storedLikes.count || 0;
                    storedLikes.by = storedLikes.by || [];

                    const likeContainer = document.createElement('div');
                    likeContainer.style.cssText = 'display:flex; align-items:center; gap:10px; margin-top:8px;';
                    const likeBtn = document.createElement('button');
                    likeBtn.className = 'like-btn';
                    likeBtn.style.cssText = 'background:#ffffff; border:1px solid rgba(0,0,0,0.12); color:#000; padding:8px 12px; border-radius:8px; cursor:pointer; font-size:14px; display:flex; align-items:center; gap:8px;';
                    const likeIcon = document.createElement('span');
                    likeIcon.textContent = '👍';
                    const likeCountSpan = document.createElement('span');
                    likeCountSpan.textContent = storedLikes.count;
                    likeBtn.appendChild(likeIcon);
                    likeBtn.appendChild(likeCountSpan);
                    likeContainer.appendChild(likeBtn);

                    likeBtn.addEventListener('click', () => {
                        const cu = getCurrentUser();
                        const usern = cu ? cu.username : null;
                        const stored = JSON.parse(localStorage.getItem(likesKey) || '{}');
                        stored.count = stored.count || 0;
                        stored.by = stored.by || [];
                        // If user logged in, toggle by username; else use anon flag
                        if (usern) {
                            const idx = stored.by.indexOf(usern);
                            if (idx === -1) { stored.by.push(usern); stored.count += 1; }
                            else { stored.by.splice(idx, 1); stored.count = Math.max(0, stored.count - 1); }
                        } else {
                            // anon key per browser
                            const anonKey = `anonLiked_${videoId}`;
                            const had = localStorage.getItem(anonKey) === '1';
                            if (!had) { stored.count += 1; localStorage.setItem(anonKey, '1'); }
                            else { stored.count = Math.max(0, stored.count - 1); localStorage.removeItem(anonKey); }
                        }
                        localStorage.setItem(likesKey, JSON.stringify(stored));
                        likeCountSpan.textContent = stored.count || 0;
                    });

                    right.appendChild(commentsSection);
                    right.appendChild(likeContainer);

                    // Assemble card
                    card.appendChild(left);
                    card.appendChild(right);
                    list.appendChild(card);
                    card.classList.add('animated');
                });
            });
        }
    }

    if (mgmtList) {
        const videos = getVideos();
        mgmtList.innerHTML = '';
        if (videos.length === 0) {
            mgmtList.innerHTML = '<p style="text-align:center; opacity:0.7; font-size:12px;">No hay videos agregados aún.</p>';
        } else {
            // Crear un grid compacto
            const grid = document.createElement('div');
            grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fill, minmax(150px, 1fr)); gap:8px;';
            
            videos.forEach((video, vidIdx) => {
                const card = document.createElement('div');
                card.style.cssText = 'border:1px solid #00d4d4; padding:8px; border-radius:6px; font-size:11px;';
                const id = getVideoId(video.url);
                const thumb = id ? `https://img.youtube.com/vi/${id}/default.jpg` : null;
                
                card.innerHTML = `
                    <div style="width:100%; height:84px; background:#000; border-radius:4px; overflow:hidden; margin-bottom:6px; display:flex; align-items:center; justify-content:center;">
                        ${thumb ? `<img src="${thumb}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="color:#fff; font-size:10px;">Sin imagen</span>'}
                    </div>
                    <h4 style="margin:0 0 4px 0; font-size:11px; line-height:1.3; color:#00d4d4;">${video.title}</h4>
                    <p style="margin:0 0 6px 0; font-size:10px; opacity:0.7;">${video.description?.substring(0, 30) || 'Sin desc'}</p>
                    <button class="delete-video" data-index="${vidIdx}" style="background:#ff4444; color:#fff; padding:3px 6px; border:none; border-radius:3px; cursor:pointer; font-size:10px; width:100%;">Eliminar</button>
                `;
                grid.appendChild(card);
                attachDeleteVideoListener(card);
            });
            
            mgmtList.appendChild(grid);
        }
    }
}

// ====================
// Portafolio y hero
// ====================
function loadPortafolios() {
    const container = document.getElementById('portafolio-list') || document.getElementById('public-portafolio');
    if (!container) return;
    container.innerHTML = '';
    getPortafolios().forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.src}" alt="${item.title}">
            <h3>${item.title}</h3>
        `;
        container.appendChild(card);
    });
}

document.getElementById('add-portafolio-btn')?.addEventListener('click', () => {
    const title = document.getElementById('portafolio-title')?.value.trim();
    const url = document.getElementById('portafolio-url')?.value.trim();
    const file = document.getElementById('portafolio-file')?.files[0];

    if (!title) {
        alert('Ingresa un título');
        return;
    }

    const portafolios = getPortafolios();

    if (url) {
        portafolios.push({ title, src: url });
    } else if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            portafolios.push({ title, src: e.target.result });
            savePortafolios(portafolios);
            loadPortafolios();
            alert('Trabajo subido');
        };
        reader.readAsDataURL(file);
        return;
    } else {
        alert('Ingresa URL o archivo');
        return;
    }

    savePortafolios(portafolios);
    loadPortafolios();
    alert('Trabajo agregado');

    document.getElementById('portafolio-title').value = '';
    document.getElementById('portafolio-url').value = '';
    document.getElementById('portafolio-file').value = '';
});

document.getElementById('change-hero-btn')?.addEventListener('click', () => {
    const url = document.getElementById('hero-url')?.value.trim();
    const file = document.getElementById('hero-file')?.files[0];

    if (url || file) {
        if (url) {
            saveHeroImg(url);
            alert('Imagen de inicio actualizada');
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                saveHeroImg(e.target.result);
                alert('Imagen de inicio subida');
            };
            reader.readAsDataURL(file);
        }
        document.getElementById('hero-url').value = '';
        document.getElementById('hero-file').value = '';
    } else {
        alert('Ingresa URL o archivo');
    }
});

// ====================
// Agregar Video desde el Panel de Administración
// ====================
document.getElementById('add-video-btn')?.addEventListener('click', () => {
    const titleEl = document.getElementById('video-title');
    const urlEl = document.getElementById('video-url');
    const descEl = document.getElementById('video-description');
    const playlistSelect = document.getElementById('video-playlist-select');
    
    const title = titleEl?.value?.trim();
    const url = urlEl?.value?.trim();
    const desc = descEl?.value?.trim();
    const playlistId = playlistSelect?.value;

    if (!title || !url) {
        alert('Completa título y URL');
        return;
    }

    const embed = toEmbedUrl(url) || url;
    const videos = getVideos();
    const videoIndex = videos.length;
    videos.push({ title, url: embed, description: desc });
    saveVideos(videos);
    
    // Si seleccionó una playlist, agregar el video a esa playlist
    if (playlistId) {
        const playlists = getPlaylists();
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.videoIds.includes(videoIndex)) {
            playlist.videoIds.push(videoIndex);
            savePlaylists(playlists);
        }
    }
    
    loadVideos();
    loadPlaylistsPanel();
    loadVideoPlaylistSelector();
    alert('Video agregado');

    if (titleEl) titleEl.value = '';
    if (urlEl) urlEl.value = '';
    if (descEl) descEl.value = '';
    if (playlistSelect) playlistSelect.value = '';
});

// Cargar opciones de playlists en el selector de video
function loadVideoPlaylistSelector() {
    const select = document.getElementById('video-playlist-select');
    if (!select) return;
    
    const playlists = getPlaylists();
    select.innerHTML = '<option value="">-- Sin playlist --</option>';
    
    playlists.forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = `${playlist.name} (${playlist.videoIds.length} videos)`;
        select.appendChild(option);
    });
}
function attachDeleteVideoListener(card) {
    const deleteBtn = card.querySelector('.delete-video');
    if (!deleteBtn) return;
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(deleteBtn.dataset.index);
        if (confirm('¿Eliminar este video?')) {
            const videos = getVideos();
            videos.splice(index, 1);
            saveVideos(videos);
            loadVideos();
            alert('Video eliminado');
        }
    });
}

// ====================
// Cargar todo cuando el DOM esté listo
// ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAdminPanel();
    loadPortafolios();
    loadVideos();
});

// Render debug panel in modo dev para mostrar currentUser y videos sin abrir consola
function renderDebugPanel() {
    try {
        if (!isDev) return;
        const existing = document.getElementById('debug-panel');
        if (existing) existing.remove();
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style = 'position:fixed; left:10px; bottom:10px; z-index:99999; background:rgba(0,0,0,0.8); color:#fff; padding:10px; border-radius:8px; font-size:13px; max-width:320px; max-height:40vh; overflow:auto; border:1px solid rgba(255,107,0,0.3);';
        const cu = localStorage.getItem('currentUser');
        const vids = localStorage.getItem('videos');
        panel.innerHTML = `<strong>DEBUG</strong><br><b>currentUser:</b> ${cu}<br><b>videos:</b> <pre style="white-space:pre-wrap;">${vids || 'null'}</pre>`;
        document.body.appendChild(panel);
    } catch (e) {
        // ignore
    }
}

// Llamar a renderDebugPanel después de DOMContentLoaded para mostrar info actual
document.addEventListener('DOMContentLoaded', () => renderDebugPanel());

// ====================
// Gate de login para enlaces 'Cursos' y 'Panel de Control'
// Muestra el modal de login si no hay sesión y abre la página en nueva pestaña tras autenticar
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const cursosLink = document.getElementById('cursos-link');
    const panelLink = document.getElementById('panel-link');
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const cancelLogin = document.getElementById('cancel-login');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    function showLoginModal() {
        if (!loginModal) return;
        loginModal.classList.remove('hidden');
        usernameInput?.focus();
    }

    function hideLoginModal() {
        if (!loginModal) return;
        loginModal.classList.add('hidden');
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        window.pendingAction = null;
    }

    window.pendingAction = null;

    function requireLoginAndOpen(url, type) {
        const cu = getCurrentUser();
        if (cu) {
            if (type === 'panel' && cu.role !== 'admin') {
                alert('Acceso denegado — sólo administradores.');
                return;
            }
            if (type === 'cursos' && !(cu.permisos && cu.permisos.cursos)) {
                alert('No tienes permiso para ver los cursos.');
                return;
            }
            window.location.href = url;
            return;
        }
        // No está logueado: mostrar modal y guardar acción pendiente
        window.pendingAction = { url, type };
        showLoginModal();
    }

    cursosLink?.addEventListener('click', (e) => {
        e.preventDefault();
        requireLoginAndOpen('cursos.html', 'cursos');
    });

    panelLink?.addEventListener('click', (e) => {
        e.preventDefault();
        requireLoginAndOpen('panel.html', 'panel');
    });

    cancelLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        hideLoginModal();
    });

    loginBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const user = usernameInput?.value?.trim();
        const pass = passwordInput?.value || '';
        if (!user || !pass) {
            alert('Completa usuario y contraseña');
            return;
        }
        const users = getUsers();
        if (users[user] && users[user].password === pass) {
            setCurrentUserFromUsers(user);
            
            // Asignar playlists al usuario si no las tiene (inicialización)
            const userPlaylistsKey = `userPlaylists_${user}`;
            const existingPlaylists = JSON.parse(localStorage.getItem(userPlaylistsKey) || '[]');
            if (existingPlaylists.length === 0) {
                const allPlaylists = getPlaylists();
                const playlistIds = allPlaylists.map(p => p.id);
                localStorage.setItem(userPlaylistsKey, JSON.stringify(playlistIds));
            }
            
            alert('Login correcto');
            hideLoginModal();
            updateLogoutButton();
            if (window.pendingAction) {
                const act = window.pendingAction;
                const cu2 = getCurrentUser();
                if (act.type === 'panel' && cu2.role !== 'admin') {
                    alert('Acceso denegado — sólo administradores.');
                    return;
                }
                if (act.type === 'cursos' && !(cu2.permisos && cu2.permisos.cursos)) {
                    alert('No tienes permiso para ver los cursos.');
                    return;
                }
                window.location.href = act.url;
            } else {
                // Si no hay acción pendiente, ir automáticamente a cursos
                const cu2 = getCurrentUser();
                if (cu2.permisos && cu2.permisos.cursos) {
                    window.location.href = 'cursos.html';
                }
            }
        } else {
            alert('Credenciales inválidas');
        }
    });

    // Lógica de botón Cerrar Sesión
    const logoutBtn = document.getElementById('logout-btn');
    function updateLogoutButton() {
        const cu = getCurrentUser();
        if (logoutBtn) {
            if (cu) {
                logoutBtn.style.display = 'inline-block';
            } else {
                logoutBtn.style.display = 'none';
            }
        }
    }

    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        updateLogoutButton();
        alert('Sesión cerrada');
        window.location.href = 'index.html';
    });

    // Si ya hay currentUser, ocultar modal por seguridad y mostrar logout
    if (getCurrentUser() && loginModal) loginModal.classList.add('hidden');
    updateLogoutButton();
});
// ====================
// Animaciones
// ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animated');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 100);
});

document.querySelectorAll('.menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        document.querySelector('.nav-list').classList.toggle('active');
    });
});

// ====================
// Gestión de Playlists
// ====================
function loadPlaylistsPanel() {
    const container = document.getElementById('playlists-list');
    if (!container) return;
    
    const playlists = getPlaylists();
    container.innerHTML = '';
    
    if (playlists.length === 0) {
        container.innerHTML = '<p style="opacity:0.7; font-size:12px;">No hay playlists creadas aún.</p>';
    } else {
        playlists.forEach((playlist, idx) => {
            const div = document.createElement('div');
            div.style.cssText = 'border:1px solid #00d4d4; padding:10px; border-radius:6px;';
            
            const titleEl = document.createElement('h5');
            titleEl.style.cssText = 'margin:0 0 6px 0; color:#00d4d4; font-size:13px;';
            titleEl.textContent = playlist.name;
            div.appendChild(titleEl);

            const countEl = document.createElement('p');
            countEl.style.cssText = 'margin:0 0 6px 0; font-size:11px; opacity:0.8;';
            countEl.textContent = `Videos: ${playlist.videoIds.length}`;
            div.appendChild(countEl);

            if (playlist.videoIds.length > 0) {
                const ul = document.createElement('ul');
                ul.style.cssText = 'margin:6px 0; padding-left:16px; font-size:11px; list-style:decimal;';
                playlist.videoIds.forEach((vidIdx, pos) => {
                    const li = document.createElement('li');
                    li.style.cssText = 'margin-bottom:6px; display:flex; align-items:center; justify-content:space-between; gap:8px;';
                    const video = getVideoById(vidIdx);
                    const leftSpan = document.createElement('span');
                    leftSpan.textContent = video ? video.title : 'Video eliminado';
                    leftSpan.style.cssText = 'font-size:11px;';
                    li.appendChild(leftSpan);

                    const controls = document.createElement('div');
                    controls.style.cssText = 'display:flex; gap:6px;';

                    const upBtn = document.createElement('button');
                    upBtn.textContent = '↑';
                    upBtn.title = 'Subir';
                    upBtn.style.cssText = 'padding:4px 6px; font-size:11px; cursor:pointer;';
                    controls.appendChild(upBtn);

                    const downBtn = document.createElement('button');
                    downBtn.textContent = '↓';
                    downBtn.title = 'Bajar';
                    downBtn.style.cssText = 'padding:4px 6px; font-size:11px; cursor:pointer;';
                    controls.appendChild(downBtn);

                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Eliminar';
                    removeBtn.style.cssText = 'padding:4px 6px; font-size:11px; background:#cc0000; color:#fff; border:none; border-radius:3px; cursor:pointer;';
                    controls.appendChild(removeBtn);

                    li.appendChild(controls);
                    ul.appendChild(li);

                    upBtn.addEventListener('click', () => {
                        if (pos <= 0) return;
                        const playlists = getPlaylists();
                        const arr = playlists[idx].videoIds;
                        [arr[pos-1], arr[pos]] = [arr[pos], arr[pos-1]];
                        savePlaylists(playlists);
                        loadPlaylistsPanel();
                    });

                    downBtn.addEventListener('click', () => {
                        const playlists = getPlaylists();
                        const arr = playlists[idx].videoIds;
                        if (pos >= arr.length - 1) return;
                        [arr[pos+1], arr[pos]] = [arr[pos], arr[pos+1]];
                        savePlaylists(playlists);
                        loadPlaylistsPanel();
                    });

                    removeBtn.addEventListener('click', () => {
                        if (!confirm('Quitar este video de la playlist?')) return;
                        const playlists = getPlaylists();
                        const arr = playlists[idx].videoIds;
                        arr.splice(pos, 1);
                        savePlaylists(playlists);
                        loadPlaylistsPanel();
                    });
                });
                div.appendChild(ul);
            } else {
                const none = document.createElement('p');
                none.style.cssText = 'font-size:11px; opacity:0.7;';
                none.textContent = 'Sin videos';
                div.appendChild(none);
            }

            const controlsRow = document.createElement('div');
            controlsRow.style.cssText = 'display:flex; gap:6px; margin-top:8px; align-items:center;';
            const select = document.createElement('select');
            select.className = 'playlist-video-select';
            select.dataset.playlistIdx = idx;
            select.style.cssText = 'flex:1; padding:4px; font-size:11px;';
            select.innerHTML = '<option value="">-- Agregar video --</option>';
            controlsRow.appendChild(select);
            const addBtn = document.createElement('button');
            addBtn.className = 'add-video-to-playlist';
            addBtn.dataset.playlistIdx = idx;
            addBtn.textContent = 'Agregar';
            addBtn.style.cssText = 'background:#00d4d4; color:#0f1622; padding:4px 8px; border:none; border-radius:3px; cursor:pointer; font-size:11px;';
            controlsRow.appendChild(addBtn);
            const delPlBtn = document.createElement('button');
            delPlBtn.className = 'delete-playlist';
            delPlBtn.dataset.playlistIdx = idx;
            delPlBtn.textContent = 'Eliminar';
            delPlBtn.style.cssText = 'background:#ff4444; color:#fff; padding:4px 8px; border:none; border-radius:3px; cursor:pointer; font-size:11px;';
            controlsRow.appendChild(delPlBtn);
            div.appendChild(controlsRow);
            container.appendChild(div);
        });
        
        // Cargar videos en selectores
        const videos = getVideos();
        document.querySelectorAll('.playlist-video-select').forEach(select => {
            select.innerHTML = '<option value="">-- Agregar video --</option>';
            videos.forEach((video, vidIdx) => {
                const option = document.createElement('option');
                option.value = vidIdx;
                option.textContent = video.title;
                select.appendChild(option);
            });
        });
        
        document.querySelectorAll('.add-video-to-playlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.playlistIdx);
                const select = document.querySelector(`.playlist-video-select[data-playlist-idx="${idx}"]`);
                const videoIdx = parseInt(select.value);
                
                if (isNaN(videoIdx)) {
                    alert('Selecciona un video');
                    return;
                }
                
                const playlists = getPlaylists();
                if (!playlists[idx].videoIds.includes(videoIdx)) {
                    playlists[idx].videoIds.push(videoIdx);
                    savePlaylists(playlists);
                    loadPlaylistsPanel();
                    alert('Video agregado a la playlist');
                } else {
                    alert('Este video ya está en la playlist');
                }
            });
        });
        
        document.querySelectorAll('.delete-playlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.dataset.playlistIdx);
                if (confirm('¿Eliminar esta playlist?')) {
                    const playlists = getPlaylists();
                    playlists.splice(idx, 1);
                    savePlaylists(playlists);
                    loadPlaylistsPanel();
                    alert('Playlist eliminada');
                }
            });
        });
    }
}

document.getElementById('create-playlist-btn')?.addEventListener('click', () => {
    const name = document.getElementById('new-playlist-name')?.value?.trim();
    if (!name) {
        alert('Ingresa el nombre de la playlist');
        return;
    }
    
    const playlists = getPlaylists();
    const id = 'playlist_' + Date.now();
    playlists.push({ id, name, videoIds: [] });
    savePlaylists(playlists);
    document.getElementById('new-playlist-name').value = '';
    loadPlaylistsPanel();
    alert('Playlist creada');
});

function loadUserPlaylistAssignment() {
    const userSelect = document.getElementById('user-select');
    const checkboxContainer = document.getElementById('user-playlist-checkboxes');
    const infoBox = document.getElementById('user-playlists-info');
    const assignBtn = document.getElementById('assign-playlists-btn');
    
    if (!userSelect || !checkboxContainer) return;
    
    // Cargar lista de usuarios
    const users = getUsers();
    userSelect.innerHTML = '<option value="">-- Selecciona un usuario --</option>';
    
    for (let username in users) {
        if (username === 'admin') continue;
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        userSelect.appendChild(option);
    }
    
    // Actualizar checkboxes cuando cambia usuario
    userSelect.addEventListener('change', (e) => {
        const username = e.target.value;
        checkboxContainer.innerHTML = '';
        
        if (!username) {
            infoBox.style.display = 'none';
            assignBtn.style.display = 'none';
            return;
        }
        
        infoBox.style.display = 'block';
        assignBtn.style.display = 'block';
        
        const playlists = getPlaylists();
        const userPlaylists = JSON.parse(localStorage.getItem(`userPlaylists_${username}`)) || [];
        
        if (playlists.length === 0) {
            checkboxContainer.innerHTML = '<p style="opacity:0.7;">No hay playlists disponibles. Crea una primero.</p>';
        } else {
            playlists.forEach(playlist => {
                const label = document.createElement('label');
                label.style.cssText = 'display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px; background:rgba(255,107,0,0.05); border-radius:6px;';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = playlist.id;
                checkbox.checked = userPlaylists.includes(playlist.id);
                checkbox.style.marginTop = '3px';
                
                const textDiv = document.createElement('div');
                textDiv.innerHTML = `<div style="font-weight:600;">${playlist.name}</div><small style="opacity:0.7;">Videos: ${playlist.videoIds.length}</small>`;
                
                label.appendChild(checkbox);
                label.appendChild(textDiv);
                checkboxContainer.appendChild(label);
            });
        }
    });
}

document.getElementById('assign-playlists-btn')?.addEventListener('click', () => {
    const userSelect = document.getElementById('user-select');
    const username = userSelect?.value;
    
    if (!username) {
        alert('Selecciona un usuario');
        return;
    }
    
    const checkboxes = document.querySelectorAll('#user-playlist-checkboxes input[type="checkbox"]:checked');
    const selectedPlaylists = Array.from(checkboxes).map(cb => cb.value);
    
    localStorage.setItem(`userPlaylists_${username}`, JSON.stringify(selectedPlaylists));
    alert(`Acceso actualizado para ${username}. Tendrá acceso a ${selectedPlaylists.length} playlist(s).`);
});

// Cargar interfaces de playlist en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const existingListener = window._playlistsLoaded;
    if (!existingListener) {
        loadPlaylistsPanel();
        loadUserPlaylistAssignment();
        loadVideoPlaylistSelector();
        loadNewUserPlaylistsCheckboxes();
        window._playlistsLoaded = true;
    }
});
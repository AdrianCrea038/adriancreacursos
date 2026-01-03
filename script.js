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
    return JSON.parse(localStorage.getItem('videos')) || [];
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
// Página actual
// ====================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

// ====================
// Verificación de acceso
// ====================
const currentUserKey = localStorage.getItem('currentUser');
const users = getUsers();
const currentUser = currentUserKey ? users[currentUserKey] : null;

if (currentPage === 'panel.html' || currentPage === 'cursos.html') {
    if (!currentUser) {
        alert('Debes iniciar sesión para acceder.');
        window.location.href = 'index.html';
    } else if (currentPage === 'panel.html' && currentUser.role !== 'admin') {
        alert('Solo Adiran Reyes (admin) puede acceder al Panel de Control.');
        window.location.href = 'index.html';
    } else if (currentPage === 'cursos.html' && !currentUser.permisos?.cursos) {
        alert('No tienes permiso para ver los cursos.');
        window.location.href = 'index.html';
    } else {
        const welcomeEl = document.getElementById('welcome-user');
        if (welcomeEl) welcomeEl.textContent = currentUser.name || currentUserKey;
    }
}

// ====================
// Login en index.html
// ====================
if (currentPage === 'index.html') {
    const modal = document.getElementById('login-modal');
    if (modal) {
        const loginBtn = document.getElementById('login-btn');
        const cancelBtn = document.getElementById('cancel-login');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        document.getElementById('cursos-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.pendingPage = 'cursos.html';
            modal.classList.remove('hidden');
        });

        document.getElementById('panel-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.pendingPage = 'panel.html';
            modal.classList.remove('hidden');
        });

        cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

        loginBtn.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (users[username] && users[username].password === password) {
                localStorage.setItem('currentUser', username);
                modal.classList.add('hidden');

                if (window.pendingPage === 'panel.html' && users[username].role === 'admin') {
                    window.location.href = 'panel.html';
                } else if (window.pendingPage === 'cursos.html' && users[username].permisos?.cursos) {
                    window.location.href = 'cursos.html';
                } else {
                    alert('No tienes permiso para esta sección.');
                    localStorage.removeItem('currentUser');
                }
            } else {
                alert('Usuario o contraseña incorrectos.');
            }

            usernameInput.value = '';
            passwordInput.value = '';
        });
    }

    const heroImg = document.getElementById('hero-img');
    if (heroImg) heroImg.src = getHeroImg();

    // Cargar portafolio público
    const publicPortafolio = document.getElementById('public-portafolio');
    if (publicPortafolio) {
        publicPortafolio.innerHTML = '';
        getPortafolios().forEach(item => {
            const img = document.createElement('img');
            img.className = 'animate-on-scroll';
            img.src = item.src;
            img.alt = item.title;
            publicPortafolio.appendChild(img);
        });
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

// ====================
// Panel de Administración
// ====================
function loadAdminPanel() {
    const list = document.getElementById('users-list');
    if (!list) return;
    list.innerHTML = '';
    const users = getUsers();

    for (let user in users) {
        if (user === 'admin') continue;

        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${user}</strong><br>
                Contraseña: <span style="color:#ff6b00;">${users[user].password}</span><br>
                Permisos: ${Object.keys(users[user].permisos || {}).join(', ') || 'Ninguno'}
            </div>
            <div>
                <button class="edit-password" data-user="${user}">Cambiar Contraseña</button>
                <button class="delete-user" data-user="${user}">Eliminar Usuario</button>
            </div>
        `;
        list.appendChild(li);
    }

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
    loadAdminPanel();
    alert(`Usuario "${username}" creado`);
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
    if (select) select.selectedIndex = -1;
});

// ====================
// Videos (abren en nueva pestaña - estable en GitHub Pages)
function loadVideos() {
    const list = document.getElementById('cursos-list');
    if (!list) return;
    list.innerHTML = '';
    getVideos().forEach(video => {
        const videoId = video.url.split('embed/')[1]?.split('?')[0] || '';
        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://picsum.photos/1200/675?blur=2';

        const card = document.createElement('div');
        card.className = 'card animate-on-scroll';
        card.innerHTML = `
            <h3>${video.title}</h3>
            <p style="opacity:0.8; margin:15px 0;">${video.description || 'Sin descripción'}</p>
            <div style="position:relative; cursor:pointer;" onclick="window.open('${video.url}', '_blank')">
                <img src="${thumbnail}" style="width:100%; border-radius:15px;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-size:80px; color:white; opacity:0.9; text-shadow:0 0 30px black;">▶</div>
            </div>
        `;
        list.appendChild(card);
    });

    // Lista de videos en panel con eliminar
    const mgmtList = document.getElementById('video-management-list');
    if (mgmtList) {
        mgmtList.innerHTML = '';
        getVideos().forEach((video, index) => {
            const div = document.createElement('div');
            div.style = 'background:rgba(255,255,255,0.05); padding:15px; margin:10px 0; border-radius:10px;';
            div.innerHTML = `
                <strong>${video.title}</strong><br>
                <small>${video.description || 'Sin descripción'}</small><br>
                <button class="delete-video" data-index="${index}" style="background:#c00; color:white; border:none; padding:8px 12px; margin-top:10px; border-radius:6px; cursor:pointer;">Eliminar Video</button>
            `;
            mgmtList.appendChild(div);
        });

        document.querySelectorAll('.delete-video').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (confirm('¿Eliminar este video permanentemente?')) {
                    const videos = getVideos();
                    videos.splice(index, 1);
                    saveVideos(videos);
                    loadVideos();
                }
            });
        });
    }
}

document.getElementById('add-video-btn')?.addEventListener('click', () => {
    const title = document.getElementById('video-title')?.value.trim();
    const url = document.getElementById('video-url')?.value.trim();
    const description = document.getElementById('video-description')?.value.trim() || '';

    if (!title || !url) {
        alert('Completa título y URL');
        return;
    }

    const videos = getVideos();
    videos.push({ title, url, description });
    saveVideos(videos);
    loadVideos();
    alert('Video agregado');
    document.getElementById('video-title').value = '';
    document.getElementById('video-url').value = '';
    document.getElementById('video-description').value = '';
});

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
        savePortafolios(portafolios);
        loadPortafolios();
        alert('Trabajo agregado');
    } else if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            portafolios.push({ title, src: e.target.result });
            savePortafolios(portafolios);
            loadPortafolios();
            alert('Trabajo subido');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Ingresa URL o archivo');
    }

    document.getElementById('portafolio-title').value = '';
    document.getElementById('portafolio-url').value = '';
    document.getElementById('portafolio-file').value = '';
});

document.getElementById('change-hero-btn')?.addEventListener('click', () => {
    const url = document.getElementById('hero-url')?.value.trim();
    const file = document.getElementById('hero-file')?.files[0];

    if (url) {
        saveHeroImg(url);
        alert('Imagen actualizada');
    } else if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            saveHeroImg(e.target.result);
            alert('Imagen subida');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Ingresa URL o archivo');
    }
    document.getElementById('hero-url').value = '';
    document.getElementById('hero-file').value = '';
});

// ====================
// Cargar todo
// ====================
loadAdminPanel();
loadPortafolios();
loadVideos();

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
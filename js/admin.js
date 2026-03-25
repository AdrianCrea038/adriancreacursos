/**
 * Admin JS - Panel de Administración
 * Gestión completa de proyectos, cursos y playlists de videos
 */

let currentCourseId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await actualizarEstadisticas();
    await cargarBannerAdmin();
    await cargarProyectosAdmin();
    await cargarCursosAdmin();

    // Banner Form
    const bannerForm = document.getElementById('banner-form');
    if (bannerForm) {
        bannerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                title: document.getElementById('banner-title').value,
                subtitle: document.getElementById('banner-subtitle').value,
                description: document.getElementById('banner-description').value,
                imageUrl: document.getElementById('banner-url').value
            };
            await DB_SERVICE.updateBanner(data);
            alert("✅ Banner actualizado correctamente");
        });
    }

    // Project Form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const project = {
                title: document.getElementById('proj-title').value,
                category: document.getElementById('proj-category').value,
                imageUrl: document.getElementById('proj-url').value,
                description: document.getElementById('proj-desc').value,
                icon: document.getElementById('proj-icon').value || 'folder',
                link: "#"
            };
            await DB_SERVICE.addProject(project);
            await cargarProyectosAdmin();
            await actualizarEstadisticas();
            toggleModal('project-modal');
            alert("✅ Misión desplegada correctamente");
            document.getElementById('project-form').reset();
        });
    }

    // Course Form
    const courseForm = document.getElementById('course-form');
    if (courseForm) {
        courseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const course = {
                title: document.getElementById('course-title').value,
                price: parseFloat(document.getElementById('course-price').value),
                description: document.getElementById('course-desc').value,
                previewUrl: document.getElementById('course-preview-url').value,
                creatorComment: "Curso creado desde el panel admin",
                playlist: [],
                materials: []
            };
            await DB_SERVICE.addCourse(course);
            await cargarCursosAdmin();
            await actualizarEstadisticas();
            toggleModal('course-modal');
            alert("✅ Curso agregado correctamente");
            document.getElementById('course-form').reset();
        });
    }
});

// Navegación
window.showSection = (sectionId) => {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('bg-neonPurple/10', 'text-neonPurple');
        l.classList.add('text-white/40');
    });
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        activeNav.classList.add('bg-neonPurple/10', 'text-neonPurple');
        activeNav.classList.remove('text-white/40');
    }
    lucide.createIcons();
};

// Modal Toggle
window.toggleModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.toggle('hidden');
};

// Estadísticas
async function actualizarEstadisticas() {
    try {
        const courses = await DB_SERVICE.getCourses();
        const projects = await DB_SERVICE.getProjects();
        const users = await DB_SERVICE.getUsers();
        
        if (document.getElementById('stat-courses')) document.getElementById('stat-courses').innerText = courses.length;
        if (document.getElementById('stat-projects')) document.getElementById('stat-projects').innerText = projects.length;
        if (document.getElementById('stat-users')) document.getElementById('stat-users').innerText = users.length;
    } catch (err) {
        console.error("Error actualizando estadísticas:", err);
    }
}

// Banner
async function cargarBannerAdmin() {
    const banner = await DB_SERVICE.getBanner();
    if (banner) {
        if (document.getElementById('banner-title')) document.getElementById('banner-title').value = banner.title || '';
        if (document.getElementById('banner-subtitle')) document.getElementById('banner-subtitle').value = banner.subtitle || '';
        if (document.getElementById('banner-description')) document.getElementById('banner-description').value = banner.description || '';
        if (document.getElementById('banner-url')) document.getElementById('banner-url').value = banner.imageUrl || '';
    }
}

// Proyectos
async function cargarProyectosAdmin() {
    const projects = await DB_SERVICE.getProjects();
    const list = document.getElementById('admin-projects-list');
    if (list) {
        list.innerHTML = projects.map(p => `
            <div class="gamer-card p-6 flex items-center justify-between group">
                <div class="flex items-center space-x-4">
                    <img src="${p.imageUrl}" class="w-12 h-12 object-cover border border-white/10 rounded">
                    <div>
                        <h4 class="text-sm font-orbitron font-bold uppercase tracking-wider">${p.title}</h4>
                        <p class="text-[10px] text-white/40 uppercase tracking-widest">${p.category}</p>
                    </div>
                </div>
                <button class="text-white/20 hover:text-neonPurple transition-colors" onclick="alert('Edición de misión próximamente')">
                    <i data-lucide="settings" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

// Cursos con botón para editar playlist
async function cargarCursosAdmin() {
    const courses = await DB_SERVICE.getCourses();
    const list = document.getElementById('admin-courses-list');
    if (list) {
        list.innerHTML = courses.map(c => `
            <div class="gamer-card p-6">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-4">
                        <img src="${c.previewUrl}" class="w-16 h-16 object-cover border border-white/10 rounded">
                        <div>
                            <h4 class="text-lg font-orbitron font-bold uppercase tracking-wider">${c.title}</h4>
                            <p class="text-sm text-neonBlue">$${c.price} USD</p>
                            <p class="text-xs text-white/40 mt-1">${c.playlist?.length || 0} lecciones en playlist</p>
                        </div>
                    </div>
                </div>
                <p class="text-white/60 text-sm mb-4 line-clamp-2">${c.description}</p>
                <div class="flex space-x-3">
                    <button onclick="abrirEditorPlaylist(${c.id}, '${c.title.replace(/'/g, "\\'")}')" class="gamer-btn !py-2 !px-4 text-xs flex items-center space-x-2">
                        <i data-lucide="list-video" class="w-3 h-3"></i>
                        <span>Editar Playlist</span>
                    </button>
                    <button class="text-white/40 hover:text-neonPurple text-xs" onclick="alert('Edición de curso próximamente')">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

// Abrir editor de playlist
window.abrirEditorPlaylist = async (courseId, courseTitle) => {
    currentCourseId = courseId;
    const courses = await DB_SERVICE.getCourses();
    const course = courses.find(c => c.id === courseId);
    
    document.getElementById('playlist-course-title').innerHTML = `Editando: <span class="text-neonPurple">${courseTitle}</span>`;
    
    const playlistContainer = document.getElementById('playlist-items');
    if (course.playlist && course.playlist.length > 0) {
        playlistContainer.innerHTML = course.playlist.map((item, idx) => `
            <div class="bg-white/5 border border-white/10 p-4 rounded flex items-center justify-between group">
                <div class="flex-1 space-y-2">
                    <input type="text" placeholder="Título del video" value="${item.title.replace(/"/g, '&quot;')}" 
                        class="playlist-title w-full bg-transparent border border-white/10 rounded p-2 text-sm focus:border-neonPurple outline-none"
                        data-idx="${idx}">
                    <div class="flex space-x-2">
                        <input type="text" placeholder="Duración (ej: 15:30)" value="${item.duration}" 
                            class="playlist-duration w-24 bg-transparent border border-white/10 rounded p-2 text-xs focus:border-neonPurple outline-none"
                            data-idx="${idx}">
                        <input type="text" placeholder="URL del video" value="${item.videoUrl}" 
                            class="playlist-url flex-1 bg-transparent border border-white/10 rounded p-2 text-xs focus:border-neonPurple outline-none"
                            data-idx="${idx}">
                        <label class="flex items-center space-x-2 text-xs">
                            <input type="checkbox" class="playlist-free" data-idx="${idx}" ${item.free ? 'checked' : ''}>
                            <span>Gratis</span>
                        </label>
                    </div>
                </div>
                <button onclick="eliminarItemPlaylist(${idx})" class="ml-3 text-red-500/60 hover:text-red-500">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `).join('');
    } else {
        playlistContainer.innerHTML = '<p class="text-white/40 text-center py-8">No hay videos en esta playlist. Haz clic en "Agregar Video" para comenzar.</p>';
    }
    
    toggleModal('playlist-modal');
    lucide.createIcons();
    
    // Bindear eventos para actualizar datos
    setTimeout(() => {
        document.querySelectorAll('.playlist-title, .playlist-duration, .playlist-url, .playlist-free').forEach(el => {
            el.addEventListener('change', () => actualizarPlaylistEnMemoria());
        });
    }, 100);
};

// Actualizar playlist en memoria (se guarda al hacer clic en guardar)
let playlistMemoria = [];

function actualizarPlaylistEnMemoria() {
    const items = document.querySelectorAll('#playlist-items .bg-white\\/5');
    playlistMemoria = Array.from(items).map((item, idx) => ({
        id: idx + 1,
        title: item.querySelector('.playlist-title')?.value || '',
        duration: item.querySelector('.playlist-duration')?.value || '',
        videoUrl: item.querySelector('.playlist-url')?.value || '',
        free: item.querySelector('.playlist-free')?.checked || false
    }));
}

// Agregar nuevo item a la playlist
window.addPlaylistItem = () => {
    const container = document.getElementById('playlist-items');
    const newIdx = playlistMemoria.length;
    
    const newItemHtml = `
        <div class="bg-white/5 border border-white/10 p-4 rounded flex items-center justify-between group">
            <div class="flex-1 space-y-2">
                <input type="text" placeholder="Título del video" value="" 
                    class="playlist-title w-full bg-transparent border border-white/10 rounded p-2 text-sm focus:border-neonPurple outline-none"
                    data-idx="${newIdx}">
                <div class="flex space-x-2">
                    <input type="text" placeholder="Duración (ej: 15:30)" value="" 
                        class="playlist-duration w-24 bg-transparent border border-white/10 rounded p-2 text-xs focus:border-neonPurple outline-none"
                        data-idx="${newIdx}">
                    <input type="text" placeholder="URL del video" value="" 
                        class="playlist-url flex-1 bg-transparent border border-white/10 rounded p-2 text-xs focus:border-neonPurple outline-none"
                        data-idx="${newIdx}">
                    <label class="flex items-center space-x-2 text-xs">
                        <input type="checkbox" class="playlist-free" data-idx="${newIdx}">
                        <span>Gratis</span>
                    </label>
                </div>
            </div>
            <button onclick="eliminarItemPlaylist(${newIdx})" class="ml-3 text-red-500/60 hover:text-red-500">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    if (container.innerHTML.includes('No hay videos')) {
        container.innerHTML = newItemHtml;
    } else {
        container.insertAdjacentHTML('beforeend', newItemHtml);
    }
    
    playlistMemoria.push({ id: newIdx + 1, title: '', duration: '', videoUrl: '', free: false });
    
    // Bindear eventos a los nuevos inputs
    document.querySelectorAll('.playlist-title, .playlist-duration, .playlist-url, .playlist-free').forEach(el => {
        el.removeEventListener('change', actualizarPlaylistEnMemoria);
        el.addEventListener('change', actualizarPlaylistEnMemoria);
    });
    
    lucide.createIcons();
};

// Eliminar item de playlist
window.eliminarItemPlaylist = (idx) => {
    const items = document.querySelectorAll('#playlist-items .bg-white\\/5');
    if (items[idx]) items[idx].remove();
    actualizarPlaylistEnMemoria();
};

// Guardar playlist
window.savePlaylist = async () => {
    actualizarPlaylistEnMemoria();
    
    const playlistParaGuardar = playlistMemoria.map((item, i) => ({
        id: i + 1,
        title: item.title,
        duration: item.duration,
        videoUrl: item.videoUrl,
        free: item.free
    }));
    
    const courses = await DB_SERVICE.getCourses();
    const courseIndex = courses.findIndex(c => c.id === currentCourseId);
    
    if (courseIndex !== -1) {
        courses[courseIndex].playlist = playlistParaGuardar;
        localStorage.setItem('arc_courses', JSON.stringify(courses));
        alert("✅ Playlist guardada correctamente");
        toggleModal('playlist-modal');
        await cargarCursosAdmin();
    } else {
        alert("❌ Error al guardar la playlist");
    }
};
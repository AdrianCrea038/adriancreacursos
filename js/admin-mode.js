// ================================================
// admin-mode.js - FUNCIONES DE ADMIN
// ================================================

let adminMode = false;
let textosEditables = JSON.parse(localStorage.getItem('textosEditables')) || {};

// ================================================
// VERIFICAR MODO ADMIN
// ================================================
function verificarAdmin() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    const adminLogged = sessionStorage.getItem('admin_logged');
    
    console.log('🔍 Verificando admin:', { adminParam, adminLogged });
    
    if (adminParam === 'true' && adminLogged === 'true') {
        adminMode = true;
        window.adminMode = true;
        document.body.classList.add('admin-mode');
        
        // Crear botón de edición (lápiz) - POSICIÓN CORREGIDA (80px)
        if (!document.getElementById('adminEditBtn')) {
            const btn = document.createElement('button');
            btn.id = 'adminEditBtn';
            btn.className = 'admin-edit-btn';
            btn.innerHTML = '<i class="fas fa-pen"></i>';
            btn.onclick = () => mostrarToast('✅ Modo edición activado');
            document.body.appendChild(btn);
            console.log('✅ Botón de edición creado');
        }
        
        // Crear botón de cerrar sesión - POSICIÓN CORREGIDA (20px)
        if (!document.getElementById('adminLogoutBtn')) {
            const logout = document.createElement('button');
            logout.id = 'adminLogoutBtn';
            logout.className = 'admin-logout-btn';
            logout.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
            logout.onclick = cerrarSesionAdmin;
            document.body.appendChild(logout);
            console.log('✅ Botón de cerrar sesión creado');
        }
        
        // MOSTRAR BOTÓN DE VIDEOS (el que está en el HTML)
        const btnVideos = document.getElementById('adminVideosBtn');
        if (btnVideos) {
            btnVideos.style.display = 'flex';
            console.log('✅ Botón + visible desde HTML');
        } else {
            console.log('❌ No se encontró el botón de videos en HTML, creándolo...');
            // Si no existe en HTML, crearlo dinámicamente
            const videosBtn = document.createElement('a');
            videosBtn.id = 'adminVideosBtn';
            videosBtn.className = 'admin-videos-btn';
            videosBtn.href = 'admin-videos.html';
            videosBtn.title = 'Administrar videos y usuarios';
            videosBtn.innerHTML = '<i class="fas fa-plus"></i>';
            videosBtn.style.display = 'flex';
            document.body.appendChild(videosBtn);
            console.log('✅ Botón + creado dinámicamente');
        }
        
        // Mostrar botón de agregar proyecto
        const addBtn = document.getElementById('adminAddProjectBtn');
        if (addBtn) addBtn.style.display = 'block';
        
        // Agregar toolbars de edición
        agregarToolbarsEdicion();
        
        // Cargar textos guardados
        cargarTextosGuardados();
        
        // Renderizar proyectos si existe la función
        if (typeof window.renderizarProyectos === 'function') {
            window.renderizarProyectos();
        }
    } else {
        console.log('❌ No es modo admin');
        
        // Asegurar que los botones NO estén visibles
        const btnVideos = document.getElementById('adminVideosBtn');
        if (btnVideos) btnVideos.style.display = 'none';
        
        const btnEdit = document.getElementById('adminEditBtn');
        if (btnEdit) btnEdit.remove();
        
        const btnLogout = document.getElementById('adminLogoutBtn');
        if (btnLogout) btnLogout.remove();
    }
}

function cerrarSesionAdmin() {
    sessionStorage.removeItem('admin_logged');
    window.location.href = 'index.html';
}

// ================================================
// EDICIÓN DE TEXTOS
// ================================================
function agregarToolbarsEdicion() {
    document.querySelectorAll('[data-editable]').forEach(elemento => {
        if (elemento.querySelector('.edit-toolbar')) return;
        
        const toolbar = document.createElement('div');
        toolbar.className = 'edit-toolbar';
        
        const tipo = elemento.getAttribute('data-type') || 'text';
        
        if (tipo === 'image') {
            toolbar.innerHTML = `
                <button onclick="editarImagen(this)"><i class="fas fa-image"></i> Cambiar imagen</button>
            `;
        } else {
            toolbar.innerHTML = `
                <button onclick="editarTexto(this)"><i class="fas fa-edit"></i> Editar</button>
            `;
        }
        
        elemento.appendChild(toolbar);
    });
}

window.editarTexto = function(btn) {
    const elemento = btn.closest('[data-editable]');
    const key = elemento.getAttribute('data-editable');
    const textoActual = elemento.innerText.replace('Editar', '').trim();
    
    const nuevoTexto = prompt('Editar texto:', textoActual);
    if (nuevoTexto && nuevoTexto.trim() !== '') {
        elemento.innerText = nuevoTexto.trim();
        textosEditables[key] = nuevoTexto.trim();
        localStorage.setItem('textosEditables', JSON.stringify(textosEditables));
        mostrarToast('✅ Texto actualizado');
    }
};

window.editarImagen = function(btn) {
    const elemento = btn.closest('[data-editable]');
    const key = elemento.getAttribute('data-editable');
    
    // Buscar el modal de edición de imágenes (debe existir en el HTML)
    const modal = document.getElementById('imageEditorModal');
    if (!modal) {
        mostrarToast('❌ Error: No se encontró el editor de imágenes', 'error');
        return;
    }
    
    document.getElementById('currentImageElement').value = key;
    
    const img = elemento.querySelector('img');
    const preview = document.getElementById('imagePreview');
    const icon = document.getElementById('imagePreviewIcon');
    const input = document.getElementById('imageUrlInput');
    
    if (img) {
        preview.src = img.src;
        preview.style.display = 'block';
        if (icon) icon.style.display = 'none';
        input.value = img.src;
    } else {
        if (preview) preview.style.display = 'none';
        if (icon) icon.style.display = 'block';
        input.value = '';
    }
    
    modal.classList.add('active');
};

window.cerrarImageEditor = function() {
    const modal = document.getElementById('imageEditorModal');
    if (modal) modal.classList.remove('active');
};

window.guardarImagen = function() {
    const key = document.getElementById('currentImageElement').value;
    const url = document.getElementById('imageUrlInput').value.trim();
    
    if (!url) {
        mostrarToast('❌ Ingresa una URL válida', 'error');
        return;
    }
    
    const elemento = document.querySelector(`[data-editable="${key}"]`);
    
    // Limpiar el contenido actual
    elemento.innerHTML = '';
    
    // Crear nueva imagen
    const img = document.createElement('img');
    img.src = url;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.position = 'absolute';
    img.style.inset = '0';
    elemento.appendChild(img);
    
    // Guardar en localStorage
    textosEditables[key] = url;
    localStorage.setItem('textosEditables', JSON.stringify(textosEditables));
    
    mostrarToast('✅ Imagen actualizada');
    cerrarImageEditor();
    
    // Re-agregar toolbar
    agregarToolbarsEdicion();
};

function cargarTextosGuardados() {
    for (const [key, valor] of Object.entries(textosEditables)) {
        const elemento = document.querySelector(`[data-editable="${key}"]`);
        if (elemento) {
            // Verificar si es una imagen (por el key o si contiene 'image' en el nombre)
            if (key.includes('image') || key.includes('img') || elemento.getAttribute('data-type') === 'image') {
                elemento.innerHTML = '';
                const img = document.createElement('img');
                img.src = valor;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.position = 'absolute';
                img.style.inset = '0';
                elemento.appendChild(img);
            } else {
                elemento.innerText = valor;
            }
        }
    }
}

// ================================================
// TOAST DE NOTIFICACIÓN
// ================================================
function mostrarToast(mensaje, tipo = 'success') {
    // Eliminar toast existente
    const toastExistente = document.querySelector('.admin-toast');
    if (toastExistente) toastExistente.remove();
    
    // Crear nuevo toast
    const toast = document.createElement('div');
    toast.className = `admin-toast ${tipo}`;
    const icono = tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${icono}"></i> ${mensaje}`;
    document.body.appendChild(toast);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        if (toast) toast.remove();
    }, 3000);
}

window.mostrarToast = mostrarToast;

// ================================================
// VERIFICAR Y LIMPIAR BOTONES AL SALIR DEL MODO
// ================================================
function limpiarBotonesAdmin() {
    const botones = ['adminEditBtn', 'adminLogoutBtn', 'adminVideosBtn'];
    botones.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            if (id === 'adminVideosBtn') {
                btn.style.display = 'none'; // Ocultar pero mantener en DOM
            } else {
                btn.remove(); // Eliminar los otros
            }
        }
    });
}

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 admin-mode.js cargado');
    verificarAdmin();
});

// También verificar cuando la página termine de cargar
window.addEventListener('load', function() {
    console.log('🔄 window.load - verificando admin');
    verificarAdmin();
});

// Exponer funciones globales
window.verificarAdmin = verificarAdmin;
window.cerrarSesionAdmin = cerrarSesionAdmin;
window.agregarToolbarsEdicion = agregarToolbarsEdicion;
window.cargarTextosGuardados = cargarTextosGuardados;
window.limpiarBotonesAdmin = limpiarBotonesAdmin;
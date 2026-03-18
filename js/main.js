// ================================================
// main.js - FUNCIONES PRINCIPALES
// ================================================

// Variables globales
let proyectos = JSON.parse(localStorage.getItem('proyectos')) || [
    {
        id: 1,
        titulo: "Arte con IA",
        categoria: "ai",
        descripcion: "Generación de imágenes con inteligencia artificial",
        imagen: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        titulo: "Identidad Corporativa",
        categoria: "diseno",
        descripcion: "Diseño de marca para startups",
        imagen: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        titulo: "Producción Audiovisual",
        categoria: "video",
        descripcion: "Edición de video profesional",
        imagen: "https://images.unsplash.com/photo-1574717024453-354056af4e7f?w=400&h=400&fit=crop"
    }
];

// ================================================
// FUNCIONES DE PROYECTOS
// ================================================
function renderizarProyectos() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    if (proyectos.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px;">No hay proyectos aún. Agrega uno desde el botón superior.</div>';
        return;
    }

    let html = '';
    proyectos.forEach(proyecto => {
        html += `
            <div class="portfolio-item" data-id="${proyecto.id}">
                <img src="${proyecto.imagen}" alt="${proyecto.titulo}" 
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop';">
                <div class="portfolio-overlay">
                    <h3>${proyecto.titulo}</h3>
                    <p>${proyecto.descripcion}</p>
                    ${window.adminMode ? `
                        <div class="portfolio-admin-actions">
                            <button onclick="editarProyecto(${proyecto.id})"><i class="fas fa-edit"></i> Editar</button>
                            <button class="delete-btn" onclick="eliminarProyecto(${proyecto.id})"><i class="fas fa-trash"></i> Eliminar</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
    guardarProyectos();
}

function guardarProyectos() {
    localStorage.setItem('proyectos', JSON.stringify(proyectos));
}

window.abrirFormNuevoProyecto = function() {
    document.getElementById('proyectoModalTitle').innerText = 'Nuevo Proyecto';
    document.getElementById('proyectoId').value = '';
    document.getElementById('proyectoTitulo').value = '';
    document.getElementById('proyectoCategoria').value = 'ai';
    document.getElementById('proyectoDescripcion').value = '';
    document.getElementById('proyectoImagen').value = '';
    
    const preview = document.getElementById('proyectoImagePreview');
    preview.innerHTML = '<i class="fas fa-image"></i>';
    
    document.getElementById('proyectoModal').classList.add('active');
};

window.editarProyecto = function(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (!proyecto) return;

    document.getElementById('proyectoModalTitle').innerText = 'Editar Proyecto';
    document.getElementById('proyectoId').value = proyecto.id;
    document.getElementById('proyectoTitulo').value = proyecto.titulo;
    document.getElementById('proyectoCategoria').value = proyecto.categoria;
    document.getElementById('proyectoDescripcion').value = proyecto.descripcion;
    document.getElementById('proyectoImagen').value = proyecto.imagen;

    const preview = document.getElementById('proyectoImagePreview');
    preview.innerHTML = `<img src="${proyecto.imagen}" alt="Preview">`;

    document.getElementById('proyectoModal').classList.add('active');
};

window.cerrarProyectoModal = function() {
    document.getElementById('proyectoModal').classList.remove('active');
};

window.guardarProyecto = function() {
    const id = document.getElementById('proyectoId').value;
    const titulo = document.getElementById('proyectoTitulo').value.trim();
    const categoria = document.getElementById('proyectoCategoria').value;
    const descripcion = document.getElementById('proyectoDescripcion').value.trim();
    const imagen = document.getElementById('proyectoImagen').value.trim();

    if (!titulo) {
        if (window.mostrarToast) window.mostrarToast('❌ El título es requerido', 'error');
        else alert('El título es requerido');
        return;
    }

    if (!imagen) {
        if (window.mostrarToast) window.mostrarToast('❌ La URL de la imagen es requerida', 'error');
        else alert('La URL de la imagen es requerida');
        return;
    }

    const proyectoData = {
        titulo,
        categoria,
        descripcion: descripcion || 'Sin descripción',
        imagen
    };

    if (id) {
        const index = proyectos.findIndex(p => p.id == id);
        proyectos[index] = { ...proyectos[index], ...proyectoData };
        if (window.mostrarToast) window.mostrarToast('✅ Proyecto actualizado');
        else alert('Proyecto actualizado');
    } else {
        const nuevoId = Date.now();
        proyectos.push({ id: nuevoId, ...proyectoData });
        if (window.mostrarToast) window.mostrarToast('✅ Proyecto creado');
        else alert('Proyecto creado');
    }

    guardarProyectos();
    cerrarProyectoModal();
    renderizarProyectos();
};

window.eliminarProyecto = function(id) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;
    
    proyectos = proyectos.filter(p => p.id !== id);
    guardarProyectos();
    if (window.mostrarToast) window.mostrarToast('✅ Proyecto eliminado');
    else alert('Proyecto eliminado');
    renderizarProyectos();
};

// Preview de imagen en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const imagenInput = document.getElementById('proyectoImagen');
    if (imagenInput) {
        imagenInput.addEventListener('input', function(e) {
            const preview = document.getElementById('proyectoImagePreview');
            const url = e.target.value.trim();
            if (url) {
                preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fas fa-image\'></i>';">`;
            } else {
                preview.innerHTML = '<i class="fas fa-image"></i>';
            }
        });
    }
});

// ================================================
// FUNCIONES DE UTILIDAD
// ================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    renderizarProyectos();
});
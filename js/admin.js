/* ============================================================
   /js/admin.js - COMPLETO CON ASIGNACIÓN Y CARRUSEL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // ===== VERIFICACIÓN DE AUTENTICACIÓN =====
    // ============================================================

    if(!auth.checkAuth(true)) return;
    const user = auth.getCurrentUser(); 
    if(user) document.getElementById('userName').textContent = `${user.username} (${user.role})`;

    // ============================================================
    // ===== MENÚ LATERAL =====
    // ============================================================

    const menuBtns = document.querySelectorAll('.admin-menu button');
    const sections = document.querySelectorAll('.admin-section');
    
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            menuBtns.forEach(b=>b.classList.remove('active'));
            sections.forEach(s=>s.style.display='none');
            btn.classList.add('active');
            document.getElementById(`section-${btn.dataset.section}`).style.display='block';
            loadSection(btn.dataset.section);
        });
    });
    
    loadSection('projects');
    
    function loadSection(sec) {
        if(sec==='projects') loadProjects();
        if(sec==='courses') loadCourses();
        if(sec==='users') loadUsers();
        if(sec==='settings') loadSettings();
        if(sec==='assign') loadAssignSection();
        if(sec==='carousel') loadCarouselSection();
    }

    // ============================================================
    // ===== CRUD - PROYECTOS =====
    // ============================================================

    const addProjForm = document.getElementById('addProjectForm');
    if(addProjForm) {
        addProjForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            db.addProject({
                title: document.getElementById('projTitle').value,
                category: document.getElementById('projCategory').value.toLowerCase(),
                image: document.getElementById('projImage').value
            }); 
            loadProjects(); 
            addProjForm.reset(); 
            showNotif('Proyecto agregado','success'); 
        });
    }
    
    function loadProjects() { 
        const p = db.getProjects();
        const c = document.getElementById('projectsList'); 
        if(!c) return; 
        let h = `<div class="table-responsive"><table><thead><tr><th>ID</th><th>Título</th><th>Cat</th><th>Imagen</th><th>Acciones</th></tr></thead><tbody>`;
        p.forEach(x => {
            h += `<tr><td>${x.id}</td><td>${x.title}</td><td style="color:var(--primary-color)">${x.category}</td><td><img src="${x.image}" style="width:50px;height:50px;object-fit:cover;border-radius:3px"></td><td><button class="btn-delete" onclick="deleteProject(${x.id})"><i class="fas fa-trash"></i> Eliminar</button></td></tr>`;
        });
        h += '</tbody></table></div>';
        c.innerHTML = h;
    }
    
    window.deleteProject = id => { 
        if(confirm('¿Eliminar este proyecto?')) { 
            db.deleteProject(id); 
            loadProjects(); 
            showNotif('Proyecto eliminado','info'); 
        } 
    };

    // ============================================================
    // ===== CRUD - CURSOS =====
    // ============================================================

    const addCourseForm = document.getElementById('addCourseForm');
    if(addCourseForm) {
        addCourseForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            db.addCourse({
                title: document.getElementById('courseTitle').value,
                description: document.getElementById('courseDesc').value,
                price: document.getElementById('coursePrice').value,
                image: document.getElementById('courseImage').value
            }); 
            loadCourses(); 
            addCourseForm.reset(); 
            showNotif('Curso agregado','success'); 
        });
    }
    
    function loadCourses() { 
        const c = db.getCourses();
        const ct = document.getElementById('coursesList'); 
        if(!ct) return; 
        let h = `<div class="table-responsive"><table><thead><tr><th>ID</th><th>Título</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>`;
        c.forEach(x => {
            h += `<tr><td>${x.id}</td><td>${x.title}</td><td style="color:var(--primary-color);font-weight:bold">$${x.price}</td><td><button class="btn-delete" onclick="deleteCourse(${x.id})"><i class="fas fa-trash"></i> Eliminar</button></td></tr>`;
        });
        h += '</tbody></table></div>';
        ct.innerHTML = h;
    }
    
    window.deleteCourse = id => { 
        if(confirm('¿Eliminar este curso?')) { 
            db.deleteCourse(id); 
            loadCourses(); 
            showNotif('Curso eliminado','info'); 
        } 
    };

    // ============================================================
    // ===== CRUD - USUARIOS (CON ASIGNACIÓN DE CURSOS) =====
    // ============================================================

    function loadCoursesChecklist(containerId, selectedCourses = []) {
        const courses = db.getCourses();
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        courses.forEach(course => {
            const isChecked = selectedCourses.includes(course.id);
            container.innerHTML += `
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:pointer">
                    <input type="checkbox" value="${course.id}" ${isChecked ? 'checked' : ''} class="course-checkbox">
                    <span style="color:#fff">${course.title}</span>
                    <span style="color:var(--text-muted);font-size:0.75rem">($${course.price})</span>
                </label>
            `;
        });
    }
    
    function getSelectedCoursesFromChecklist(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const checkboxes = container.querySelectorAll('.course-checkbox:checked');
        return Array.from(checkboxes).map(cb => parseInt(cb.value));
    }
    
    // Cargar checklist para nuevo usuario
    loadCoursesChecklist('newUserCoursesChecklist', []);
    
    const addUserForm = document.getElementById('addUserForm');
    if(addUserForm) {
        addUserForm.addEventListener('submit', e => { 
            e.preventDefault(); 
            const newUser = {
                username: document.getElementById('newUsername').value,
                password: document.getElementById('newPassword').value,
                role: document.getElementById('newRole').value
            };
            db.addUser(newUser);
            
            // Obtener el usuario recién creado
            const users = db.getUsers();
            const createdUser = users.find(u => u.username === newUser.username);
            
            // Asignar cursos seleccionados
            const selectedCourses = getSelectedCoursesFromChecklist('newUserCoursesChecklist');
            selectedCourses.forEach(courseId => {
                db.assignCourseToUser(createdUser.id, courseId);
            });
            
            loadUsers();
            addUserForm.reset();
            loadCoursesChecklist('newUserCoursesChecklist', []);
            showNotif('Usuario creado con cursos asignados','success');
        });
    }
    
    function loadUsers() { 
        const u = db.getUsers();
        const ct = document.getElementById('usersList'); 
        if(!ct) return; 
        let h = `<div class="table-responsive"><table><thead><tr><th>ID</th><th>Usuario</th><th>Rol</th><th>Acciones</th></tr></thead><tbody>`;
        u.forEach(x => {
            const rc = x.role==='master' ? 'color:#ff0055' : 'color:var(--primary-color)';
            h += `<tr><td>${x.id}</td><td>${x.username}</td><td style="${rc};font-weight:bold">${x.role.toUpperCase()}</td><td><button class="btn-delete" onclick="deleteUser(${x.id})" ${x.role==='master' ? 'disabled style="opacity:0.5"' : ''}><i class="fas fa-trash"></i> Eliminar</button></td></tr>`;
        });
        h += '</tbody></table></div>';
        ct.innerHTML = h;
    }
    
    window.deleteUser = id => { 
        const cu = auth.getCurrentUser(); 
        if(cu && cu.id === id) { 
            showNotif('No puedes eliminarte a ti mismo','error'); 
            return; 
        } 
        if(confirm('¿Eliminar este usuario?')) { 
            db.deleteUser(id); 
            loadUsers(); 
            showNotif('Usuario eliminado','info'); 
        } 
    };

    // ============================================================
    // ===== ASIGNACIÓN DE CURSOS A USUARIO EXISTENTE =====
    // ============================================================
    
    let currentAssignUserId = null;
    
    function loadAssignSection() {
        const users = db.getUsers();
        const userSelect = document.getElementById('assignUserId');
        if (userSelect) {
            userSelect.innerHTML = '<option value="">Seleccionar Usuario</option>';
            users.forEach(u => {
                userSelect.innerHTML += `<option value="${u.id}">${u.username} (${u.role})</option>`;
            });
        }
        
        document.getElementById('assignUserId').addEventListener('change', (e) => {
            currentAssignUserId = parseInt(e.target.value);
            if (currentAssignUserId) {
                const userCourses = db.getUserCourses(currentAssignUserId);
                loadCoursesChecklist('assignCoursesChecklist', userCourses);
            } else {
                document.getElementById('assignCoursesChecklist').innerHTML = '<p style="color:var(--text-muted)">Selecciona un usuario</p>';
            }
        });
        
        document.getElementById('saveAssignmentsBtn').addEventListener('click', () => {
            if (!currentAssignUserId) {
                showNotif('Selecciona un usuario primero', 'error');
                return;
            }
            
            // Obtener todas las asignaciones actuales
            const allAssignments = db.getAllAssignments();
            const selectedCourses = getSelectedCoursesFromChecklist('assignCoursesChecklist');
            
            // Reemplazar asignaciones del usuario
            allAssignments[currentAssignUserId] = selectedCourses;
            localStorage.setItem('ar_user_courses', JSON.stringify(allAssignments));
            
            showNotif('Asignaciones guardadas', 'success');
            loadAssignmentsList();
        });
        
        loadAssignmentsList();
    }
    
    function loadAssignmentsList() {
        const assignments = db.getAllAssignments();
        const users = db.getUsers();
        const courses = db.getCourses();
        const container = document.getElementById('assignmentsList');
        if (!container) return;
        
        let html = `<div class="table-responsive"><table><thead><tr><th>Usuario</th><th>Cursos Asignados</th><th>Acciones</th></tr></thead><tbody>`;
        
        users.forEach(user => {
            const userCourses = assignments[user.id] || [];
            const courseNames = userCourses.map(cid => {
                const course = courses.find(c => c.id == cid);
                return course ? course.title : 'Desconocido';
            }).join(', ');
            
            html += `<tr>
                        <td>${user.username} <span style="color:var(--primary-color)">(${user.role})</span></td>
                        <td>${courseNames || 'Ninguno'}</td>
                        <td><button class="btn-delete" onclick="removerTodasAsignaciones(${user.id})"><i class="fas fa-trash"></i> Limpiar</button></td>
                     </tr>`;
        });
        
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    }
    
    window.removerTodasAsignaciones = (userId) => {
        if (confirm('¿Eliminar TODOS los cursos asignados a este usuario?')) {
            const assignments = db.getAllAssignments();
            assignments[userId] = [];
            localStorage.setItem('ar_user_courses', JSON.stringify(assignments));
            loadAssignmentsList();
            if (currentAssignUserId === userId) {
                loadCoursesChecklist('assignCoursesChecklist', []);
            }
            showNotif('Cursos removidos del usuario', 'info');
        }
    };

    // ============================================================
    // ===== CONFIGURACIÓN DEL CARRUSEL HERO =====
    // ============================================================
    
    function loadCarouselSection() {
        const allCourses = db.getCourses();
        const carouselConfig = db.getCarouselConfig();
        const enabledCourses = carouselConfig.enabledCourses || [];
        
        const container = document.getElementById('carouselCoursesChecklist');
        container.innerHTML = '';
        
        allCourses.forEach(course => {
            const isChecked = enabledCourses.includes(course.id);
            container.innerHTML += `
                <label style="display:flex;align-items:center;gap:10px;margin-bottom:12px;cursor:pointer;padding:8px;border-radius:5px;background:rgba(255,255,255,0.03)">
                    <input type="checkbox" value="${course.id}" ${isChecked ? 'checked' : ''} class="carousel-course-checkbox">
                    <img src="${course.image}" style="width:50px;height:50px;object-fit:cover;border-radius:5px">
                    <div style="flex:1">
                        <div style="color:#fff;font-weight:bold">${course.title}</div>
                        <div style="color:var(--text-muted);font-size:0.75rem">${course.description.substring(0,60)}...</div>
                    </div>
                    <span style="color:var(--primary-color);font-weight:bold">$${course.price}</span>
                </label>
            `;
        });
        
        // Vista previa
        updateCarouselPreview(enabledCourses);
        
        document.getElementById('saveCarouselBtn').onclick = () => {
            const checkboxes = document.querySelectorAll('#carouselCoursesChecklist .carousel-course-checkbox:checked');
            const selectedCourses = Array.from(checkboxes).map(cb => parseInt(cb.value));
            db.saveCarouselConfig({ enabledCourses: selectedCourses });
            updateCarouselPreview(selectedCourses);
            showNotif('Configuración del carrusel guardada', 'success');
            
            // Notificar a index.html que cambió el carrusel
            localStorage.setItem('ar_carousel_updated', Date.now().toString());
        };
    }
    
    function updateCarouselPreview(enabledCourses) {
        const previewContainer = document.getElementById('carouselPreviewList');
        const allCourses = db.getCourses();
        const carouselCourses = allCourses.filter(c => enabledCourses.includes(c.id));
        
        if (carouselCourses.length === 0) {
            previewContainer.innerHTML = '<p style="color:var(--text-muted)">No hay cursos seleccionados para el carrusel</p>';
            return;
        }
        
        previewContainer.innerHTML = '';
        carouselCourses.forEach(course => {
            previewContainer.innerHTML += `
                <div style="width:200px;background:rgba(255,255,255,0.05);border-radius:10px;overflow:hidden;border:1px solid rgba(255,0,51,0.3)">
                    <img src="${course.image}" style="width:100%;height:120px;object-fit:cover">
                    <div style="padding:10px">
                        <div style="font-size:0.8rem;color:#fff">${course.title}</div>
                        <div style="font-size:0.7rem;color:var(--primary-color)">$${course.price}</div>
                    </div>
                </div>
            `;
        });
    }

    // ============================================================
    // ===== CONFIGURACIÓN GENERAL =====
    // ============================================================

    function loadSettings() { 
        const s = db.getProjects().length;
        const c = db.getCourses().length;
        const u = db.getUsers().length;
        document.getElementById('statProjects').textContent = s;
        document.getElementById('statCourses').textContent = c;
        document.getElementById('statUsers').textContent = u;
        const cfg = db.getConfig(); 
        if(cfg) { 
            document.getElementById('whatsappNumber').value = cfg.whatsapp || '50432513558'; 
            document.getElementById('contactEmail').value = cfg.email || 'contacto@adrianreyescrea.com'; 
        } 
    }

    document.getElementById('saveSettings')?.addEventListener('click', () => { 
        db.saveConfig({
            whatsapp: document.getElementById('whatsappNumber').value,
            email: document.getElementById('contactEmail').value
        });
        localStorage.setItem('ar_config_updated', Date.now().toString());
        showNotif('Configuración guardada y sincronizada', 'success');
    });

    // ============================================================
    // ===== RESET =====
    // ============================================================

    document.getElementById('resetDataBtn')?.addEventListener('click', () => { 
        if(confirm('¿ESTÁS SEGURO? Esto borrará TODOS tus datos locales.')) { 
            db.resetAll(); 
            alert('✅ Datos reiniciados. Recargando...'); 
            location.reload(); 
        } 
    });

    // ============================================================
    // ===== NOTIFICACIONES =====
    // ============================================================

    function showNotif(msg, type='info') { 
        const colors = { success:'#00ff88', error:'#ff0055', info:'#00f3ff' };
        const n = document.createElement('div');
        n.style.cssText = `position:fixed;top:100px;right:20px;background:${colors[type]};color:#000;padding:15px 25px;border-radius:5px;font-weight:bold;z-index:10000;animation:si 0.3s ease;box-shadow:0 0 20px ${colors[type]}40`;
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => {
            n.style.animation = 'so 0.3s ease';
            setTimeout(() => n.remove(), 300);
        }, 3000);
        const st = document.createElement('style');
        st.textContent = `@keyframes si{from{transform:translateX(400px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes so{from{transform:translateX(0);opacity:1}to{transform:translateX(400px);opacity:0}}`;
        document.head.appendChild(st);
    }

});
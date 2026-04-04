/* ============================================================
   /js/auth.js - AUTENTICACIÓN CON CURSOS ASIGNADOS
   ============================================================ */

const auth = {
    login: (user, pass) => {
        const userData = db.validateUser(user, pass);
        if(userData) {
            // Obtener cursos asignados a este usuario
            const assignedCourses = db.getUserCourses(userData.id);
            const sessionUser = {
                ...userData,
                assignedCourses: assignedCourses
            };
            sessionStorage.setItem('ar_user', JSON.stringify(sessionUser));
            
            if(userData.role === 'master') window.location.href = 'admin.html';
            else window.location.href = 'cursos.html';
            return true;
        }
        return false;
    },
    
    logout: () => { 
        sessionStorage.removeItem('ar_user'); 
        window.location.href = 'index.html'; 
    },
    
    checkAuth: (requireMaster = false) => {
        const user = JSON.parse(sessionStorage.getItem('ar_user'));
        if(!user) { 
            window.location.href = 'login.html'; 
            return false; 
        }
        if(requireMaster && user.role !== 'master') { 
            alert('Acceso denegado. Solo Master.'); 
            window.location.href = 'index.html'; 
            return false; 
        }
        return true;
    },
    
    getCurrentUser: () => JSON.parse(sessionStorage.getItem('ar_user')),
    
    // Verificar si el usuario tiene acceso a un curso específico
    hasCourseAccess: (courseId) => {
        const user = auth.getCurrentUser();
        if (!user) return false;
        if (user.role === 'master') return true; // Master tiene acceso a todo
        return user.assignedCourses ? user.assignedCourses.includes(courseId) : false;
    },
    
    // Obtener solo los cursos que el usuario puede ver
    getAccessibleCourses: () => {
        const user = auth.getCurrentUser();
        if (!user) return [];
        const allCourses = db.getCourses();
        if (user.role === 'master') return allCourses;
        return allCourses.filter(course => user.assignedCourses.includes(course.id));
    }
};

// ============================================================
// ===== MANEJADORES DE LOGIN =====
// ============================================================

const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        if(!auth.login(document.getElementById('username').value, document.getElementById('password').value))
            document.getElementById('loginError').style.display = 'block';
    });
}

const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn) { 
    logoutBtn.addEventListener('click', auth.logout); 
    auth.checkAuth(true); 
}
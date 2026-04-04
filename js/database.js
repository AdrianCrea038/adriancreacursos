/* ============================================================
   /js/database.js - BASE DE DATOS LOCAL CON CARRUSEL
   ============================================================ */

const db = {
    VERSION: 5,
    
    // ============================================================
    // ===== INICIALIZACIÓN Y MIGRACIÓN =====
    // ============================================================
    
    init: () => {
        console.log('Inicializando base de datos...');
        const storedVersion = localStorage.getItem('ar_db_version');
        
        if (!storedVersion || parseInt(storedVersion) < db.VERSION) {
            console.log('Migrando base de datos...');
            localStorage.removeItem('ar_projects');
            localStorage.removeItem('ar_courses');
            localStorage.removeItem('ar_user_courses');
            localStorage.removeItem('ar_carousel_config');
            localStorage.setItem('ar_db_version', db.VERSION);
        }
        
        if (!localStorage.getItem('ar_projects')) db.seedProjects();
        if (!localStorage.getItem('ar_courses')) db.seedCourses();
        if (!localStorage.getItem('ar_users')) db.seedUsers();
        if (!localStorage.getItem('ar_config')) db.seedConfig();
        if (!localStorage.getItem('ar_user_courses')) db.seedUserCourses();
        if (!localStorage.getItem('ar_carousel_config')) db.seedCarouselConfig();
        
        console.log('Base de datos inicializada. Proyectos:', db.getProjects().length, 'Cursos:', db.getCourses().length);
    },
    
    // ============================================================
    // ===== PROYECTOS (3) =====
    // ============================================================
    
    seedProjects: () => {
        const projects = [
            { id: 1, title: 'Branding Corporativo', category: 'logo', image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop' },
            { id: 2, title: 'Motion Graphics Showreel', category: 'motion', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop' },
            { id: 3, title: 'IA Generativa', category: 'ia', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop' }
        ];
        localStorage.setItem('ar_projects', JSON.stringify(projects));
        return projects;
    },
    
    // ============================================================
    // ===== CURSOS CON VIDEOS =====
    // ============================================================
    
    seedCourses: () => {
        const courses = [
            { id: 1, title: 'After Effects Profesional', description: 'Aprende motion graphics desde cero. Domina las herramientas esenciales.', price: 89, image: 'https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:30' }] },
            { id: 2, title: 'Photoshop para Diseñadores', description: 'Domina las herramientas esenciales de Photoshop.', price: 59, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00' }] },
            { id: 3, title: 'IA para Creativos', description: 'Aprende a usar Midjourney, DALL-E y Stable Diffusion.', price: 99, image: 'https://images.unsplash.com/photo-1675557009860-5c3d63a7dd7b?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:00' }] },
            { id: 4, title: 'Branding y Logos', description: 'Crea identidades de marca memorables.', price: 79, image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00' }] },
            { id: 5, title: 'Premiere Pro', description: 'Edición de video profesional.', price: 69, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4dde1?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00' }] },
            { id: 6, title: 'Diseño para Impresión', description: 'Prepara archivos para offset y flexografía.', price: 49, image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8b4?w=600&h=400&fit=crop', videos: [{ id: 1, title: 'Introducción', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00' }] }
        ];
        localStorage.setItem('ar_courses', JSON.stringify(courses));
        return courses;
    },
    
    // ============================================================
    // ===== ASIGNACIÓN DE CURSOS POR USUARIO =====
    // ============================================================
    
    seedUserCourses: () => {
        const userCourses = {
            1: [1, 2, 3, 4, 5, 6],  // admin tiene todos
            2: [1, 2]               // usuario1 tiene cursos 1 y 2
        };
        localStorage.setItem('ar_user_courses', JSON.stringify(userCourses));
        return userCourses;
    },
    
    // ============================================================
    // ===== CONFIGURACIÓN DEL CARRUSEL (QUÉ CURSOS MOSTRAR) =====
    // ============================================================
    
    seedCarouselConfig: () => {
        const carouselConfig = {
            enabledCourses: [1, 2, 3, 4, 5, 6]  // Por defecto todos los cursos
        };
        localStorage.setItem('ar_carousel_config', JSON.stringify(carouselConfig));
        return carouselConfig;
    },
    
    getCarouselConfig: () => {
        try {
            return JSON.parse(localStorage.getItem('ar_carousel_config') || '{"enabledCourses":[]}');
        } catch(e) {
            return { enabledCourses: [] };
        }
    },
    
    saveCarouselConfig: (config) => {
        localStorage.setItem('ar_carousel_config', JSON.stringify(config));
    },
    
    // ============================================================
    // ===== USUARIOS =====
    // ============================================================
    
    seedUsers: () => {
        const users = [
            { id: 1, username: 'admin', password: 'admin123', role: 'master' },
            { id: 2, username: 'usuario1', password: '1234', role: 'user' }
        ];
        localStorage.setItem('ar_users', JSON.stringify(users));
        return users;
    },
    
    // ============================================================
    // ===== CONFIGURACIÓN GENERAL =====
    // ============================================================
    
    seedConfig: () => {
        const config = { whatsapp: '50432513558', email: 'contacto@adrianreyescrea.com' };
        localStorage.setItem('ar_config', JSON.stringify(config));
        return config;
    },
    
    // ============================================================
    // ===== CRUD - PROYECTOS =====
    // ============================================================
    
    getProjects: () => { try { return JSON.parse(localStorage.getItem('ar_projects')||'[]'); } catch{ return []; }},
    addProject: (p) => { const a=db.getProjects(); a.push({...p,id:Date.now()}); localStorage.setItem('ar_projects',JSON.stringify(a)); },
    deleteProject: (id) => { let a=db.getProjects(); localStorage.setItem('ar_projects',JSON.stringify(a.filter(x=>x.id!=id))); },
    
    // ============================================================
    // ===== CRUD - CURSOS =====
    // ============================================================
    
    getCourses: () => { try { return JSON.parse(localStorage.getItem('ar_courses')||'[]'); } catch{ return []; }},
    getCourseById: (id) => db.getCourses().find(c => c.id == id),
    addCourse: (c) => { const a=db.getCourses(); a.push({...c,id:Date.now(),videos:[]}); localStorage.setItem('ar_courses',JSON.stringify(a)); },
    deleteCourse: (id) => { let a=db.getCourses(); localStorage.setItem('ar_courses',JSON.stringify(a.filter(x=>x.id!=id))); },
    
    // ============================================================
    // ===== CRUD - VIDEOS =====
    // ============================================================
    
    addVideoToCourse: (courseId, video) => {
        const courses = db.getCourses();
        const course = courses.find(c => c.id == courseId);
        if (course) {
            if (!course.videos) course.videos = [];
            course.videos.push({...video, id: Date.now()});
            localStorage.setItem('ar_courses', JSON.stringify(courses));
        }
    },
    
    deleteVideoFromCourse: (courseId, videoId) => {
        const courses = db.getCourses();
        const course = courses.find(c => c.id == courseId);
        if (course && course.videos) {
            course.videos = course.videos.filter(v => v.id != videoId);
            localStorage.setItem('ar_courses', JSON.stringify(courses));
        }
    },
    
    // ============================================================
    // ===== ASIGNACIÓN DE CURSOS A USUARIOS =====
    // ============================================================
    
    getUserCourses: (userId) => {
        const userCourses = JSON.parse(localStorage.getItem('ar_user_courses') || '{}');
        return userCourses[userId] || [];
    },
    
    assignCourseToUser: (userId, courseId) => {
        const userCourses = JSON.parse(localStorage.getItem('ar_user_courses') || '{}');
        if (!userCourses[userId]) userCourses[userId] = [];
        if (!userCourses[userId].includes(courseId)) {
            userCourses[userId].push(courseId);
            localStorage.setItem('ar_user_courses', JSON.stringify(userCourses));
        }
    },
    
    removeCourseFromUser: (userId, courseId) => {
        const userCourses = JSON.parse(localStorage.getItem('ar_user_courses') || '{}');
        if (userCourses[userId]) {
            userCourses[userId] = userCourses[userId].filter(id => id != courseId);
            localStorage.setItem('ar_user_courses', JSON.stringify(userCourses));
        }
    },
    
    getAllAssignments: () => {
        return JSON.parse(localStorage.getItem('ar_user_courses') || '{}');
    },
    
    // ============================================================
    // ===== CRUD - USUARIOS =====
    // ============================================================
    
    getUsers: () => { try { return JSON.parse(localStorage.getItem('ar_users')||'[]'); } catch{ return []; }},
    validateUser: (u,p) => db.getUsers().find(x=>x.username===u&&x.password===p),
    addUser: (u) => { const a=db.getUsers(); a.push({...u,id:Date.now()}); localStorage.setItem('ar_users',JSON.stringify(a)); },
    deleteUser: (id) => { let a=db.getUsers(); localStorage.setItem('ar_users',JSON.stringify(a.filter(x=>x.id!=id))); },
    
    // ============================================================
    // ===== CRUD - CONFIGURACIÓN =====
    // ============================================================
    
    getConfig: () => { try { return JSON.parse(localStorage.getItem('ar_config')||'{}'); } catch{ return {}; }},
    saveConfig: (c) => localStorage.setItem('ar_config', JSON.stringify(c)),
    
    // ============================================================
    // ===== RESET TOTAL =====
    // ============================================================
    
    resetAll: () => {
        ['ar_projects','ar_courses','ar_users','ar_config','ar_db_version','ar_user_courses','ar_carousel_config'].forEach(k=>localStorage.removeItem(k));
        db.init();
        return true;
    }
};

db.init();
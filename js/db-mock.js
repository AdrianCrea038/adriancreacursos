/**
 * Mock Database for "Adrián Reyes Crea"
 * Prepared for easy migration to Supabase or Firebase
 */

const DB_MOCK = {
    defaults: {
        banner: {
            title: "LEVEL YOUR BRAND.",
            subtitle: "Designer & Developer Expert",
            description: "Transformando visiones en realidades interactivas con estética de alto impacto y rendimiento de última generación.",
            imageUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop"
        },
        projects: [
            {
                id: 1,
                title: "Branding Corporativo",
                category: "Diseño Gráfico",
                description: "Identidad visual completa para marcas de alto impacto con acabados de lujo y técnicas de impresión offset y flexografía.",
                imageUrl: "https://images.unsplash.com/photo-1522120691812-dcdfb625f397?q=80&w=2070&auto=format&fit=crop",
                link: "#",
                icon: "palette",
                gradient: "from-neonPurple/40 to-transparent"
            },
            {
                id: 2,
                title: "Reel Corporativo",
                category: "Edición de Video",
                description: "Post-producción profesional con corrección de color avanzada y efectos visuales para contenido audiovisual de alto impacto.",
                imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1974&auto=format&fit=crop",
                link: "#",
                icon: "video",
                gradient: "from-neonBlue/40 to-transparent"
            },
            {
                id: 3,
                title: "Animación 3D",
                category: "Motion Graphics",
                description: "Animaciones en 3D, intros dinámicas y gráficos en movimiento para contenido que captura la atención al instante.",
                imageUrl: "https://images.unsplash.com/photo-1629904853716-f0bc64219b14?q=80&w=2070&auto=format&fit=crop",
                link: "#",
                icon: "sparkles",
                gradient: "from-neonPink/40 to-transparent"
            },
            {
                id: 4,
                title: "Asistente IA",
                category: "Inteligencia Artificial",
                description: "Desarrollo de chatbots y asistentes virtuales personalizados con IA para automatizar procesos y mejorar la experiencia.",
                imageUrl: "https://images.unsplash.com/photo-1599109859203-267c87ce7553?q=80&w=2070&auto=format&fit=crop",
                link: "#",
                icon: "brain-circuit",
                gradient: "from-neonGreen/40 to-transparent"
            }
        ],
        courses: [
            {
                id: 1,
                title: "Master en UI/UX Minimalista",
                price: 49.99,
                description: "Aprende a diseñar interfaces elegantes y funcionales desde cero.",
                previewUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=2070&auto=format&fit=crop",
                creatorComment: "Este curso es la base de todo mi trabajo actual. ¡Disfrútalo!",
                playlist: [
                    { id: 1, title: "Introducción al Minimalismo", duration: "10:20", videoUrl: "https://example.com/video1", free: true },
                    { id: 2, title: "Psicología del Color", duration: "15:45", videoUrl: "https://example.com/video2", free: false },
                    { id: 3, title: "Tipografía de Lujo", duration: "12:10", videoUrl: "https://example.com/video3", free: false }
                ],
                materials: [
                    { name: "Guía de Tipografía (PDF)", size: "2.4MB" },
                    { name: "Recursos UI (FIG)", size: "15MB" }
                ]
            }
        ],
        users: [
            { id: 1, username: "admin", password: "password123", role: "admin", accessibleCourses: [1] },
            { id: 2, username: "demo_user", password: "user123", role: "student", accessibleCourses: [] }
        ]
    },

    init() {
        if (!localStorage.getItem('arc_banner')) {
            localStorage.setItem('arc_banner', JSON.stringify(this.defaults.banner));
        }
        if (!localStorage.getItem('arc_projects')) {
            localStorage.setItem('arc_projects', JSON.stringify(this.defaults.projects));
        }
        if (!localStorage.getItem('arc_courses')) {
            localStorage.setItem('arc_courses', JSON.stringify(this.defaults.courses));
        }
        if (!localStorage.getItem('arc_users')) {
            localStorage.setItem('arc_users', JSON.stringify(this.defaults.users));
        }
    },

    async getBanner() {
        return JSON.parse(localStorage.getItem('arc_banner'));
    },
    async updateBanner(data) {
        localStorage.setItem('arc_banner', JSON.stringify(data));
        return true;
    },
    async getProjects() {
        return JSON.parse(localStorage.getItem('arc_projects'));
    },
    async addProject(project) {
        const projects = await this.getProjects();
        project.id = Date.now();
        projects.push(project);
        localStorage.setItem('arc_projects', JSON.stringify(projects));
        return true;
    },
    async getCourses() {
        return JSON.parse(localStorage.getItem('arc_courses'));
    },
    async addCourse(course) {
        const courses = await this.getCourses();
        course.id = Date.now();
        courses.push(course);
        localStorage.setItem('arc_courses', JSON.stringify(courses));
        return true;
    },
    async updateCoursePlaylist(courseId, playlist) {
        const courses = await this.getCourses();
        const courseIndex = courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
            courses[courseIndex].playlist = playlist;
            localStorage.setItem('arc_courses', JSON.stringify(courses));
            return true;
        }
        return false;
    },
    async getUsers() {
        return JSON.parse(localStorage.getItem('arc_users'));
    },
    async createUser(user) {
        const users = await this.getUsers();
        user.id = Date.now();
        users.push(user);
        localStorage.setItem('arc_users', JSON.stringify(users));
        return true;
    }
};

DB_MOCK.init();

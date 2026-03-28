/**
 * Courses JS for "Adrián Reyes Crea"
 * Handles courses display, filtering, and preview modal
 */

document.addEventListener('DOMContentLoaded', async () => {
    let courses = [];
    
    try {
        if (typeof DB_SERVICE !== 'undefined' && DB_SERVICE.getCourses) {
            courses = await DB_SERVICE.getCourses();
        } else if (typeof DB_MOCK !== 'undefined') {
            courses = await DB_MOCK.getCourses();
        }
    } catch (err) {
        console.error("Error loading courses:", err);
        courses = [];
    }
    
    const coursesList = document.getElementById('courses-list');
    
    if (coursesList && courses.length > 0) {
        coursesList.innerHTML = courses.map(course => `
            <div class="gamer-card p-6 group reveal flex flex-col h-full">
                <div class="aspect-video bg-bgDark overflow-hidden mb-6 rounded-sm relative">
                    <img src="${course.previewUrl}" alt="${course.title}" class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-bgDark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                        <button onclick="openCoursePreview(${course.id})" class="gamer-btn !py-2 !px-6 text-xs">Vista Previa</button>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-black tracking-widest text-neonPurple uppercase">Curso</span>
                    <span class="text-sm font-orbitron font-bold text-neonBlue">$${course.price}</span>
                </div>
                <h3 class="text-xl font-orbitron font-bold mb-4 uppercase tracking-wider group-hover:text-neonPurple transition-colors">${course.title}</h3>
                <p class="text-white/50 font-light text-sm mb-6 leading-relaxed flex-grow">${course.description.substring(0, 100)}${course.description.length > 100 ? '...' : ''}</p>
                <div class="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                    <div class="flex items-center space-x-2 text-xs text-white/40">
                        <i data-lucide="play-circle" class="w-4 h-4"></i>
                        <span>${course.playlist.length} Lecciones</span>
                    </div>
                    <button onclick="openCoursePreview(${course.id})" class="text-neonPurple font-bold text-xs flex items-center group/btn hover:text-neonBlue transition-colors">
                        Ver detalles
                        <i data-lucide="arrow-right" class="ml-1 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
        
        const reveal = () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 50) el.classList.add('active');
            });
        };
        window.addEventListener('scroll', reveal);
        reveal();
    } else if (coursesList) {
        coursesList.innerHTML = '<p class="text-white/40 text-center py-20">No hay cursos disponibles por el momento.</p>';
    }

    const modal = document.getElementById('course-preview-modal');
    const closeBtn = document.getElementById('close-modal');
    const overlay = document.getElementById('modal-overlay');

    window.openCoursePreview = async (courseId) => {
        let course = null;
        try {
            if (typeof DB_SERVICE !== 'undefined' && DB_SERVICE.getCourses) {
                const allCourses = await DB_SERVICE.getCourses();
                course = allCourses.find(c => c.id === courseId);
            } else if (typeof DB_MOCK !== 'undefined') {
                const allCourses = await DB_MOCK.getCourses();
                course = allCourses.find(c => c.id === courseId);
            }
        } catch (err) {
            console.error("Error loading course details:", err);
            return;
        }
        
        if (!course) return;

        document.getElementById('modal-content').innerHTML = `
            <h2 class="text-3xl font-orbitron font-bold uppercase tracking-wider mb-6 neon-text">${course.title}</h2>
            <div class="aspect-video bg-bgDark rounded-sm mb-8 overflow-hidden relative border border-white/10">
                <img src="${course.previewUrl}" class="w-full h-full object-cover opacity-70">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i data-lucide="play" class="w-20 h-20 text-white opacity-80 hover:scale-110 transition-transform cursor-pointer"></i>
                </div>
            </div>
            <div class="prose prose-sm max-w-none text-white/70 font-light leading-loose">
                <h3 class="text-neonPurple font-orbitron font-bold mb-4 text-lg">Sobre este curso</h3>
                <p class="mb-6">${course.description}</p>
                
                <div class="bg-white/5 border-l-4 border-neonPurple p-6 mb-8">
                    <p class="italic text-white/80">"${course.creatorComment}"</p>
                    <span class="block mt-2 text-xs font-orbitron font-bold uppercase text-neonPurple">— Adrián Reyes</span>
                </div>

                <h3 class="text-neonPurple font-orbitron font-bold mb-4 text-lg">Material descargable</h3>
                <ul class="space-y-3 mb-8">
                    ${course.materials.map(m => `
                        <li class="flex items-center space-x-3 text-white/60 hover:text-neonPurple transition-colors cursor-pointer">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span>${m.name} (${m.size})</span>
                            <span class="text-[10px] bg-neonPurple/20 px-2 py-1 rounded-full uppercase font-bold tracking-widest ml-auto">Solo alumnos</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        document.getElementById('modal-playlist').innerHTML = course.playlist.map((item, idx) => `
            <li class="flex items-start space-x-3 p-3 rounded-sm ${item.free ? 'bg-neonPurple/10 border-l-2 border-neonPurple' : 'opacity-70'}">
                <div class="w-6 h-6 rounded-full bg-neonPurple/20 flex items-center justify-center text-[10px] font-bold shrink-0 border border-neonPurple/30">
                    ${idx + 1}
                </div>
                <div class="flex-1">
                    <p class="font-medium text-white">${item.title}</p>
                    <span class="text-[10px] text-white/40 uppercase tracking-widest">${item.duration} ${item.free ? '• Gratis' : '• Premium'}</span>
                </div>
                ${item.free ? '<i data-lucide="play" class="w-3 h-3 text-neonPurple mt-1"></i>' : '<i data-lucide="lock" class="w-3 h-3 text-white/40 mt-1"></i>'}
            </li>
        `).join('');

        document.getElementById('modal-price').innerText = `$${course.price}`;
        document.getElementById('buy-whatsapp-btn').href = `https://wa.me/yournumber?text=Hola! Estoy interesado en el curso: ${course.title}`;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        lucide.createIcons();
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
});
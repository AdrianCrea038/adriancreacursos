/**
 * Courses JS for "Adrián Reyes Crea"
 * Handles courses display, filtering, and preview modal
 */

document.addEventListener('DOMContentLoaded', async () => {
    const courses = await DB_MOCK.getCourses();
    const coursesList = document.getElementById('courses-list');
    
    if (coursesList) {
        coursesList.innerHTML = courses.map(course => `
            <div class="course-card bg-white p-8 border border-gray-100 rounded-sm group reveal">
                <div class="aspect-video bg-secondary overflow-hidden mb-6 rounded-sm relative">
                    <img src="${course.previewUrl}" alt="${course.title}" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700">
                    <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onclick="openCoursePreview(${course.id})" class="bg-white text-primary px-6 py-2 rounded-sm font-medium hover:bg-accent hover:text-white transition-colors">Vista Previa</button>
                    </div>
                </div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-bold tracking-widest text-accent uppercase">Curso</span>
                    <span class="text-sm font-medium text-gray-500">$${course.price}</span>
                </div>
                <h3 class="text-2xl font-serif mb-4 group-hover:text-accent transition-colors">${course.title}</h3>
                <p class="text-gray-500 font-light text-sm mb-8 leading-relaxed">${course.description}</p>
                <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div class="flex items-center space-x-2 text-xs text-gray-400">
                        <i data-lucide="play-circle" class="w-4 h-4"></i>
                        <span>${course.playlist.length} Lecciones</span>
                    </div>
                    <button onclick="openCoursePreview(${course.id})" class="text-primary font-bold text-sm flex items-center group/btn">
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
    }

    const modal = document.getElementById('course-preview-modal');
    const closeBtn = document.getElementById('close-modal');
    const overlay = document.getElementById('modal-overlay');

    window.openCoursePreview = async (courseId) => {
        const course = (await DB_MOCK.getCourses()).find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('modal-content').innerHTML = `
            <h2 class="text-4xl font-serif mb-6">${course.title}</h2>
            <div class="aspect-video bg-black rounded-sm mb-8 overflow-hidden relative">
                <img src="${course.previewUrl}" class="w-full h-full object-cover opacity-50">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i data-lucide="play" class="w-20 h-20 text-white opacity-80 hover:scale-110 transition-transform cursor-pointer"></i>
                </div>
            </div>
            <div class="prose prose-sm max-w-none text-gray-600 font-light leading-loose">
                <h3 class="text-primary font-bold mb-4">Sobre este curso</h3>
                <p class="mb-6">${course.description}</p>
                
                <div class="bg-secondary/50 p-6 border-l-4 border-accent mb-8">
                    <p class="italic">"${course.creatorComment}"</p>
                    <span class="block mt-2 text-xs font-bold uppercase text-accent">— Adrián Reyes</span>
                </div>

                <h3 class="text-primary font-bold mb-4">Material descargable</h3>
                <ul class="space-y-3 mb-8">
                    ${course.materials.map(m => `
                        <li class="flex items-center space-x-3 text-gray-500 hover:text-primary transition-colors cursor-pointer">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span>${m.name} (${m.size})</span>
                            <span class="text-[10px] bg-gray-200 px-2 py-1 rounded-full uppercase font-bold tracking-widest ml-auto">Solo alumnos</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        document.getElementById('modal-playlist').innerHTML = course.playlist.map((item, idx) => `
            <li class="flex items-start space-x-3 p-3 rounded-sm ${item.free ? 'bg-accent/5' : 'opacity-60'}">
                <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shrink-0 border border-gray-100">
                    ${idx + 1}
                </div>
                <div class="flex-1">
                    <p class="font-medium text-primary">${item.title}</p>
                    <span class="text-[10px] text-gray-400 uppercase tracking-widest">${item.duration} ${item.free ? '• Gratis' : '• Premium'}</span>
                </div>
                ${item.free ? '<i data-lucide="play" class="w-3 h-3 text-accent mt-1"></i>' : '<i data-lucide="lock" class="w-3 h-3 text-gray-400 mt-1"></i>'}
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
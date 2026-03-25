/**
 * Main JS for "Adrián Reyes Crea"
 * Handles landing page interactions and dynamic content
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar banner
    const bannerData = await DB_SERVICE.getBanner();
    if (bannerData) {
        const heroBanner = document.getElementById('hero-banner');
        const heroTitle = document.querySelector('#home h1');
        const heroSubtitle = document.querySelector('#home span.text-white/60');
        const heroDescription = document.querySelector('#home p');

        if (heroBanner) heroBanner.src = bannerData.imageUrl;
        if (heroTitle && bannerData.title) {
            const words = bannerData.title.split(' ');
            if (words.length > 2) {
                heroTitle.innerHTML = `${words.slice(0, 2).join(' ')} <br><span class="text-transparent" style="-webkit-text-stroke: 1px white">${words.slice(2, 3)}</span> <br><span class="text-neonPurple neon-text">${words.slice(3).join(' ')}</span>`;
            } else {
                heroTitle.innerText = bannerData.title;
            }
        }
        if (heroSubtitle && bannerData.subtitle) heroSubtitle.innerText = bannerData.subtitle;
        if (heroDescription && bannerData.description) heroDescription.innerText = bannerData.description;
    }

    // Cargar proyectos con animaciones mejoradas
    const projects = await DB_SERVICE.getProjects();
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid && projects.length > 0) {
        projectsGrid.innerHTML = projects.map((project, index) => {
            const gradient = project.gradient || "from-neonPurple/40 to-transparent";
            const iconColor = project.category === "Diseño Gráfico" ? "text-neonPurple" :
                              project.category === "Edición de Video" ? "text-neonBlue" :
                              project.category === "Motion Graphics" ? "text-neonPink" : "text-neonGreen";
            return `
                <div class="gamer-card group relative overflow-hidden aspect-video reveal" style="transition-delay: ${index * 0.1}s; animation: glowPulse 3s infinite;">
                    <img src="${project.imageUrl}" alt="${project.title}" class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1">
                    <div class="absolute inset-0 bg-gradient-to-t ${gradient} via-bgDark/60 to-bgDark opacity-80 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                        <div class="flex items-center space-x-3 mb-3 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-100">
                            <i data-lucide="${project.icon || 'folder'}" class="w-6 h-6 ${iconColor} group-hover:scale-125 transition-all duration-300 animate-pulse"></i>
                            <span class="text-neonBlue text-[10px] font-black tracking-widest uppercase">${project.category}</span>
                        </div>
                        <h4 class="text-2xl font-orbitron font-black uppercase mb-4 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-200 neon-text">${project.title}</h4>
                        <p class="text-xs text-white/70 font-light max-w-xs mb-6 transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-300 opacity-0 group-hover:opacity-100 leading-relaxed">${project.description}</p>
                        <a href="${project.link}" class="gamer-btn !px-6 !py-2 !text-[10px] w-max transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 delay-400 opacity-0 group-hover:opacity-100 hover:shadow-[0_0_20px_rgba(112,0,255,0.5)]">EXPLORE MISSION</a>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-neonPurple via-neonBlue to-neonPink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div class="absolute top-0 right-0 w-32 h-32 bg-neonPurple/0 group-hover:bg-neonPurple/10 transition-all duration-700 rounded-full blur-3xl -z-10"></div>
                </div>
            `;
        }).join('');
        lucide.createIcons();
    }

    // Animaciones al hacer scroll
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // Menú móvil
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Mobile menu clicked');
        });
    }

    // Atajo para admin (Alt + A)
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'a') {
            window.location.href = 'login.html';
        }
    });
});

// Estilo adicional para animación de brillo
const style = document.createElement('style');
style.textContent = `
    @keyframes glowPulse {
        0% { box-shadow: 0 0 5px rgba(112, 0, 255, 0.3); }
        50% { box-shadow: 0 0 20px rgba(112, 0, 255, 0.6); }
        100% { box-shadow: 0 0 5px rgba(112, 0, 255, 0.3); }
    }
    .gamer-card {
        animation: glowPulse 4s infinite;
    }
    .gamer-card:hover {
        animation: none;
    }
`;
document.head.appendChild(style);
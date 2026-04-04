/* ============================================================
   /js/main.js - COMPLETO CON SECCIONES ETIQUETADAS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // ===== FUNCIONES DE CONFIGURACIÓN (WHATSAPP / EMAIL) =====
    // ============================================================

    function getCurrentConfig() {
        try {
            const cfg = localStorage.getItem('ar_config');
            return cfg ? JSON.parse(cfg) : { whatsapp: '50432513558', email: 'contacto@adrianreyescrea.com' };
        } catch(e) {
            return { whatsapp: '50432513558', email: 'contacto@adrianreyescrea.com' };
        }
    }

    function formatWhatsAppNumber(num) {
        let clean = String(num).replace(/\D/g, '');
        if (clean.startsWith('504') && clean.length === 12) {
            return `+504 ${clean.slice(3,7)}-${clean.slice(7,11)}`;
        }
        return `+${clean}`;
    }

    function updateWhatsAppLinks() {
        const config = getCurrentConfig();
        const whatsappNumber = config.whatsapp;
        const email = config.email;
        
        const heroBtn = document.getElementById('heroWhatsAppBtn');
        if (heroBtn) {
            heroBtn.href = `https://wa.me/${whatsappNumber}`;
        }
        
        const chatLink = document.getElementById('whatsappChatLink');
        if (chatLink) {
            chatLink.href = `https://wa.me/${whatsappNumber}`;
        }
        
        const whatsappText = document.getElementById('whatsappText');
        if (whatsappText) {
            whatsappText.textContent = formatWhatsAppNumber(whatsappNumber);
        }
        
        const emailText = document.getElementById('emailText');
        if (emailText) {
            emailText.textContent = email;
        }
        
        window._currentWhatsapp = whatsappNumber;
    }

    updateWhatsAppLinks();

    // ============================================================
    // ===== STORAGE LISTENER (SINCRONIZACIÓN CON ADMIN) =====
    // ============================================================

    window.addEventListener('storage', (e) => {
        if (e.key === 'ar_config' || e.key === 'ar_config_updated') {
            updateWhatsAppLinks();
            const notif = document.createElement('div');
            notif.textContent = 'Configuración actualizada';
            notif.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#00f3ff;color:#000;padding:10px 20px;border-radius:5px;z-index:9999;font-size:0.8rem;animation:fadeOut 2s ease forwards';
            document.body.appendChild(notif);
            setTimeout(() => notif.remove(), 2000);
        }
    });

    if (!document.querySelector('#fadeOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeOutStyle';
        style.textContent = '@keyframes fadeOut {0%{opacity:1}70%{opacity:1}100%{opacity:0;display:none}}';
        document.head.appendChild(style);
    }

    // ============================================================
    // ===== HAMBURGUESA MENU (MOBILE) =====
    // ============================================================

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if(hamburger && navMenu) {
        hamburger.addEventListener('click', () => { 
            navMenu.classList.toggle('active'); 
            hamburger.classList.toggle('active'); 
        });
        document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => { 
            navMenu.classList.remove('active'); 
            hamburger.classList.remove('active'); 
        }));
    }

    // ============================================================
    // ===== NAVBAR SCROLL EFFECT =====
    // ============================================================

    const navbar = document.querySelector('.navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if(window.scrollY > 50) { 
                navbar.style.background = 'rgba(10,10,10,0.98)'; 
                navbar.style.boxShadow = '0 2px 20px rgba(0,243,255,0.1)'; 
            } else { 
                navbar.style.background = 'rgba(10,10,10,0.95)'; 
                navbar.style.boxShadow = 'none'; 
            }
        });
    }

    // ============================================================
    // ===== SMOOTH SCROLL (ANCLAS) =====
    // ============================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if(href !== '#' && href.length > 1 && !href.includes('cursos.html')) { 
                e.preventDefault(); 
                const target = document.querySelector(href); 
                if(target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); 
            }
        });
    });

    // ============================================================
    // ===== PORTFOLIO (FILTRADO + RENDER) - CORREGIDO =====
    // ============================================================

    const portfolioGrid = document.getElementById('portfolioGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (portfolioGrid && filterBtns.length > 0) {
        const projects = db.getProjects();
        
        console.log('Proyectos cargados:', projects.length);
        
        const renderProjects = (filter = 'all') => {
            portfolioGrid.innerHTML = '';
            const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
            
            if(filtered.length === 0) { 
                portfolioGrid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:20px">No hay proyectos en esta categoría</p>'; 
                return; 
            }
            
            filtered.forEach(p => {
                const item = document.createElement('div');
                item.className = 'portfolio-item';
                
                let imgSrc = p.image;
                if (!imgSrc || imgSrc === '') {
                    imgSrc = db.makeSVG(p.title || 'Proyecto', '#00f3ff', p.category);
                }
                
                item.innerHTML = `
                    <img src="${imgSrc}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;">
                    <div class="portfolio-overlay">
                        <h3>${p.title}</h3>
                        <p style="color:var(--primary-color);text-transform:uppercase;font-size:0.9rem">${p.category}</p>
                    </div>
                `;
                portfolioGrid.appendChild(item);
            });
        };
        
        renderProjects();
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => { 
                filterBtns.forEach(b=>b.classList.remove('active')); 
                btn.classList.add('active'); 
                renderProjects(btn.dataset.filter); 
            });
        });
    }

    // ============================================================
    // ===== STATS ANIMATION (INTERSECTION OBSERVER) =====
    // ============================================================

    const statNumbers = document.querySelectorAll('.stat-number');
    if(statNumbers.length > 0) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                const update = () => { 
                    current += increment; 
                    if(current < target) { 
                        stat.innerText = Math.ceil(current); 
                        requestAnimationFrame(update); 
                    } else stat.innerText = target+'+'; 
                };
                update();
            });
        };
        
        const statsSection = document.querySelector('.stats');
        if(statsSection) { 
            let animated = false; 
            new IntersectionObserver(entries => { 
                entries.forEach(e => { 
                    if(e.isIntersecting && !animated) { 
                        animateStats(); 
                        animated = true; 
                    } 
                }); 
            }, {threshold:0.5}).observe(statsSection); 
        }
    }

    // ============================================================
    // ===== CONTACTO - WHATSAPP MODAL =====
    // ============================================================

    const contactForm = document.getElementById('contactForm');
    const whatsappModal = document.getElementById('whatsappModal');
    const closeModal = document.querySelector('.close-modal');
    const confirmWhatsapp = document.getElementById('confirmWhatsapp');
    const modalMessage = document.getElementById('modalMessage');
    
    if(contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const config = getCurrentConfig();
            const whatsappNumber = config.whatsapp;
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const service = document.getElementById('contactService').value;
            const message = document.getElementById('contactMessage').value;
            
            const services = {
                logo:'Diseño de Logo',
                video:'Edición de Video',
                motion:'Motion Graphics',
                ia:'IA Generativa',
                impresion:'Diseño para Impresión',
                curso:'Cursos',
                otro:'Otro'
            };
            
            const fullMsg = `*Nuevo mensaje desde la web*%0A%0A*Nombre:* ${name}%0A*Email:* ${email}%0A*Servicio:* ${services[service]||service}%0A%0A*Mensaje:*%0A${message}`;
            
            if(whatsappModal && modalMessage) {
                modalMessage.innerHTML = `<div style="margin-bottom:15px"><strong style="color:var(--primary-color)">Destinatario:</strong><br><span style="color:var(--text-muted)">+${whatsappNumber}</span></div>
                                          <div><strong style="color:var(--primary-color)">Tu mensaje:</strong><br><br><span style="color:var(--text-muted)"><strong>Nombre:</strong> ${name}<br>
                                          <strong>Email:</strong> ${email}<br>
                                          <strong>Servicio:</strong> ${services[service]||service}<br><br>
                                          <strong>Mensaje:</strong><br>${message}</span></div>`;
                whatsappModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                if(confirmWhatsapp) {
                    confirmWhatsapp.onclick = () => {
                        window.open(`https://wa.me/${whatsappNumber}?text=${fullMsg}`, '_blank');
                        whatsappModal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        contactForm.reset();
                    };
                }
            } else {
                window.open(`https://wa.me/${whatsappNumber}?text=${fullMsg}`, '_blank');
            }
        });
    }

    // ============================================================
    // ===== MODAL CLOSE HANDLERS =====
    // ============================================================

    if(closeModal && whatsappModal) {
        closeModal.addEventListener('click', () => {
            whatsappModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if(whatsappModal) {
        window.addEventListener('click', e => {
            if(e.target === whatsappModal) {
                whatsappModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', e => {
            if(e.key === 'Escape' && whatsappModal.style.display === 'block') {
                whatsappModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ============================================================
    // ===== TYPING EFFECT (HERO) =====
    // ============================================================

    const typing = document.querySelector('.typing-effect');
    if(typing) {
        const texts = ['DISEÑADOR GRÁFICO','MOTION ARTIST','EDITOR DE VIDEO','ESPECIALISTA EN IA'];
        let ti=0, ci=0, del=false;
        const type = () => {
            const t = texts[ti];
            if(del) { 
                typing.textContent = t.substring(0,--ci); 
            } else { 
                typing.textContent = t.substring(0,++ci); 
            }
            let speed = del ? 50 : 100;
            if(!del && ci===t.length) { 
                speed=2000; 
                del=true; 
            } else if(del && ci===0) { 
                del=false; 
                ti=(ti+1)%texts.length; 
                speed=500; 
            }
            setTimeout(type,speed);
        };
        type();
    }

    // ============================================================
    // ===== ACTIVE NAV LINK ON SCROLL =====
    // ============================================================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if(sections.length && navLinks.length) {
        window.addEventListener('scroll', () => {
            let cur = '';
            sections.forEach(s => { 
                if(pageYOffset >= s.offsetTop - 100 && pageYOffset < s.offsetTop + s.clientHeight - 100) cur = s.id; 
            });
            navLinks.forEach(l => { 
                l.classList.remove('active'); 
                if(l.getAttribute('href') === '#' + cur) l.classList.add('active'); 
            });
        });
    }

});
let currentSlide = 0;
let slideInterval;
console.log('Centro MEMI - Sistema iniciando...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado - Iniciando componentes');
  initCarouselBasic();
  initTouchGestures(); 
  initUploadICPC();
  initNavbar(); 
  console.log('Todos los componentes inicializados');
});
  
  document.querySelectorAll('.arrow.rotated').forEach(arr => {
    if (arr !== arrow) {
      arr.classList.remove('rotated');
    }
  });
  submenu.classList.toggle('active');
  arrow.classList.toggle('rotated');
  
  console.log('Submenu', targetId, submenu.classList.contains('active') ? 'ABIERTO' : 'CERRADO');


function initTouchGestures() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        const slides = document.querySelectorAll('.slide');
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        goToSlide(prevIndex);
      }
      resetAutoPlay();
    }
  }
  
  console.log('Gestos tactiles inicializados');
}

function initCarouselBasic() {
  console.log('Inicializando carrusel...');
  
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) {
    console.warn('⚠️ No se encontraron slides del carrusel');
    return;
  }
  console.log(`✅ Encontrados ${slides.length} slides`);
  showSlide(0);
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      console.log('Dot clicked:', index);
      goToSlide(index);
      resetAutoPlay();
    });
  });
  startAutoPlay();
  console.log('✅ Carrusel inicializado correctamente');
}

function showSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  if (index < 0 || index >= slides.length) {
    console.warn('⚠️ Índice de slide inválido:', index);
    return;
  }
  console.log('Mostrando slide:', index);
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  
  currentSlide = index;
}

function nextSlide() {
  const slides = document.querySelectorAll('.slide');
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

function goToSlide(index) {
  showSlide(index);
}

function startAutoPlay() {
  console.log('🎬 Iniciando autoplay del carrusel');
  slideInterval = setInterval(nextSlide, 4000); 
}

function resetAutoPlay() {
  console.log('🔄 Reiniciando autoplay');
  clearInterval(slideInterval);
  setTimeout(startAutoPlay, 2000); 
}

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    console.log('📴 Página oculta - pausando carrusel');
    clearInterval(slideInterval);
  } else {
    console.log('📱 Página visible - reanudando carrusel');
    startAutoPlay();
  }
});

document.addEventListener('keydown', function(e) {
  const sidebar = document.getElementById('sidebar');
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    console.log('⌨️ ESC presionado - cerrando sidebar');
    closeSidebar();
  }
  if (!sidebar.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      console.log('⌨️ Flecha izquierda');
      const slides = document.querySelectorAll('.slide');
      const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      goToSlide(prevIndex);
      resetAutoPlay();
    } else if (e.key === 'ArrowRight') {
      console.log('⌨️ Flecha derecha');
      nextSlide();
      resetAutoPlay();
    }
  }
});
function initNavbar() {
  console.log('Inicializando navbar...');
  
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const dropdowns = document.querySelectorAll('.navbar-menu .dropdown');
  
  if (!navbarToggle) {
    console.error('No se encontró navbar-toggle');
    return;
  }
  
  navbarToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    console.log('Menu toggled');
  });
  
  // Para móvil: dropdowns
  if (window.innerWidth <= 768) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.dropdown-toggle');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  }
  
  // Links de navegación
  const menuLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          document.querySelectorAll('.antecedentes-section, .content-section').forEach(section => {
            section.classList.remove('active');
          });
          
          targetSection.classList.add('active');
          
          setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
          
          navbarMenu.classList.remove('active');
          navbarToggle.classList.remove('active');
        }
      }
    });
  });
  
  console.log('Navbar inicializado');
}

window.CentroMEMI = {
  sidebar: {
    toggle: toggleSidebar,
    close: closeSidebar,
    isOpen: () => document.getElementById('sidebar').classList.contains('active')
  },
  carousel: {
    next: nextSlide,
    goTo: goToSlide,
    current: () => currentSlide,
    pause: () => clearInterval(slideInterval),
    resume: startAutoPlay
  }
};

if (window.innerWidth <= 768) {
  window.addEventListener('orientationchange', function() {
    console.log('📱 Orientación cambiada');
    setTimeout(() => {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('active')) {
        closeSidebar();
      }
      const carousel = document.querySelector('.carousel');
      if (carousel) {
        carousel.style.height = window.innerHeight * 0.5 + 'px';
      }
    }, 100);
  });
}

document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

const navToggle = document.getElementById('navbar-toggle');
const navMenu = document.getElementById('navbar-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    console.log('Menu mobile toggled');
  });
  if (window.innerWidth <= 768) {
    const dropdowns = document.querySelectorAll('.navbar-menu .dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.dropdown-toggle');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  }
  
  console.log('Navbar integrado inicializado');
}
let slideActualICPC = 0;
let fotosArrayICPC = [];

function initUploadICPC() {
  console.log('Inicializando sistema de uploads ICPC...');
  const subirAfiches = document.getElementById('subirAfiches');
  if (subirAfiches) {
    subirAfiches.addEventListener('change', function(e) {
      const archivos = e.target.files;
      const container = document.getElementById('afichesContainer');
      
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const reader = new FileReader();
        
        reader.onload = function(event) {
          const div = document.createElement('div');
          div.className = 'afiche-item w3-card';
          div.innerHTML = `
            <img src="${event.target.result}" alt="Afiche ICPC" class="afiche-img">
            <button class="eliminar-btn" onclick="eliminarElemento(this)">
              <i class="fa fa-trash"></i>
            </button>
          `;
          container.appendChild(div);
        };
        
        reader.readAsDataURL(archivo);
      }
    });
  }
  const subirFotos = document.getElementById('subirFotos');
  if (subirFotos) {
    subirFotos.addEventListener('change', function(e) {
      const archivos = e.target.files;
      const carruselContainer = document.getElementById('carruselContainer');
      const carruselFotos = document.getElementById('carruselFotos');
      
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const reader = new FileReader();
        
        reader.onload = function(event) {
          fotosArrayICPC.push(event.target.result);
          
          const slide = document.createElement('div');
          slide.className = 'carrusel-slide';
          if (fotosArrayICPC.length === 1) {
            slide.classList.add('active');
          }
          slide.innerHTML = `<img src="${event.target.result}" alt="Foto ICPC">`;
          carruselFotos.appendChild(slide);
          
          if (fotosArrayICPC.length > 0) {
            carruselContainer.style.display = 'block';
            inicializarCarruselICPC();
          }
        };
        
        reader.readAsDataURL(archivo);
      }
    });
  }
  const subirVideos = document.getElementById('subirVideos');
  if (subirVideos) {
    subirVideos.addEventListener('change', function(e) {
      const archivos = e.target.files;
      const container = document.getElementById('videosContainer');
      
      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const reader = new FileReader();
        
        reader.onload = function(event) {
          const div = document.createElement('div');
          div.className = 'video-item w3-card';
          div.innerHTML = `
            <video controls class="video-player">
              <source src="${event.target.result}" type="${archivo.type}">
              Tu navegador no soporta videos.
            </video>
            <button class="eliminar-btn" onclick="eliminarElemento(this)">
              <i class="fa fa-trash"></i>
            </button>
          `;
          container.appendChild(div);
        };
        
        reader.readAsDataURL(archivo);
      }
    });
  }
  
  console.log('✅ Sistema de uploads ICPC inicializado');
}

function inicializarCarruselICPC() {
  const slides = document.querySelectorAll('#carruselFotos .carrusel-slide');
  const dotsContainer = document.getElementById('carruselDots');
  
  dotsContainer.innerHTML = '';
  
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.onclick = () => irASlideICPC(index);
    dotsContainer.appendChild(dot);
  });
}

function mostrarSlideICPC(n) {
  const slides = document.querySelectorAll('#carruselFotos .carrusel-slide');
  const dots = document.querySelectorAll('#carruselDots .dot');
  
  if (slides.length === 0) return;
  
  if (n >= slides.length) slideActualICPC = 0;
  if (n < 0) slideActualICPC = slides.length - 1;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[slideActualICPC].classList.add('active');
  if (dots[slideActualICPC]) {
    dots[slideActualICPC].classList.add('active');
  }
}

function cambiarSlide(n) {
  slideActualICPC += n;
  mostrarSlideICPC(slideActualICPC);
}

function irASlideICPC(n) {
  slideActualICPC = n;
  mostrarSlideICPC(slideActualICPC);
}

function eliminarElemento(btn) {
  if (confirm('¿Estás seguro de eliminar este elemento?')) {
    const elemento = btn.parentElement;
    elemento.remove();
    
    if (elemento.classList.contains('carrusel-slide')) {
      const slides = document.querySelectorAll('#carruselFotos .carrusel-slide');
      if (slides.length === 0) {
        document.getElementById('carruselContainer').style.display = 'none';
        fotosArrayICPC = [];
      } else {
        slideActualICPC = 0;
        inicializarCarruselICPC();
        mostrarSlideICPC(0);
      }
    }
  }
}
setInterval(() => {
  const slides = document.querySelectorAll('#carruselFotos .carrusel-slide');
  if (slides.length > 0) {
    cambiarSlide(1);
  }
}, 5000);
console.log(`
🏛️ Centro MEMI Día n - Sistema cargado
✅ Sidebar con submenús: OK
✅ Carrusel automático: OK  
✅ Navegación por teclado: OK
✅ Sistema de uploads ICPC: OK
🛠️ Para debugging: window.CentroMEMI
`);

setTimeout(() => {
  const toggleBtn = document.querySelector('.toggle-btn');
  const sidebar = document.getElementById('sidebar');
  
  if (toggleBtn && sidebar) {
    console.log('🔍 Verificación final: Elementos encontrados correctamente');
  } else {
    console.error('❌ Error: Elementos no encontrados en verificación final');
    console.log('Toggle button:', toggleBtn);
    console.log('Sidebar:', sidebar);
  }
}, 1000);

document.querySelectorAll('.submenu a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      document.querySelectorAll('.antecedentes-section, .content-section').forEach(section => {
        section.classList.remove('active');
      });
      targetSection.classList.add('active');
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeSidebar();
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const dropdowns = document.querySelectorAll('.navbar-menu .dropdown');
  
  if (navbarToggle) {
    navbarToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
    });
  }
  
  if (window.innerWidth <= 768) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.dropdown-toggle');
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
  }
  const menuLinks = document.querySelectorAll('.navbar-menu a[href^="#"]');
menuLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        document.querySelectorAll('.antecedentes-section, .content-section').forEach(section => {
          section.classList.remove('active');
        });
        targetSection.classList.add('active');
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        navbarMenu.classList.remove('active');
        if (navbarToggle) navbarToggle.classList.remove('active');
      }
    }
  });
});
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.header-integrado')) {
      navbarMenu.classList.remove('active');
      if (navbarToggle) navbarToggle.classList.remove('active');
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
    initPublicaciones();
});

function initPublicaciones() {
    console.log('Inicializando sistema de publicaciones...');
    const archivoInput = document.getElementById('archivoDocumento');
    if (archivoInput) {
        archivoInput.addEventListener('change', function(e) {
            const fileName = document.getElementById('fileName');
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
                fileName.style.color = '#009688';
            } else {
                fileName.textContent = 'No se ha seleccionado ningún archivo';
                fileName.style.color = '#999';
            }
        });
    }
    const form = document.getElementById('formPublicacion');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            agregarPublicacion();
        });
    }

    console.log('✅ Sistema de publicaciones inicializado');
}

function cambiarCategoria(categoria) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    document.querySelectorAll('.publicaciones-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(categoria + '-container').classList.add('active');

    console.log('Categoría cambiada a:', categoria);
}

function agregarPublicacion() {
    const categoria = document.getElementById('categoriaPublicacion').value;
    const nombre = document.getElementById('nombreDocumento').value;
    const descripcion = document.getElementById('descripcionDocumento').value;
    const archivo = document.getElementById('archivoDocumento').files[0];

    if (!categoria || !nombre || !descripcion || !archivo) {
        alert('Por favor completa todos los campos');
        return;
    }

    if (archivo.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const publicacion = {
            id: Date.now(),
            categoria: categoria,
            nombre: nombre,
            descripcion: descripcion,
            archivo: e.target.result,
            fecha: new Date().toLocaleDateString('es-ES')
        };

        crearTarjetaPublicacion(publicacion);
        document.getElementById('formPublicacion').reset();
        document.getElementById('fileName').textContent = 'No se ha seleccionado ningún archivo';
        document.getElementById('fileName').style.color = '#999';
        cambiarCategoriaDirecta(categoria);

        console.log('✅ Publicación agregada:', nombre);
    };

    reader.readAsDataURL(archivo);
}

function crearTarjetaPublicacion(pub) {
    const grid = document.getElementById(pub.categoria + '-grid');
    
    const card = document.createElement('div');
    card.className = 'publicacion-card w3-card';
    card.setAttribute('data-id', pub.id);
    
    card.innerHTML = `
        <div class="publicacion-header">
            <i class="fa fa-file-pdf-o pdf-icon"></i>
            <h4>${pub.nombre}</h4>
        </div>
        <div class="publicacion-body">
            <p class="publicacion-descripcion">${pub.descripcion}</p>
            <p class="publicacion-fecha">
                <i class="fa fa-calendar"></i> Publicado: ${pub.fecha}
            </p>
        </div>
        <div class="publicacion-footer">
            <a href="${pub.archivo}" download="${pub.nombre}.pdf" class="btn-download w3-button w3-teal">
                <i class="fa fa-download"></i> Descargar
            </a>
            <button onclick="verPublicacion('${pub.archivo}', '${pub.nombre}')" class="btn-view w3-button w3-blue">
                <i class="fa fa-eye"></i> Ver
            </button>
            <button onclick="eliminarPublicacion(${pub.id}, '${pub.categoria}')" class="btn-delete w3-button w3-red">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    `;
    
    grid.appendChild(card);
}

function cambiarCategoriaDirecta(categoria) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const btnTexto = categoria === 'matematicas' ? 'Matemáticas' : 'Informática';
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent.includes(btnTexto)) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.publicaciones-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(categoria + '-container').classList.add('active');
}

function verPublicacion(archivo, nombre) {
    const modal = document.createElement('div');
    modal.className = 'modal-pdf';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fa fa-file-pdf-o"></i> ${nombre}</h3>
                <button class="modal-close" onclick="cerrarModal()">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <iframe src="${archivo}" class="pdf-viewer"></iframe>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => modal.classList.add('active'), 10);
}

function cerrarModal() {
    const modal = document.querySelector('.modal-pdf');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}
function eliminarPublicacion(id, categoria) {
    if (confirm('¿Estás seguro de eliminar esta publicación?')) {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            card.remove();
            console.log('✅ Publicación eliminada:', id);
        }
    }
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

function toggleDatosHistoricos() {
    const section = document.getElementById('datos-historicos');
    if (section.classList.contains('activo')) {
        section.classList.remove('activo');
    } else {
        section.classList.add('activo');
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}
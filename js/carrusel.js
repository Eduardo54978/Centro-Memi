let currentSlide = 0;
let slideInterval;

console.log('Centro MEMI - Día 2 iniciando...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado - Iniciando componentes');
  initSidebar();
  initCarouselBasic();
  initTouchGestures(); 
  console.log('Todos los componentes inicializados');
});
function initSidebar() {
  console.log('Inicializando sidebar...');
  
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const dropdownItems = document.querySelectorAll('.dropdown');
  if (!toggleBtn) {
    console.error('❌ No se encontró el botón toggle (.toggle-btn)');
    return;
  }
  
  if (!sidebar) {
    console.error('❌ No se encontró el sidebar (#sidebar)');
    return;
  }

  console.log('✅ Elementos encontrados - configurando eventos');
  toggleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔥 Botón clickeado - toggleando sidebar');
    toggleSidebar();
  });
  if (overlay) {
    overlay.addEventListener('click', function() {
      console.log('Overlay clickeado - cerrando sidebar');
      closeSidebar();
    });
  }
  document.addEventListener('click', function(e) {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !toggleBtn.contains(e.target)) {
      console.log('Click fuera del sidebar - cerrando');
      closeSidebar();
    }
  });
  dropdownItems.forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log(`Submenu ${index} clickeado`);
      toggleSubmenu(this);
    });
  });
console.log('✅ Sidebar inicializado correctamente');
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  console.log('Cambiando estado del sidebar...');
  sidebar.classList.toggle('active');
  if (overlay) {
    overlay.classList.toggle('active');
  }
  const isActive = sidebar.classList.contains('active');
  console.log('Sidebar está:', isActive ? 'ABIERTO' : 'CERRADO');
  if (isActive) {
    document.body.style.overflow = 'hidden';
    console.log('Body scroll deshabilitado');
  } else {
    document.body.style.overflow = '';
    console.log('Body scroll habilitado');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  console.log('Cerrando sidebar...');
  
  sidebar.classList.remove('active');
  if (overlay) {
    overlay.classList.remove('active');
  }
  document.body.style.overflow = '';
  
  console.log('✅ Sidebar cerrado');
}

function toggleSubmenu(dropdownItem) {
  const targetId = dropdownItem.getAttribute('data-target');
  const submenu = document.getElementById(targetId);
  const arrow = dropdownItem.querySelector('.arrow');
  
  if (!submenu || !arrow) {
    console.warn('⚠️ Submenu o arrow no encontrado para:', targetId);
    return;
  }
  console.log('Toggle submenu:', targetId);
  document.querySelectorAll('.submenu.active').forEach(sub => {
    if (sub !== submenu) {
      sub.classList.remove('active');
      console.log('Cerrando otro submenu');
    }
  });
  
  document.querySelectorAll('.arrow.rotated').forEach(arr => {
    if (arr !== arrow) {
      arr.classList.remove('rotated');
    }
  });
  submenu.classList.toggle('active');
  arrow.classList.toggle('rotated');
  
  console.log('Submenu', targetId, submenu.classList.contains('active') ? 'ABIERTO' : 'CERRADO');
}

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
console.log(`
🏛️ Centro MEMI Día 2 - Sistema cargado
✅ Sidebar con submenús: OK
✅ Carrusel automático: OK  
✅ Navegación por teclado: OK
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
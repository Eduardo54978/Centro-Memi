console.log('Centro MEMI - Iniciando...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado - Inicializando componentes básicos');
  initBasicSidebar();
});
function initBasicSidebar() {
  const toggleBtn = document.querySelector('.toggle-btn');
  const sidebar = document.getElementById('sidebar');

  if (!toggleBtn || !sidebar) {
    console.warn('Elementos del sidebar no encontrados');
    return;
  }
  toggleBtn.addEventListener('click', function () {
    console.log('Toggle sidebar');
    sidebar.classList.toggle('active');
  });

  console.log('Sidebar básico inicializado');
}

console.log('JavaScript básico cargado correctamente');
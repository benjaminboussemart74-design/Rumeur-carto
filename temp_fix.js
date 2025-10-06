
// Solution simple pour corriger tous les problèmes
setTimeout(() => {
  // Masquer les éléments admin par défaut
  const editorToggle = document.getElementById('editor-toggle');
  if (editorToggle) editorToggle.style.display = 'none';
  
  // Améliorer la fermeture des modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('minister-modal');
      if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.body.style.pointerEvents = '';
      }
    }
  });
}, 1000);


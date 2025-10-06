// Script de debug pour forcer l'affichage de l'interface
console.log('🔧 Debug Interface - Forçage affichage');

// Forcer l'affichage des éléments principaux
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    console.log('🔧 Forçage affichage interface...');
    
    // Éléments à afficher
    const elements = [
      'sidebar',
      'main-content', 
      'government-tree',
      'tree-container'
    ];
    
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'block';
        el.style.visibility = 'visible';
        console.log(`✅ ${id} forcé visible`);
      } else {
        console.warn(`⚠️ ${id} introuvable`);
      }
    });
    
    // Vérifier l'état de l'application
    console.log('État application:', {
      supabase: !!window.supabase,
      adminManager: !!window.adminManager,
      treeInstance: !!window.treeInstance
    });
    
    // Afficher tous les éléments avec class hidden
    document.querySelectorAll('.hidden, [style*="display: none"]').forEach(el => {
      console.log('Élément caché trouvé:', el.id || el.className);
    });
    
  }, 2000);
});
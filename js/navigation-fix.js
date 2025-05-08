/**
 * Script para corrigir a navegação entre páginas
 * Este script permite que os links do header funcionem corretamente
 */

document.addEventListener('DOMContentLoaded', function() {
    // Corrigir o problema de navegação nos links do header
    const navLinks = document.querySelectorAll('a.nav-link');
    
    navLinks.forEach(link => {
        // Remover qualquer event listener existente
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // Adicionar o novo comportamento
        newLink.addEventListener('click', function(event) {
            // Permitir que o link funcione normalmente (navegação tradicional)
            // Não chamar event.preventDefault()
        });
    });
    
    // Corrigir o comportamento do logo
    const logoLink = document.querySelector('.nav-link-logo');
    if (logoLink) {
        logoLink.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

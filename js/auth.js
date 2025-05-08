/**
 * Arquivo de autenticação do Delícia Express
 * Responsável por gerenciar o login, logout e estado do usuário
 */

// Verificar se o usuário está logado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

/**
 * Atualiza a interface do usuário com base no estado de autenticação
 */
function updateAuthUI() {
    const currentUser = getCurrentUser();
    const authLinks = document.querySelectorAll('.auth-links');
    const userInfoElements = document.querySelectorAll('.user-info');
    
    if (currentUser && currentUser.isLoggedIn) {
        // Usuário está logado
        authLinks.forEach(container => {
            container.innerHTML = `
                <div class="flex items-center space-x-2">
                    <span class="text-sm hidden md:inline-block">Olá, ${currentUser.name}</span>
                    <div class="relative group">
                        <button class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200">
                            <i class="fas fa-user"></i>
                        </button>
                        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                            <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                <i class="fas fa-user-circle mr-2"></i> Meu Perfil
                            </a>
                            <a href="orders.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                <i class="fas fa-clipboard-list mr-2"></i> Meus Pedidos
                            </a>
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50" onclick="logout(); return false;">
                                <i class="fas fa-sign-out-alt mr-2"></i> Sair
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        userInfoElements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        // Usuário não está logado
        authLinks.forEach(container => {
            container.innerHTML = `
                <div class="flex items-center space-x-3">
                    <a href="login.html" class="nav-link text-sm md:text-base">
                        <i class="fas fa-sign-in-alt mr-1"></i>
                        <span class="hidden md:inline">Entrar</span>
                    </a>
                </div>
            `;
        });
        
        userInfoElements.forEach(element => {
            element.classList.add('hidden');
        });
    }
}

/**
 * Obtém os dados do usuário atual do localStorage
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Realiza o logout do usuário
 */
function logout() {
    localStorage.removeItem('currentUser');
    showNotification('Você saiu da sua conta com sucesso!', 'info');
    updateAuthUI();
    
    // Redirecionar para a página inicial após 1 segundo
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Verifica se o usuário está logado e redireciona se necessário
 * @param {boolean} requireAuth - Se true, redireciona para login se não estiver autenticado
 * @param {boolean} redirectIfAuth - Se true, redireciona para home se já estiver autenticado
 */
function checkAuth(requireAuth = false, redirectIfAuth = false) {
    const currentUser = getCurrentUser();
    const isLoggedIn = currentUser && currentUser.isLoggedIn;
    
    if (requireAuth && !isLoggedIn) {
        // Redirecionar para login se autenticação for necessária
        showNotification('Faça login para acessar esta página', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    
    if (redirectIfAuth && isLoggedIn) {
        // Redirecionar para home se já estiver autenticado
        showNotification('Você já está logado', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    
    return true;
}

/**
 * Exibe uma notificação na tela (duplicada de index.js para uso independente)
 */
function showNotification(message, type = 'info') {
    // Definir a classe de cor com base no tipo
    let colorClass = 'bg-blue-100 border-blue-500 text-blue-700';
    let icon = 'fa-info-circle';
    
    if (type === 'success') {
        colorClass = 'bg-green-100 border-green-500 text-green-700';
        icon = 'fa-check-circle';
    } else if (type === 'error') {
        colorClass = 'bg-red-100 border-red-500 text-red-700';
        icon = 'fa-exclamation-circle';
    } else if (type === 'warning') {
        colorClass = 'bg-yellow-100 border-yellow-500 text-yellow-700';
        icon = 'fa-exclamation-triangle';
    }
    
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 ${colorClass} border-l-4 p-4 shadow-md rounded-r z-50`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icon} mr-2"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        notification.style.transition = 'opacity 0.5s, transform 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

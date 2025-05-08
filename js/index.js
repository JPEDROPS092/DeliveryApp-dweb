/**
 * Arquivo JavaScript principal do Delícia Express
 * Responsável por todas as interações e funcionalidades do site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do carrinho
    initCart();
    
    // Menu mobile
    initMobileMenu();
    
    // Eventos e animações
    initEvents();
    
    // Sistema de categorias e filtros
    initFilters();
    
    // Funcionalidades das páginas específicas
    initPageSpecificFeatures();
});

/**
 * Inicializa o sistema de carrinho
 */
function initCart() {
    // Carregar carrinho do localStorage
    window.cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
    
    // Atualizar badge do carrinho
    updateCartBadge();
    
    // Adicionar evento para os botões "Adicionar ao Carrinho"
    document.body.addEventListener('click', function(event) {
        const addButton = event.target.closest('.add-to-cart');
        if (addButton) {
            handleAddToCart(addButton);
        }
    });
    
    // Se estiver na página do carrinho, inicializar recursos específicos
    if (document.getElementById('cart-page') || document.getElementById('cart-items-container')) {
        updateCartPage();
        attachCartItemListeners();
    }
}

/**
 * Salva o carrinho no localStorage
 */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(window.cart));
}

/**
 * Formata um valor para o formato de moeda brasileira
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

/**
 * Atualiza o indicador do número de itens no carrinho
 */
function updateCartBadge() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    const totalItems = Object.values(window.cart).reduce((sum, item) => sum + item.quantity, 0);
    
    cartBadges.forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

/**
 * Obtém a URL da imagem de um item pelo ID
 */
function getItemImage(itemId) {
    // Em um cenário real, isso seria uma busca de dados mais complexa
    const menuItems = document.querySelectorAll('.menu-item, .food-card');
    for (const item of menuItems) {
        const addButton = item.querySelector('.add-to-cart');
        if (addButton && addButton.dataset.id === String(itemId)) {
            return item.querySelector('img').src;
        }
    }
    return 'https://via.placeholder.com/150';
}

/**
 * Atualiza a página do carrinho com os itens atuais
 */
function updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;
    
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('delivery-fee');
    
    // Limpar lista atual
    const oldItemsList = document.getElementById('cart-items-list');
    if (oldItemsList) {
        oldItemsList.remove();
    }
    
    // Verificar se o carrinho está vazio
    const totalItems = Object.keys(window.cart).length;
    
    if (totalItems === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
        return;
    }
    
    // Mostrar o resumo e esconder mensagem de vazio
    if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
    if (cartSummary) cartSummary.classList.remove('hidden');
    
    // Criar nova lista
    const itemsList = document.createElement('div');
    itemsList.id = 'cart-items-list';
    itemsList.className = 'space-y-4';
    
    // Calcular valores
    let subtotal = 0;
    const deliveryFee = 5.99; // Taxa fixa de entrega
    
    // Adicionar itens à lista
    Object.values(window.cart).forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center gap-4 py-4 border-b last:border-b-0';
        itemElement.innerHTML = `
            <img src="${getItemImage(item.id)}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
            <div class="flex-grow">
                <h3 class="font-medium text-gray-800">${item.name}</h3>
                <p class="text-gray-500 text-sm">${formatCurrency(item.price)} cada</p>
            </div>
            <div class="flex items-center border rounded-md">
                <button class="decrease-quantity px-3 py-1 text-orange-500 hover:bg-gray-100" data-id="${item.id}">-</button>
                <span class="px-3 py-1">${item.quantity}</span>
                <button class="increase-quantity px-3 py-1 text-orange-500 hover:bg-gray-100" data-id="${item.id}">+</button>
            </div>
            <div class="text-right min-w-[80px]">
                <p class="font-medium">${formatCurrency(itemTotal)}</p>
                <button class="remove-item text-sm text-red-500 hover:text-red-700" data-id="${item.id}">Remover</button>
            </div>
        `;
        
        itemsList.appendChild(itemElement);
    });
    
    cartItemsContainer.insertBefore(itemsList, emptyCartMessage);
    
    // Atualizar valores
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (deliveryFeeElement) deliveryFeeElement.textContent = formatCurrency(deliveryFee);
    if (cartTotal) cartTotal.textContent = formatCurrency(subtotal + deliveryFee);
    
    // Anexar ouvintes aos botões
    attachCartItemListeners();
}

/**
 * Anexa event listeners aos botões do carrinho
 */
function attachCartItemListeners() {
    // Adicionar ouvintes para botões de aumentar/diminuir quantidade
    document.querySelectorAll('.increase-quantity, .decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            handleQuantityChange(this);
        });
    });
    
    // Adicionar ouvintes para botões de remover item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            handleRemoveItem(this);
        });
    });
    
    // Inicializar o botão de checkout se existir
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

/**
 * Manipula a alteração de quantidade de um item
 */
function handleQuantityChange(button) {
    const itemId = button.dataset.id;
    const isIncrease = button.classList.contains('increase-quantity');
    
    if (isIncrease) {
        window.cart[itemId].quantity += 1;
    } else {
        // Diminuir quantidade
        if (window.cart[itemId].quantity > 1) {
            window.cart[itemId].quantity -= 1;
        } else {
            // Se a quantidade chegar a 0, remover o item do carrinho
            delete window.cart[itemId];
        }
    }
    
    // Atualizar localStorage e interface
    saveCart();
    updateCartBadge();
    updateCartPage();
    
    // Animação de notificação discreta
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.classList.add('animate-bounce');
        setTimeout(() => icon.classList.remove('animate-bounce'), 500);
    });
}

/**
 * Manipula a remoção de um item do carrinho
 */
function handleRemoveItem(button) {
    const itemId = button.dataset.id;
    
    // Animação de desaparecer
    const itemElement = button.closest('.flex');
    itemElement.style.opacity = '0';
    itemElement.style.transform = 'translateX(20px)';
    itemElement.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Remover após animação
    setTimeout(() => {
        delete window.cart[itemId];
        saveCart();
        updateCartBadge();
        updateCartPage();
    }, 300);
}

/**
 * Manipula a adição de um item ao carrinho
 */
function handleAddToCart(button) {
    const itemId = button.dataset.id;
    const itemName = button.dataset.name;
    const itemPrice = parseFloat(button.dataset.price);
    
    // Criar animação de item adicionado ao carrinho
    const buttonRect = button.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartIcon) {
        const cartIconRect = cartIcon.getBoundingClientRect();
        
        // Criar elemento para animação
        const animateElement = document.createElement('div');
        animateElement.className = 'absolute bg-orange-500 rounded-full w-4 h-4 z-50';
        animateElement.style.top = `${buttonRect.top + buttonRect.height/2}px`;
        animateElement.style.left = `${buttonRect.left + buttonRect.width/2}px`;
        document.body.appendChild(animateElement);
        
        // Configurar animação
        animateElement.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Iniciar animação após um quadro
        requestAnimationFrame(() => {
            animateElement.style.top = `${cartIconRect.top + cartIconRect.height/2}px`;
            animateElement.style.left = `${cartIconRect.left + cartIconRect.width/2}px`;
            animateElement.style.opacity = '0';
            animateElement.style.transform = 'scale(0.5)';
            
            // Adicionar ao carrinho após animação
            setTimeout(() => {
                document.body.removeChild(animateElement);
                
                // Verificar se item já existe no carrinho
                if (window.cart[itemId]) {
                    window.cart[itemId].quantity += 1;
                } else {
                    // Adicionar novo item
                    window.cart[itemId] = {
                        id: itemId,
                        name: itemName,
                        price: itemPrice,
                        quantity: 1
                    };
                }
                
                // Salvar no localStorage e atualizar interface
                saveCart();
                updateCartBadge();
                
                // Mostrar notificação de sucesso
                showNotification(`${itemName} adicionado ao carrinho!`, 'success');
            }, 600);
        });
    } else {
        // Caso o ícone do carrinho não esteja visível, adicionar diretamente
        if (window.cart[itemId]) {
            window.cart[itemId].quantity += 1;
        } else {
            window.cart[itemId] = {
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1
            };
        }
        
        // Salvar no localStorage e atualizar interface
        saveCart();
        updateCartBadge();
        
        // Mostrar notificação de sucesso
        showNotification(`${itemName} adicionado ao carrinho!`, 'success');
    }
}

/**
 * Exibe uma notificação na tela
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

/**
 * Manipula o checkout
 */
function handleCheckout() {
    // Verificar se há itens no carrinho
    if (Object.keys(window.cart).length === 0) {
        showNotification('Seu carrinho está vazio. Adicione alguns itens antes de finalizar o pedido.', 'warning');
        return;
    }
    
    // Animação de loading
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Processando...';
    
    // Simular processamento
    setTimeout(() => {
        // Resetar carrinho
        window.cart = {};
        saveCart();
        updateCartBadge();
        
        // Mostrar confirmação
        const cartElement = document.getElementById('cart-page') || document.querySelector('main');
        cartElement.innerHTML = `
            <div class="text-center py-16 max-w-md mx-auto">
                <div class="mb-6 text-green-500">
                    <i class="fas fa-check-circle text-7xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800 mb-4">Pedido Realizado com Sucesso!</h1>
                <p class="text-gray-600 mb-8">Seu pedido foi recebido e está sendo preparado. Você receberá atualizações sobre o status da entrega.</p>
                <p class="text-gray-800 font-medium mb-2">Número do pedido: #${Math.floor(10000 + Math.random() * 90000)}</p>
                <p class="text-gray-800 font-medium mb-8">Tempo estimado de entrega: 30-45 minutos</p>
                <a href="index.html" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md inline-block">
                    Voltar para Início
                </a>
            </div>
        `;
    }, 2000);
}

/**
 * Inicializa o menu mobile
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

/**
 * Inicializa eventos e animações gerais
 */
function initEvents() {
    // Efeito hover nos cards de comida
    document.querySelectorAll('.food-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Simular envio do formulário
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Mostrar estado de carregamento
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Enviando...';
            
            // Simular atraso de rede
            setTimeout(() => {
                // Mostrar mensagem de sucesso
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        });
    }
}

/**
 * Inicializa os filtros de categoria
 */
function initFilters() {
    const categoryFilters = document.querySelectorAll('.category-filter');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (categoryFilters.length > 0 && menuItems.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Atualizar estado ativo dos filtros
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                menuItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        // Mostrar item com animação
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        // Animar entrada com pequeno atraso aleatório para efeito escalonado
                        const delay = Math.random() * 200;
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, delay);
                    } else {
                        // Esconder item com animação
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        // Remover completamente após animação
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

/**
 * Inicializa funcionalidades específicas para cada página
 */
function initPageSpecificFeatures() {
    // FAQ Accordion na página de FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Alternar a visibilidade da resposta
                const answer = this.nextElementSibling;
                const icon = this.querySelector('.fa-chevron-down');
                
                answer.classList.toggle('hidden');
                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
                
                // Fechar outras respostas
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        const otherAnswer = otherQuestion.nextElementSibling;
                        const otherIcon = otherQuestion.querySelector('.fa-chevron-down');
                        
                        if (otherAnswer) {
                            otherAnswer.classList.add('hidden');
                        }
                        
                        if (otherIcon) {
                            otherIcon.classList.remove('rotate-180');
                        }
                    }
                });
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Navegação entre páginas ---
    const allNavLinks = document.querySelectorAll('.nav-link, .nav-link-logo, .nav-link-button, .nav-link-footer');
    const allPages = document.querySelectorAll('.page');

    // Função para obter imagem do item por ID (simplesmente retorna a URL da imagem para efeito de demonstração)
    function getItemImage(itemId) {
        // Em um cenário real, isso seria uma busca de dados mais complexa
        const menuItems = document.querySelectorAll('.menu-item');
        for (const item of menuItems) {
            const addButton = item.querySelector('.add-to-cart');
            if (addButton && addButton.dataset.id === String(itemId)) {
                return item.querySelector('img').src;
            }
        }
        return 'https://via.placeholder.com/150';
    }

    // --- Funções do Carrinho ---

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function updateCartBadge() {
        const cartBadges = document.querySelectorAll('.cart-badge');
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

        cartBadges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        });
    }

    function updateCartPage() {
        const cartItemsContainer = document.getElementById('cart-items-container');
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
        const totalItems = Object.keys(cart).length;
        
        if (totalItems === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            return;
        }
        
        // Mostrar o resumo e esconder mensagem de vazio
        emptyCartMessage.classList.add('hidden');
        cartSummary.classList.remove('hidden');
        
        // Criar nova lista
        const itemsList = document.createElement('div');
        itemsList.id = 'cart-items-list';
        itemsList.className = 'space-y-4';
        
        // Calcular valores
        let subtotal = 0;
        const deliveryFee = 5.99; // Taxa fixa de entrega
        
        // Adicionar itens à lista
        Object.values(cart).forEach(item => {
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
        subtotalElement.textContent = formatCurrency(subtotal);
        deliveryFeeElement.textContent = formatCurrency(deliveryFee);
        cartTotal.textContent = formatCurrency(subtotal + deliveryFee);
        
        // Anexar ouvintes aos botões
        attachCartItemListeners();
    }

    function handleQuantityChange(button) {
        const itemId = button.dataset.id;
        const isIncrease = button.classList.contains('increase-quantity');
        
        if (isIncrease) {
            cart[itemId].quantity += 1;
        } else {
            // Diminuir quantidade
            if (cart[itemId].quantity > 1) {
                cart[itemId].quantity -= 1;
            } else {
                // Se a quantidade chegar a 0, remover o item do carrinho
                delete cart[itemId];
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

    function handleRemoveItem(button) {
        const itemId = button.dataset.id;
        
        // Animação de desaparecer
        const itemElement = button.closest('.flex');
        itemElement.style.opacity = '0';
        itemElement.style.transform = 'translateX(20px)';
        itemElement.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // Remover após animação
        setTimeout(() => {
            delete cart[itemId];
            saveCart();
            updateCartBadge();
            updateCartPage();
        }, 300);
    }

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
    }

    function handleAddToCart(button) {
        const itemId = button.dataset.id;
        const itemName = button.dataset.name;
        const itemPrice = parseFloat(button.dataset.price);
        
        // Criar animação de item adicionado ao carrinho
        const buttonRect = button.getBoundingClientRect();
        const cartIconRect = document.querySelector('.cart-icon').getBoundingClientRect();
        
        // Criar elemento para animação
        const animateElement = document.createElement('div');
        animateElement.className = 'absolute bg-orange-500 rounded-full w-4 h-4 z-50';
        animateElement.style.top = `${buttonRect.top + buttonRect.height/2}px`;
        animateElement.style.left = `${buttonRect.left + buttonRect.width/2}px`;
        document.body.appendChild(animateElement);
        
        // Configurar animação
        animateElement.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Iniciar animação após um quadro (para garantir que a transição seja aplicada)
        requestAnimationFrame(() => {
            animateElement.style.top = `${cartIconRect.top + cartIconRect.height/2}px`;
            animateElement.style.left = `${cartIconRect.left + cartIconRect.width/2}px`;
            animateElement.style.opacity = '0';
            animateElement.style.transform = 'scale(0.5)';
            
            // Adicionar ao carrinho após animação
            setTimeout(() => {
                document.body.removeChild(animateElement);
                
                // Verificar se item já existe no carrinho
                if (cart[itemId]) {
                    cart[itemId].quantity += 1;
                } else {
                    // Adicionar novo item
                    cart[itemId] = {
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
                const notification = document.createElement('div');
                notification.className = 'fixed top-24 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 shadow-md rounded-r animate-fadeIn z-50';
                notification.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-check-circle mr-2"></i>
                        <p>${itemName} adicionado ao carrinho!</p>
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
            }, 600);
        });
    }

    // Attach listener to a parent container using event delegation for "Add to Cart"
    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.add-to-cart')) {
            handleAddToCart(event.target.closest('.add-to-cart'));
        }
    });

    // --- Funções de Navegação ---
    function showPage(pageId) {
        // Ocultar todas as páginas
        allPages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar página solicitada
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Atualizar URL com hash
            history.pushState(null, null, `#${pageId}`);
            
            // Rolar para o topo quando mudar de página
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Se for a página de carrinho, atualize-a
            if (pageId === 'cart') {
                updateCartPage();
            }
            
            // Atualizar links ativos
            allNavLinks.forEach(link => {
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Fechar o menu mobile ao trocar de página
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    }

    function handleNavigation(event) {
        event.preventDefault();
        
        // Obter a página de destino do atributo data-page
        const pageId = this.getAttribute('data-page');
        if (pageId) {
            showPage(pageId);
            
            // Animação sutil ao clicar no link
            this.classList.add('scale-105');
            setTimeout(() => {
                this.classList.remove('scale-105');
            }, 200);
        }
    }

    // Attach navigation listeners
    allNavLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // --- Filtros do Cardápio ---
    const categoryFilters = document.querySelectorAll('.category-filter');
    const menuItems = document.querySelectorAll('.menu-item');

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

    // --- Formulário de Contato ---
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
                const successMessage = document.createElement('div');
                successMessage.className = 'mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded';
                successMessage.innerHTML = '<p><i class="fas fa-check-circle mr-2"></i> Mensagem enviada com sucesso! Entraremos em contato em breve.</p>';
                
                // Inserir após o formulário
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Resetar formulário
                contactForm.reset();
                
                // Restaurar botão
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Remover mensagem após alguns segundos
                setTimeout(() => {
                    successMessage.style.opacity = '0';
                    successMessage.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => successMessage.remove(), 500);
                }, 5000);
            }, 1500);
        });
    }

    // --- Checkout ---
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            // Verificar se há itens no carrinho
            if (Object.keys(cart).length === 0) {
                alert('Seu carrinho está vazio. Adicione alguns itens antes de finalizar o pedido.');
                return;
            }
            
            // Animação de loading
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Processando...';
            
            // Simular processamento
            setTimeout(() => {
                // Resetar carrinho
                cart = {};
                saveCart();
                updateCartBadge();
                
                // Mostrar confirmação
                const cartElement = document.getElementById('cart-page');
                cartElement.innerHTML = `
                    <div class="text-center py-16 max-w-md mx-auto">
                        <div class="mb-6 text-green-500">
                            <i class="fas fa-check-circle text-7xl"></i>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-4">Pedido Realizado com Sucesso!</h1>
                        <p class="text-gray-600 mb-8">Seu pedido foi recebido e está sendo preparado. Você receberá atualizações sobre o status da entrega.</p>
                        <p class="text-gray-800 font-medium mb-2">Número do pedido: #${Math.floor(10000 + Math.random() * 90000)}</p>
                        <p class="text-gray-800 font-medium mb-8">Tempo estimado de entrega: 30-45 minutos</p>
                        <button class="nav-link-button bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-md" data-page="home">
                            Voltar para Início
                        </button>
                    </div>
                `;
                
                // Reattach navigation listener to the new button
                const newHomeButton = cartElement.querySelector('.nav-link-button');
                if (newHomeButton) {
                    newHomeButton.addEventListener('click', handleNavigation);
                }
            }, 2000);
        });
    }

    // Setup cart from localStorage
    let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};
    updateCartBadge();
    attachCartItemListeners(); // Attach listeners for potential items already in cart on load (if cart page is initial)

    // Determine initial page based on hash or default to home
    const initialPageId = window.location.hash ? window.location.hash.substring(1) : 'home';
    showPage(initialPageId);
});

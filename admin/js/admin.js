document.addEventListener('DOMContentLoaded', function() {
    // Toggle para o menu lateral em dispositivos móveis
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('d-none');
        });
    }
    
    // Inicializar tabelas de dados
    initializeTables();
    
    // Inicializar handlers de formulários
    initializeFormHandlers();
    
    // Carregar dados do dashboard
    if (document.getElementById('dashboard')) {
        loadDashboardData();
    }
    
    // Carregar produtos
    if (document.getElementById('products-table')) {
        loadProducts();
    }
    
    // Carregar pedidos
    if (document.getElementById('orders-table')) {
        loadOrders();
    }
    
    // Verificar autenticação
    checkAuthentication();
});

// Função para verificar autenticação
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const currentPage = window.location.pathname;
    
    // Se está na página de login e já está logado, redirecionar para o dashboard
    if (currentPage.includes('login.html') && isLoggedIn === 'true') {
        window.location.href = 'index.html';
        return;
    }
    
    // Se não está na página de login e não está logado, redirecionar para login
    if (!currentPage.includes('login.html') && isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
}

// Função para fazer login
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Em um ambiente real, isso seria validado no servidor
    // Aqui estamos apenas simulando com credenciais fixas
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        window.location.href = 'index.html';
    } else {
        const errorMessage = document.getElementById('login-error');
        errorMessage.textContent = 'Usuário ou senha inválidos';
        errorMessage.classList.remove('d-none');
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    window.location.href = 'login.html';
}

// Função para inicializar tabelas
function initializeTables() {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        const searchInput = document.querySelector(`.search-input[data-table="${table.id}"]`);
        
        if (searchInput) {
            searchInput.addEventListener('keyup', function() {
                const searchText = this.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchText)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    });
}

// Função para inicializar handlers de formulários
function initializeFormHandlers() {
    // Form de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    // Form de adicionar produto
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addProduct();
        });
    }
    
    // Form de editar produto
    const editProductForm = document.getElementById('edit-product-form');
    if (editProductForm) {
        editProductForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateProduct();
        });
    }
}

// Função para carregar dados do dashboard
function loadDashboardData() {
    // Em um ambiente real, esses dados viriam de uma API
    // Aqui estamos apenas simulando com dados fixos
    
    // Estatísticas
    document.getElementById('total-orders').textContent = '256';
    document.getElementById('total-sales').textContent = 'R$ 12.435,78';
    document.getElementById('total-customers').textContent = '128';
    document.getElementById('average-order').textContent = 'R$ 48,58';
    
    // Gráfico de vendas (simulado)
    renderSalesChart();
    
    // Pedidos recentes
    const recentOrders = [
        { id: '1001', customer: 'João Silva', date: '25/04/2025', total: 'R$ 68,50', status: 'Entregue' },
        { id: '1002', customer: 'Maria Oliveira', date: '25/04/2025', total: 'R$ 42,90', status: 'Em entrega' },
        { id: '1003', customer: 'Pedro Santos', date: '24/04/2025', total: 'R$ 89,70', status: 'Preparando' },
        { id: '1004', customer: 'Ana Souza', date: '24/04/2025', total: 'R$ 36,80', status: 'Entregue' },
        { id: '1005', customer: 'Carlos Ferreira', date: '23/04/2025', total: 'R$ 54,20', status: 'Cancelado' }
    ];
    
    const recentOrdersTable = document.getElementById('recent-orders-table').querySelector('tbody');
    recentOrdersTable.innerHTML = '';
    
    recentOrders.forEach(order => {
        const statusClass = getStatusClass(order.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="order-details.html?id=${order.id}" class="text-decoration-none">#${order.id}</a></td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.total}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td>
                <a href="order-details.html?id=${order.id}" class="btn btn-sm btn-outline-primary">Ver</a>
            </td>
        `;
        
        recentOrdersTable.appendChild(row);
    });
}

// Função para definir a classe de status
function getStatusClass(status) {
    switch (status) {
        case 'Entregue':
            return 'bg-success text-white';
        case 'Em entrega':
            return 'bg-info text-white';
        case 'Preparando':
            return 'bg-warning text-dark';
        case 'Cancelado':
            return 'bg-danger text-white';
        default:
            return 'bg-secondary text-white';
    }
}

// Função para renderizar gráfico de vendas
function renderSalesChart() {
    // Em um ambiente real, isto usaria uma biblioteca como Chart.js
    // Aqui estamos apenas simulando com um gráfico simples
    const chartContainer = document.getElementById('sales-chart');
    
    if (!chartContainer) return;
    
    // Dados simulados de vendas dos últimos 7 dias
    const salesData = [2150, 1890, 2340, 2780, 1950, 2560, 3100];
    const maxSale = Math.max(...salesData);
    
    // Criar barras do gráfico
    chartContainer.innerHTML = '';
    
    salesData.forEach((sale, index) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - index));
        const dayName = day.toLocaleDateString('pt-BR', { weekday: 'short' });
        
        const barHeight = (sale / maxSale) * 100;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'col';
        barContainer.innerHTML = `
            <div class="d-flex flex-column align-items-center">
                <div class="position-relative" style="height: 150px; width: 30px;">
                    <div class="position-absolute bottom-0 bg-primary rounded-top" style="height: ${barHeight}%; width: 100%;"></div>
                </div>
                <div class="text-muted small mt-2">${dayName}</div>
                <div class="small">R$ ${(sale/100).toFixed(2)}</div>
            </div>
        `;
        
        chartContainer.appendChild(barContainer);
    });
}

// Função para carregar produtos
function loadProducts() {
    // Em um ambiente real, esses dados viriam de uma API
    // Aqui estamos apenas simulando com dados fixos
    const products = [
        { id: 1, name: 'Pizza Margherita', category: 'pizza', price: 'R$ 45,90', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
        { id: 2, name: 'Hambúrguer Gourmet', category: 'burger', price: 'R$ 32,50', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200' },
        { id: 3, name: 'Salada Caesar', category: 'salad', price: 'R$ 28,90', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200' },
        { id: 4, name: 'Pasta Carbonara', category: 'pasta', price: 'R$ 36,90', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200' },
        { id: 5, name: 'Pizza Calabresa', category: 'pizza', price: 'R$ 42,90', image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=200' },
    ];
    
    const productsTable = document.getElementById('products-table').querySelector('tbody');
    productsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" class="product-image-preview me-3">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editProductModal(${product.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProductModal(${product.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        productsTable.appendChild(row);
    });
}

// Função para carregar pedidos
function loadOrders() {
    // Em um ambiente real, esses dados viriam de uma API
    // Aqui estamos apenas simulando com dados fixos
    const orders = [
        { id: '1001', customer: 'João Silva', date: '25/04/2025 14:30', total: 'R$ 68,50', status: 'Entregue' },
        { id: '1002', customer: 'Maria Oliveira', date: '25/04/2025 13:45', total: 'R$ 42,90', status: 'Em entrega' },
        { id: '1003', customer: 'Pedro Santos', date: '24/04/2025 19:20', total: 'R$ 89,70', status: 'Preparando' },
        { id: '1004', customer: 'Ana Souza', date: '24/04/2025 12:15', total: 'R$ 36,80', status: 'Entregue' },
        { id: '1005', customer: 'Carlos Ferreira', date: '23/04/2025 20:10', total: 'R$ 54,20', status: 'Cancelado' },
        { id: '1006', customer: 'Mariana Costa', date: '23/04/2025 18:30', total: 'R$ 73,60', status: 'Entregue' },
        { id: '1007', customer: 'Rafael Almeida', date: '22/04/2025 21:05', total: 'R$ 48,90', status: 'Entregue' },
        { id: '1008', customer: 'Juliana Martins', date: '22/04/2025 19:50', total: 'R$ 62,30', status: 'Entregue' },
    ];
    
    const ordersTable = document.getElementById('orders-table').querySelector('tbody');
    ordersTable.innerHTML = '';
    
    orders.forEach(order => {
        const statusClass = getStatusClass(order.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="order-details.html?id=${order.id}" class="text-decoration-none">#${order.id}</a></td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.total}</td>
            <td><span class="status-badge ${statusClass}">${order.status}</span></td>
            <td>
                <a href="order-details.html?id=${order.id}" class="btn btn-sm btn-outline-primary me-1">
                    <i class="bi bi-eye"></i>
                </a>
                <button class="btn btn-sm btn-outline-secondary" onclick="updateOrderStatusModal(${order.id})">
                    <i class="bi bi-arrow-repeat"></i>
                </button>
            </td>
        `;
        
        ordersTable.appendChild(row);
    });
}

// Modal para edição de produto
function editProductModal(productId) {
    // Em um ambiente real, buscaria os dados do produto por ID via API
    // Aqui estamos apenas simulando
    
    // Abrir modal de edição
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
    
    // Preencher dados do formulário
    document.getElementById('edit-product-id').value = productId;
    // Demais campos seriam preenchidos com dados do produto
}

// Modal para exclusão de produto
function deleteProductModal(productId) {
    // Em um ambiente real, confirme e exclua o produto
    if (confirm(`Tem certeza que deseja excluir o produto #${productId}?`)) {
        alert('Produto excluído com sucesso!');
        // Recarregar lista de produtos
        loadProducts();
    }
}

// Modal para atualização de status de pedido
function updateOrderStatusModal(orderId) {
    // Em um ambiente real, isso abriria um modal para escolher o novo status
    const newStatus = prompt('Escolha o novo status do pedido:\nPreparando, Em entrega, Entregue, Cancelado');
    
    if (newStatus) {
        alert(`Status do pedido #${orderId} atualizado para: ${newStatus}`);
        // Recarregar lista de pedidos
        loadOrders();
    }
}

// Função para adicionar produto
function addProduct() {
    // Em um ambiente real, enviaria os dados do formulário para a API
    alert('Produto adicionado com sucesso!');
    document.getElementById('add-product-form').reset();
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    // Recarregar lista de produtos
    loadProducts();
}

// Função para atualizar produto
function updateProduct() {
    // Em um ambiente real, enviaria os dados do formulário para a API
    const productId = document.getElementById('edit-product-id').value;
    
    alert(`Produto #${productId} atualizado com sucesso!`);
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    modal.hide();
    
    // Recarregar lista de produtos
    loadProducts();
}

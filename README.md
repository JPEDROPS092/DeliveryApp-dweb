# Delícia Express - Aplicativo de Delivery

<p align="center">
  <img src="./images/favicon.png" alt="Delícia Express Logo" width="100"/>
</p>

<p align="center">
  Uma aplicação moderna para delivery de comida com interface intuitiva e responsiva
</p>

## 📋 Sobre o Projeto

Delícia Express é uma aplicação web moderna para pedidos de delivery online, com foco em experiência do usuário e design responsivo para qualquer dispositivo. O projeto foi desenvolvido utilizando HTML5, CSS3, JavaScript, e Tailwind CSS para criar uma interface atraente e funcional.

### ✨ Características Principais

- 🌐 Design 100% responsivo para todos os dispositivos (mobile e desktop)
- 🛒 Sistema de carrinho de compras com armazenamento local
- 🍔 Cardápio com categorias e filtros
- 📱 Menu mobile intuitivo
- 📄 Seção de FAQ interativa
- 📝 Blog com artigos sobre gastronomia
- 📦 Informações detalhadas sobre delivery
- 👨‍💼 Painel administrativo para gestão de produtos e pedidos

## 🚀 Tecnologias Utilizadas

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Tailwind CSS (local, sem dependência de CDN)
  - Font Awesome (ícones)

## 🛠️ Estrutura do Projeto

```
DeliveryApp-dweb/
├── index.html           # Página inicial
├── menu.html            # Cardápio
├── cart.html            # Carrinho de compras
├── about.html           # Sobre nós
├── contact.html         # Página de contato
├── delivery.html        # Informações de entrega
├── blog.html            # Blog
├── faq.html             # Perguntas frequentes
├── css/
│   ├── style.css        # Estilos personalizados
│   └── tailwind.min.css # Tailwind CSS local
├── js/
│   ├── script.js        # JavaScript principal
│   └── index.js         # Funcionalidades específicas
├── images/              # Imagens e recursos visuais
│   └── favicon.png      # Favicon do site
├── admin/               # Painel administrativo
│   ├── index.html       # Dashboard admin
│   ├── login.html       # Login admin
│   ├── products.html    # Gestão de produtos
│   ├── css/
│   │   └── admin.css    # Estilos do admin
│   └── js/
│       └── admin.js     # JavaScript do admin
└── README.md            # Documentação
```

## 🔄 Funcionalidades Implementadas

### Sistema de Carrinho
- Adição e remoção de itens
- Atualização de quantidades
- Persistência via localStorage
- Animações de interação ao adicionar itens

### Navegação Responsiva
- Menu adaptável para dispositivos móveis
- Layout otimizado para diferentes tamanhos de tela
- Transições suaves entre páginas

### Interatividade
- Filtros de categoria no cardápio
- Accordion na seção de FAQ
- Formulário de contato funcional
- Sistema de checkout simplificado

### Painel Administrativo
- Login seguro
- Dashboard com estatísticas
- Gestão de produtos e pedidos

## 🖥️ Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/jpedrops092/DeliveryApp-dweb.git
cd DeliveryApp-dweb
```

2. Abra o projeto em um servidor local:
```bash
# Usando live-server (Node.js)
npx live-server

# Ou usando o Five Server no VS Code
# Instale a extensão Five Server e clique em "Go Live"
```

3. Acesse no navegador:
```
http://localhost:8080
```

## 📱 Design Responsivo

O Delícia Express implementa uma abordagem mobile-first com suporte completo para:
- Smartphones (telas pequenas)
- Tablets (telas médias)
- Desktops (telas grandes)

Todas as páginas e componentes são otimizados para oferecer a melhor experiência possível em qualquer dispositivo.

## 📝 Futuras Implementações

- Integração com backend real para processamento de pedidos
- Sistema de login e cadastro de usuários
- Histórico de pedidos e perfil do cliente
- Localização de entregadores em tempo real
- Sistema de avaliações e feedbacks

---

Desenvolvido por jpedrops

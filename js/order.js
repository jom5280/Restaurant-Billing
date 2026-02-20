$(document).ready(async function () {
    // --- State Management ---
    let menu = [];
    let kitchenOrders = [];
    let customerCart = [];

    // Initialize Database
    try {
        await window.appDB.init();
        await loadInitialData();
    } catch (err) {
        console.error("Database initialization failed:", err);
    }

    async function loadInitialData() {
        menu = await window.appDB.getAll('menu');
        kitchenOrders = await window.appDB.getAll('kitchen_orders');
        renderCustomerMenu();
    }

    // --- Customer View Logic ---
    function renderCustomerMenu(filter = 'all', search = '') {
        const $grid = $('#customer-menu-grid');
        $grid.empty();

        const filtered = menu.filter(item => {
            const matchesCat = filter === 'all' || item.category === filter;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
        });

        filtered.forEach(item => {
            const card = `
                <div class="menu-item-card customer-item" data-id="${item.id}">
                    <span class="item-badge badge-${item.category}">${item.category}</span>
                    <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p class="menu-item-price">₹${item.price}</p>
                </div>
            `;
            $grid.append(card);
        });
    }

    function renderCustomerCart() {
        const $list = $('#customer-cart-items');
        $list.empty();

        if (customerCart.length === 0) {
            $list.append('<div class="empty-cart-msg">Select items to start your order</div>');
        } else {
            customerCart.forEach((item, index) => {
                const row = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span class="cart-item-qty">x${item.qty}</span>
                        </div>
                        <div class="cart-item-price">
                            ₹${item.price * item.qty}
                            <span class="remove-customer-item" data-index="${index}">✕</span>
                        </div>
                    </div>
                `;
                $list.append(row);
            });
        }
        updateCustomerTotals();
    }

    function updateCustomerTotals() {
        const total = customerCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        $('#customer-total').text(`₹${total.toFixed(2)}`);
    }

    $(document).on('click', '.customer-item', function () {
        const id = $(this).data('id');
        const item = menu.find(i => i.id == id);
        const existing = customerCart.find(c => c.id == id);
        if (existing) {
            existing.qty++;
        } else {
            customerCart.push({ ...item, qty: 1 });
        }
        renderCustomerCart();
    });

    $(document).on('click', '.remove-customer-item', function () {
        const index = $(this).data('index');
        customerCart.splice(index, 1);
        renderCustomerCart();
    });

    $('#customer-clear-cart').on('click', function () {
        customerCart = [];
        renderCustomerCart();
    });

    $('#submit-customer-order').on('click', async function () {
        if (customerCart.length === 0) return alert('Your selection is empty!');

        const tableNum = $('#table-number').val();
        if (!tableNum) return alert('Please enter your Table Number!');

        const order = {
            id: 'K-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            tableNum: tableNum,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            items: [...customerCart],
            status: 'pending'
        };

        await window.appDB.add('kitchen_orders', order);
        customerCart = [];
        $('#table-number').val('');
        renderCustomerCart();
        alert('Order submitted to kitchen! 🍲 #' + order.id);
    });

    $('#customer-item-search').on('input', function () {
        const filter = $('#customer-category-tabs .tab-btn.active').data('category');
        renderCustomerMenu(filter, $(this).val());
    });

    $('#customer-category-tabs .tab-btn').on('click', function () {
        $('#customer-category-tabs .tab-btn').removeClass('active');
        $(this).addClass('active');
        renderCustomerMenu($(this).data('category'), $('#customer-item-search').val());
    });
});


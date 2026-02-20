$(document).ready(function () {
    // --- State Management ---
    let menu = JSON.parse(localStorage.getItem('restaurant_menu')) || [
        { id: 1, name: 'Sadya', category: 'veg', price: 250, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Beef Fry', category: 'non-veg', price: 180, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'Appam & Stew', category: 'veg', price: 150, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 4, name: 'Karimeen Pollichathu', category: 'seafood', price: 450, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 5, name: 'Puttu & Kadala', category: 'veg', price: 80, image: 'https://images.unsplash.com/photo-1626132646529-500637532938?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 6, name: 'Chicken Biriyani', category: 'non-veg', price: 180, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 7, name: 'Lime Juice', category: 'drinks', price: 40, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
        { id: 8, name: 'Prawn Roast', category: 'seafood', price: 320, image: 'https://images.unsplash.com/photo-1559739511-e130c20ca6f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }
    ];

    let cart = [];
    let sales = JSON.parse(localStorage.getItem('restaurant_sales')) || [];
    let kitchenOrders = JSON.parse(localStorage.getItem('restaurant_kitchen_orders')) || [];
    let customerCart = [];

    // Save to LocalStorage
    function saveData() {
        localStorage.setItem('restaurant_menu', JSON.stringify(menu));
        localStorage.setItem('restaurant_sales', JSON.stringify(sales));
        localStorage.setItem('restaurant_kitchen_orders', JSON.stringify(kitchenOrders));
    }

    // --- Unpaid Orders Logic (Billing Integration) ---
    function renderUnpaidOrders() {
        const $grid = $('#unpaid-orders-grid');
        const $count = $('#unpaid-count');
        $grid.empty();

        // Orders that are preparing or ready (not completed/paid)
        const unpaid = kitchenOrders.filter(o => o.status !== 'completed' && o.status !== 'paid');
        $count.text(unpaid.length);

        if (unpaid.length === 0) {
            $grid.append('<p style="color: var(--text-secondary); font-size: 0.8rem;">No active table orders</p>');
            return;
        }

        unpaid.forEach(order => {
            const card = `
                <div class="unpaid-card" data-id="${order.id}">
                    <span class="status-dot ${order.status}"></span>
                    <span class="unpaid-table-no">Table ${order.tableNum}</span>
                    <span class="unpaid-order-meta">${order.items.length} items • ${order.time}</span>
                </div>
            `;
            $grid.append(card);
        });
    }

    $(document).on('click', '.unpaid-card', function () {
        const id = $(this).data('id');
        const order = kitchenOrders.find(o => o.id == id);
        if (order) {
            if (cart.length > 0 && !confirm('The current cart is not empty. Replace it with Table ' + order.tableNum + ' order?')) {
                return;
            }
            cart = [...order.items.map(item => ({ ...item, linkedOrderId: order.id }))];
            renderCart();
            alert('Loaded order from Table ' + order.tableNum);
        }
    });

    // --- View Switching ---
    $('.nav-links li').on('click', function () {
        $('.nav-links li').removeClass('active');
        $(this).addClass('active');
        const view = $(this).data('view');
        $('.view').removeClass('active');
        $(`#${view}-view`).addClass('active');

        if (view === 'admin') renderAdminMenu();
        if (view === 'reports') renderReports();
        if (view === 'customer') renderCustomerMenu();
        if (view === 'kitchen') renderKitchen();
        if (view === 'billing') renderUnpaidOrders();
    });

    // --- Billing View Logic ---
    function renderMenu(filter = 'all', search = '') {
        const $grid = $('#menu-grid');
        $grid.empty();

        const filtered = menu.filter(item => {
            const matchesCat = filter === 'all' || item.category === filter;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
        });

        filtered.forEach(item => {
            const card = `
                <div class="menu-item-card" data-id="${item.id}">
                    <span class="item-badge badge-${item.category}">${item.category}</span>
                    <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p class="menu-item-price">₹${item.price}</p>
                </div>
            `;
            $grid.append(card);
        });
    }

    // Tab Filtering
    $('.tab-btn').on('click', function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        renderMenu($(this).data('category'), $('#item-search').val());
    });

    // Search Filtering
    $('#item-search').on('input', function () {
        const filter = $('.tab-btn.active').data('category');
        renderMenu(filter, $(this).val());
    });

    // Add to Cart
    $(document).on('click', '.menu-item-card', function () {
        const id = $(this).data('id');
        const item = menu.find(i => i.id == id);

        const existing = cart.find(c => c.id == id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        renderCart();
    });

    function renderCart() {
        const $list = $('#cart-items');
        $list.empty();

        if (cart.length === 0) {
            $list.append('<div class="empty-cart-msg">Your cart is empty</div>');
        } else {
            cart.forEach((item, index) => {
                const row = `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span class="cart-item-qty">x${item.qty}</span>
                        </div>
                        <div class="cart-item-price">
                            ₹${item.price * item.qty}
                            <span class="remove-item" data-index="${index}">✕</span>
                        </div>
                    </div>
                `;
                $list.append(row);
            });
        }
        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const gst = subtotal * 0.02;
        const total = subtotal + gst;

        $('#subtotal').text(`₹${subtotal.toFixed(2)}`);
        $('#tax').text(`₹${gst.toFixed(2)}`);
        $('#grand-total').text(`₹${total.toFixed(2)}`);
    }

    $(document).on('click', '.remove-item', function () {
        const index = $(this).data('index');
        cart.splice(index, 1);
        renderCart();
    });

    $('#clear-cart').on('click', function () {
        cart = [];
        renderCart();
    });

    // --- Pay Now & QR ---
    $('#pay-now').on('click', function () {
        if (cart.length === 0) return alert('Cart is empty!');

        const total = $('#grand-total').text().replace('₹', '');
        $('#payment-modal').css('display', 'flex');

        // Generate QR
        $('#qrcode').empty();
        new QRCode(document.getElementById("qrcode"), {
            text: `upi://pay?pa=merchant@upi&pn=KeralaSpice&am=${total}&cu=INR`,
            width: 200,
            height: 200
        });
    });

    $('#confirm-payment').on('click', function () {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const gst = subtotal * 0.02;
        const total = subtotal + gst;

        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            total: total,
            status: 'Paid'
        };

        // If this cart was linked to a kitchen order, mark it as completed/paid
        cart.forEach(item => {
            if (item.linkedOrderId) {
                const kOrder = kitchenOrders.find(ko => ko.id === item.linkedOrderId);
                if (kOrder) {
                    kOrder.status = 'completed';
                }
            }
        });

        sales.push(order);
        saveData();
        cart = [];
        renderCart();
        renderUnpaidOrders(); // Refresh the list
        $('.modal').hide();
        alert('Payment Successful!');
    });

    // --- Admin View Logic ---
    function renderAdminMenu(filter = 'all', search = '') {
        const $body = $('#admin-menu-body');
        $body.empty();

        const filtered = menu.filter(item => {
            const matchesCat = filter === 'all' || item.category === filter;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
        });

        // Group by category if filter is 'all'
        const categories = filter === 'all' ? [...new Set(menu.map(i => i.category))] : [filter];

        categories.forEach(cat => {
            const catItems = filtered.filter(i => i.category === cat);
            if (catItems.length > 0) {
                $body.append(`<tr class="category-header-row"><td colspan="5">${cat}</td></tr>`);
                catItems.forEach(item => {
                    const row = `
                        <tr>
                            <td data-label="Item"><img src="${item.image || 'https://via.placeholder.com/150'}" class="admin-item-img"></td>
                            <td data-label="Name">${item.name}</td>
                            <td data-label="Category"><span class="item-badge badge-${item.category}">${item.category}</span></td>
                            <td data-label="Price">₹${item.price}</td>
                            <td data-label="Actions">
                                <button class="btn-text delete-item" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    $body.append(row);
                });
            }
        });
    }

    $('#admin-category-filter, #admin-item-search').on('change input', function () {
        renderAdminMenu($('#admin-category-filter').val(), $('#admin-item-search').val());
    });

    $('#add-item-cta').on('click', () => $('#item-modal').css('display', 'flex'));
    $('.close-modal').on('click', () => $('.modal').hide());

    $('#item-form').on('submit', function (e) {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            name: $('#item-name').val(),
            category: $('#item-category').val(),
            price: parseFloat($('#item-price').val()),
            image: $('#item-image').val() || 'https://via.placeholder.com/150'
        };
        menu.push(newItem);
        saveData();
        renderAdminMenu();
        renderMenu();
        $('#item-form')[0].reset();
        $('#item-modal').hide();
    });

    $(document).on('click', '.delete-item', function () {
        const id = $(this).data('id');
        menu = menu.filter(i => i.id != id);
        saveData();
        renderAdminMenu();
        renderMenu();
    });

    // --- Reports View Logic ---
    function renderReports(range = 'daily') {
        const now = new Date();
        let filteredSales = sales;

        if (range === 'daily') {
            filteredSales = sales.filter(s => new Date(s.date).toDateString() === now.toDateString());
        } else if (range === 'weekly') {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredSales = sales.filter(s => new Date(s.date) >= lastWeek);
        } else if (range === 'monthly') {
            filteredSales = sales.filter(s => {
                const d = new Date(s.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            });
        }

        const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
        $('#total-orders').text(filteredSales.length);
        $('#total-revenue').text(`₹${totalRevenue.toFixed(2)}`);

        const $body = $('#sales-history-body');
        $body.empty();
        filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(s => {
            const row = `
                <tr>
                    <td data-label="ID">${s.id.substring(4, 12)}...</td>
                    <td data-label="Date">${new Date(s.date).toLocaleDateString()}</td>
                    <td data-label="Total">₹${s.total.toFixed(2)}</td>
                    <td data-label="Status"><span style="color:var(--success)">${s.status}</span></td>
                </tr>
            `;
            $body.append(row);
        });
    }

    $('.report-tab').on('click', function () {
        $('.report-tab').removeClass('active');
        $(this).addClass('active');
        renderReports($(this).data('range'));
    });

    // --- Print functionality ---
    $('#print-bill').on('click', function () {
        if (cart.length === 0) return alert('Cart is empty!');

        // Prepare Print Receipt
        const $receiptList = $('#receipt-items-list');
        const $totalSection = $('#receipt-total-section');
        $receiptList.empty();
        $totalSection.empty();

        const now = new Date();
        $('#receipt-date-time').text(now.toLocaleString());

        cart.forEach(item => {
            $receiptList.append(`
                <div class="receipt-item-row" style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                    <span>${item.name} x ${item.qty}</span>
                    <span>₹${(item.price * item.qty).toFixed(2)}</span>
                </div>
            `);
        });

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const gst = subtotal * 0.02;
        const total = subtotal + gst;

        $totalSection.append(`
            <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                <span>Subtotal</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                <span>GST (2%)</span>
                <span>₹${gst.toFixed(2)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top: 10px; border-top: 1px dashed black; padding-top: 5px;">
                <span>Grand Total</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
        `);

        window.print();
    });

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
        if (existing) { existing.qty++; } else { customerCart.push({ ...item, qty: 1 }); }
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

    $('#submit-customer-order').on('click', function () {
        if (customerCart.length === 0) return alert('Your selection is empty!');

        const order = {
            id: 'K-' + Date.now().toString().slice(-6),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            items: [...customerCart],
            status: 'pending'
        };

        kitchenOrders.push(order);
        saveData();
        customerCart = [];
        renderCustomerCart();
        alert('Order submitted to kitchen! 🍲');
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

    // --- Kitchen View Logic ---
    function renderKitchen() {
        const $grid = $('#kitchen-orders-grid');
        $grid.empty();

        const pendingOrders = kitchenOrders.filter(o => o.status !== 'completed');
        $('#kitchen-pending-count').text(`Pending: ${pendingOrders.length}`);

        pendingOrders.forEach(order => {
            const itemsHtml = order.items.map(i => `<li><span>${i.name}</span><span>x${i.qty}</span></li>`).join('');

            const card = `
                <div class="kitchen-card status-${order.status}">
                    <div class="kitchen-card-header">
                        <div style="display: flex; flex-direction: column;">
                            <span class="kitchen-order-id">#${order.id}</span>
                            <span style="font-size: 0.9rem; font-weight: 700; color: var(--success); margin-top: 2px;">Table: ${order.tableNum || 'N/A'}</span>
                        </div>
                        <span class="status-badge ${order.status}">${order.status}</span>
                        <span class="kitchen-order-time">${order.time}</span>
                    </div>
                    <ul class="kitchen-order-items">${itemsHtml}</ul>
                    <div class="kitchen-card-actions">
                        ${order.status === 'pending' ?
                    `<button class="btn-primary start-prep" data-id="${order.id}">Start Prep</button>` :
                    `<button class="btn-success finish-prep" data-id="${order.id}">Order Delivered</button>`
                }
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }

    $(document).on('click', '.start-prep', function () {
        const id = $(this).data('id');
        const order = kitchenOrders.find(o => o.id == id);
        if (order) {
            order.status = 'preparing';
            saveData();
            renderKitchen();
            renderUnpaidOrders();
        }
    });

    $(document).on('click', '.finish-prep', function () {
        const id = $(this).data('id');
        const order = kitchenOrders.find(o => o.id == id);
        if (order) {
            order.status = 'ready';
            saveData();
            renderKitchen();
            renderUnpaidOrders();
        }
    });

    // Initial Render
    renderMenu();
    renderUnpaidOrders();
});

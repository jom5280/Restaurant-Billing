$(document).ready(async function () {
    // --- State Management ---
    let menu = [];
    let cart = [];
    let sales = [];
    let kitchenOrders = [];

    async function migrateData() {
        if (localStorage.getItem('db_migrated')) return;

        const oldMenu = [
            // Breads & Breakfast
            { id: 1, name: 'Appam (2pc)', category: 'veg', price: 30, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
            { id: 2, name: 'Idiyappam (3pc)', category: 'veg', price: 45, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
            { id: 3, name: 'Kerala Paratha (2pc)', category: 'veg', price: 50, image: 'https://images.unsplash.com/photo-1626132646529-500637532938?auto=format&fit=crop&w=400&q=80' },
            { id: 4, name: 'Chiratta Puttu', category: 'veg', price: 40, image: 'https://images.unsplash.com/photo-1626132646529-500637532938?auto=format&fit=crop&w=400&q=80' },
            { id: 5, name: 'Wheat Paratha', category: 'veg', price: 30, image: 'https://images.unsplash.com/photo-1593560704563-f175a22baa19?auto=format&fit=crop&w=400&q=80' },
            { id: 6, name: 'Masala Dosa', category: 'veg', price: 80, image: 'https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?auto=format&fit=crop&w=400&q=80' },

            // Special Kizhi Items
            { id: 7, name: 'Chicken Kizhi Porotta', category: 'non-veg', price: 200, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
            { id: 8, name: 'Chicken Kizhi', category: 'non-veg', price: 220, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
            { id: 9, name: 'Beef Kizhi', category: 'non-veg', price: 240, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=400&q=80' },
            { id: 10, name: 'Prawns Kizhi', category: 'seafood', price: 330, image: 'https://images.unsplash.com/photo-1559739511-e130c20ca6f5?auto=format&fit=crop&w=400&q=80' },

            // Beef Specialties
            { id: 11, name: 'Dragon Beef', category: 'non-veg', price: 320, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=400&q=80' },
            { id: 12, name: 'Beef Roast', category: 'non-veg', price: 170, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=400&q=80' },
            { id: 13, name: 'Beef Kothu Parotta', category: 'non-veg', price: 180, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
            { id: 14, name: 'Idi Irachi Beef', category: 'non-veg', price: 290, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=400&q=80' },
            { id: 15, name: 'Beef Kondattom', category: 'non-veg', price: 270, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=400&q=80' },

            // Chicken Dishes
            { id: 16, name: 'Chicken Biryani', category: 'non-veg', price: 190, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400&q=80' },
            { id: 17, name: 'Chicken Manchurian', category: 'non-veg', price: 220, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },
            { id: 18, name: 'Chicken Fry', category: 'non-veg', price: 230, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80' },
            { id: 19, name: 'Dragon Chicken', category: 'non-veg', price: 280, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },
            { id: 20, name: 'Chicken Kondattom', category: 'non-veg', price: 260, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },
            { id: 21, name: 'Chilli Chicken Dry', category: 'non-veg', price: 250, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },

            // Duck, Mutton & Exotic
            { id: 22, name: 'Duck Pepper Roast', category: 'non-veg', price: 350, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 23, name: 'Mutton Pepper Roast', category: 'non-veg', price: 250, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },
            { id: 24, name: 'Rabbit Pepper Roast', category: 'non-veg', price: 350, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 25, name: 'Kada Roast', category: 'non-veg', price: 180, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 26, name: 'Pork Piralan', category: 'non-veg', price: 330, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },

            // Seafood
            { id: 27, name: 'Motha Roast (Fish)', category: 'seafood', price: 350, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 28, name: 'Kerala Fish Curry', category: 'seafood', price: 150, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 29, name: 'Fish Finger', category: 'seafood', price: 140, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400&q=80' },
            { id: 30, name: 'Prawns 65 Dry', category: 'seafood', price: 320, image: 'https://images.unsplash.com/photo-1559739511-e130c20ca6f5?auto=format&fit=crop&w=400&q=80' },
            { id: 31, name: 'Karimeen Pollichathu', category: 'seafood', price: 450, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80' },

            // Veg Curries
            { id: 32, name: 'Kadhai Paneer', category: 'veg', price: 210, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' },
            { id: 33, name: 'Kadala Curry', category: 'veg', price: 50, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80' },
            { id: 34, name: 'Gobi Manchurian', category: 'veg', price: 140, image: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=400&q=80' },

            // Rice, Noodles & Biryani
            { id: 35, name: 'Mixed Noodles', category: 'non-veg', price: 190, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
            { id: 36, name: 'Chicken Noodles', category: 'non-veg', price: 170, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },
            { id: 37, name: 'Egg Biryani', category: 'non-veg', price: 140, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400&q=80' },
            { id: 38, name: 'Veg Fried Rice', category: 'veg', price: 140, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80' },

            // Shalimar Unique Additions
            { id: 43, name: 'Butter Chicken', category: 'non-veg', price: 320, image: 'https://images.unsplash.com/photo-1603894584100-30062bc40280?auto=format&fit=crop&w=400&q=80' },
            { id: 44, name: 'Mutton Biryani', category: 'non-veg', price: 390, image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80' },
            { id: 45, name: 'Koonthal (Squid) Roast', category: 'seafood', price: 230, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80' },
            { id: 46, name: 'Beef Biryani', category: 'non-veg', price: 240, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400&q=80' },
            { id: 47, name: 'Fish Roast', category: 'seafood', price: 190, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80' },
            { id: 48, name: 'Podimeen Fry', category: 'seafood', price: 110, image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=400&q=80' },
            { id: 49, name: 'Paneer Roller Tikka', category: 'veg', price: 200, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' },
            { id: 50, name: 'Chicken 65', category: 'non-veg', price: 220, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80' },
            { id: 51, name: 'Ginger Chicken', category: 'non-veg', price: 220, image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=400&q=80' },
            { id: 52, name: 'Tomato Fry', category: 'veg', price: 120, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
            { id: 53, name: 'Chicken Stew', category: 'non-veg', price: 220, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },

            // Drinks & Snacks
            { id: 39, name: 'Fresh Lime', category: 'drinks', price: 30, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
            { id: 40, name: 'Cold Coffee', category: 'drinks', price: 80, image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&w=400&q=80' },
            { id: 41, name: 'Tea', category: 'drinks', price: 15, image: 'https://images.unsplash.com/photo-1544787210-2213d64ad996?auto=format&fit=crop&w=400&q=80' },
            { id: 42, name: 'Onion Pakoda', category: 'veg', price: 100, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' }
        ];
        const oldSales = JSON.parse(localStorage.getItem('restaurant_sales')) || [];
        const oldKOrders = JSON.parse(localStorage.getItem('restaurant_kitchen_orders')) || [];

        for (const item of oldMenu) await window.appDB.put('menu', item);
        for (const sale of oldSales) await window.appDB.put('sales', sale);
        for (const order of oldKOrders) await window.appDB.put('kitchen_orders', order);

        localStorage.setItem('db_migrated', 'true');
    }

    $('#reset-menu-btn').on('click', async function () {
        if (confirm('Are you sure you want to reset the menu to default Aiswarya Restaurant items? This will remove all custom items.')) {
            await window.appDB.clear('menu');
            localStorage.removeItem('db_migrated');
            await migrateData();
            await loadAllData();
            alert('Menu has been reset to default.');
        }
    });

    // Initialize Database
    try {
        await window.appDB.init();
        await migrateData();
        await loadAllData();
    } catch (err) {
        console.error("Database initialization failed:", err);
    }

    async function loadAllData() {
        menu = await window.appDB.getAll('menu');
        sales = await window.appDB.getAll('sales');
        kitchenOrders = await window.appDB.getAll('kitchen_orders');
        renderMenu();
        renderUnpaidOrders();
    }

    // --- Unpaid Orders Logic (Billing Integration) ---
    function renderUnpaidOrders() {
        const $grid = $('#unpaid-orders-grid');
        const $count = $('#unpaid-count');
        $grid.empty();

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

    $('.tab-btn').on('click', function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        renderMenu($(this).data('category'), $('#item-search').val());
    });

    $('#item-search').on('input', function () {
        const filter = $('.tab-btn.active').data('category');
        renderMenu(filter, $(this).val());
    });

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

    $('#pay-now').on('click', function () {
        if (cart.length === 0) return alert('Cart is empty!');
        const total = $('#grand-total').text().replace('₹', '');
        $('#payment-modal').css('display', 'flex');
        $('#qrcode').empty();
        new QRCode(document.getElementById("qrcode"), {
            text: `upi://pay?pa=merchant@upi&pn=KeralaSpice&am=${total}&cu=INR`,
            width: 200,
            height: 200
        });
    });

    $('#confirm-payment').on('click', async function () {
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

        for (const item of cart) {
            if (item.linkedOrderId) {
                const kOrder = kitchenOrders.find(ko => ko.id === item.linkedOrderId);
                if (kOrder) {
                    kOrder.status = 'completed';
                    await window.appDB.put('kitchen_orders', kOrder);
                }
            }
        }

        await window.appDB.put('sales', order);
        sales.push(order);
        cart = [];
        renderCart();
        renderUnpaidOrders();
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
    $('.close-modal').on('click', () => {
        $('.modal').hide();
        $('#image-preview').hide();
        $('#item-form')[0].reset();
    });

    // Handle Image Preview
    $('#item-image').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#image-preview img').attr('src', e.target.result);
                $('#image-preview').show();
            };
            reader.readAsDataURL(file);
        }
    });

    $('#item-form').on('submit', async function (e) {
        e.preventDefault();
        const file = $('#item-image')[0].files[0];
        let imageData = 'https://via.placeholder.com/150';

        if (file) {
            imageData = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        const newItem = {
            id: Date.now(),
            name: $('#item-name').val(),
            category: $('#item-category').val(),
            price: parseFloat($('#item-price').val()),
            image: imageData
        };

        await window.appDB.add('menu', newItem);
        menu.push(newItem);
        renderAdminMenu();
        renderMenu();
        $('#item-form')[0].reset();
        $('#image-preview').hide();
        $('#item-modal').hide();
        alert('Item added successfully!');
    });

    $(document).on('click', '.delete-item', async function () {
        const id = $(this).data('id');
        if (confirm('Delete this item?')) {
            await window.appDB.delete('menu', id);
            menu = menu.filter(i => i.id != id);
            renderAdminMenu();
            renderMenu();
        }
    });

    // --- Sales Performance Dashboard Logic ---
    let dashboardState = {
        currentPage: 1,
        itemsPerPage: 10,
        currentStatus: 'all',
        selectedIds: new Set()
    };

    async function renderReports() {
        // Fetch fresh data from both stores for a unified view
        const allSales = await window.appDB.getAll('sales');
        const activeOrders = await window.appDB.getAll('kitchen_orders');

        // Merge them for the dashboard
        let unifiedOrders = [...allSales, ...activeOrders];
        unifiedOrders.sort((a, b) => new Date(b.date || b.time) - new Date(a.date || a.time));

        // Update Counts
        $('#count-all').text(unifiedOrders.length);
        $('#count-pending').text(unifiedOrders.filter(o => o.status === 'pending' || o.status === 'preparing').length);
        $('#count-paid').text(unifiedOrders.filter(o => o.status === 'paid' || o.status === 'completed').length);
        $('#count-cancelled').text(unifiedOrders.filter(o => o.status === 'cancelled').length);

        // Filter by Status
        let filtered = unifiedOrders;
        if (dashboardState.currentStatus !== 'all') {
            if (dashboardState.currentStatus === 'pending') {
                filtered = unifiedOrders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
            } else if (dashboardState.currentStatus === 'paid') {
                filtered = unifiedOrders.filter(o => o.status === 'paid' || o.status === 'completed');
            } else {
                filtered = unifiedOrders.filter(o => o.status === dashboardState.currentStatus);
            }
        }

        // Pagination
        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / dashboardState.itemsPerPage);
        const startIdx = (dashboardState.currentPage - 1) * dashboardState.itemsPerPage;
        const pageData = filtered.slice(startIdx, startIdx + dashboardState.itemsPerPage);

        // Render Table
        const $body = $('#sales-dashboard-body');
        $body.empty();

        pageData.forEach(order => {
            const isSelected = dashboardState.selectedIds.has(order.id.toString());
            const itemsList = order.items.map(i => i.name).join(', ');

            // Map Status to Progress & Badge
            let progress = 0;
            let statusClass = 'status-behind';
            let statusLabel = order.status;

            if (order.status === 'pending') { progress = 33; statusClass = 'status-behind'; }
            else if (order.status === 'preparing') { progress = 66; statusClass = 'status-at-risk'; }
            else if (order.status === 'ready') { progress = 90; statusClass = 'status-at-risk'; }
            else if (order.status === 'paid' || order.status === 'completed') { progress = 100; statusClass = 'status-good'; statusLabel = 'Paid'; }
            else if (order.status === 'cancelled') { progress = 0; statusClass = 'status-behind'; }

            const row = `
                <tr class="${isSelected ? 'selected' : ''}">
                    <td>
                        <div class="custom-checkbox ${isSelected ? 'checked' : ''}" data-id="${order.id}">
                            <i>✓</i>
                        </div>
                    </td>
                    <td data-label="Order ID" style="font-weight: 700;">#${order.id.toString().substring(0, 8)}</td>
                    <td data-label="Items" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-secondary);">
                        ${itemsList}
                    </td>
                    <td data-label="Progress">
                        <div class="progress-container">
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${progress}%; background: ${progress < 40 ? '#e74c3c' : progress < 90 ? '#f1c40f' : '#2ecc71'}"></div>
                            </div>
                            <span class="progress-text">${progress}%</span>
                        </div>
                    </td>
                    <td data-label="Status"><span class="pill-badge ${statusClass}">${statusLabel}</span></td>
                    <td data-label="Date" style="color: var(--text-secondary); font-size: 0.85rem;">
                        ${new Date(order.date || order.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td data-label="Revenue" style="font-weight: 700; color: var(--accent-color);">₹${(order.total || 0).toFixed(2)}</td>
                    <td data-label="Actions" style="text-align: right;">
                        <div class="action-btns">
                            <button class="icon-btn edit-order" data-id="${order.id}">✎</button>
                            <button class="icon-btn delete-order" data-id="${order.id}">🗑</button>
                        </div>
                    </td>
                </tr>
            `;
            $body.append(row);
        });

        renderPagination(totalPages);
        updateSelectedCount();
    }

    function renderPagination(totalPages) {
        const $container = $('#sales-pagination');
        $container.empty();

        for (let i = 1; i <= totalPages; i++) {
            const $link = $(`<div class="page-link ${i === dashboardState.currentPage ? 'active' : ''}">${i}</div>`);
            $link.on('click', () => {
                dashboardState.currentPage = i;
                renderReports();
            });
            $container.append($link);
        }
    }

    function updateSelectedCount() {
        $('#selected-count').text(dashboardState.selectedIds.size);
        if (dashboardState.selectedIds.size > 0) {
            $('#select-all-sales').addClass('checked');
        } else {
            $('#select-all-sales').removeClass('checked');
        }
    }

    // Event Handlers
    $(document).on('click', '.dashboard-tab', function () {
        $('.dashboard-tab').removeClass('active');
        $(this).addClass('active');
        dashboardState.currentStatus = $(this).data('status');
        dashboardState.currentPage = 1;
        renderReports();
    });

    $(document).on('click', '.custom-checkbox[data-id]', function (e) {
        e.stopPropagation();
        const id = $(this).data('id').toString(); // Ensure string for consistency
        if (dashboardState.selectedIds.has(id)) {
            dashboardState.selectedIds.delete(id);
        } else {
            dashboardState.selectedIds.add(id);
        }
        renderReports();
    });

    $('#select-all-sales').on('click', async function () {
        const filtered = await getFilteredOrders();
        const allFilteredSelected = filtered.every(o => dashboardState.selectedIds.has(o.id.toString()));

        if (allFilteredSelected) {
            filtered.forEach(o => dashboardState.selectedIds.delete(o.id.toString()));
        } else {
            filtered.forEach(o => dashboardState.selectedIds.add(o.id.toString()));
        }
        renderReports();
    });

    async function getFilteredOrders() {
        const allSales = await window.appDB.getAll('sales');
        const activeOrders = await window.appDB.getAll('kitchenOrders');
        let unified = [...allSales, ...activeOrders];

        if (dashboardState.currentStatus === 'all') return unified;
        if (dashboardState.currentStatus === 'pending') return unified.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
        if (dashboardState.currentStatus === 'paid') return unified.filter(o => o.status === 'paid' || o.status === 'completed');
        return unified.filter(o => o.status === dashboardState.currentStatus);
    }

    $('#export-selected-btn').on('click', async function () {
        if (dashboardState.selectedIds.size === 0) return alert('Please select at least one order to export.');

        const allSales = await window.appDB.getAll('sales');
        const activeOrders = await window.appDB.getAll('kitchen_orders');
        const all = [...allSales, ...activeOrders];

        const toExport = all.filter(o => dashboardState.selectedIds.has(o.id.toString()));
        exportOrdersToCSV(toExport, `selected_orders_${new Date().toISOString().split('T')[0]}`);
    });

    function exportOrdersToCSV(orders, filename) {
        let csvContent = "\uFEFFOrder ID,Date,Table,Items,Total,Status\n";
        orders.forEach(o => {
            const items = o.items.map(i => `${i.name} (x${i.qty})`).join('; ');
            const row = [o.id, new Date(o.date || o.time).toLocaleString(), o.tableNum || 'N/A', `"${items}"`, o.total.toFixed(2), o.status].join(',');
            csvContent += row + "\n";
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Kerala_Spice_${filename}.csv`;
        link.click();
    }

    // --- Dashboard Action Handlers ---
    $(document).on('click', '.delete-order', async function (e) {
        e.stopPropagation();
        const id = $(this).data('id');
        if (confirm('Are you sure you want to delete this order? This cannot be undone.')) {
            // Try deleting from both potential stores
            await window.appDB.delete('sales', id);
            await window.appDB.delete('kitchen_orders', id);

            // Clean up selection if needed
            dashboardState.selectedIds.delete(id);

            // Refresh
            await loadAllData();
            renderReports();
            alert('Order deleted successfully.');
        }
    });

    $(document).on('click', '.edit-order', async function (e) {
        e.stopPropagation();
        const id = $(this).data('id');

        // Find the order
        const allSales = await window.appDB.getAll('sales');
        const activeOrders = await window.appDB.getAll('kitchen_orders');
        const order = [...allSales, ...activeOrders].find(o => o.id == id);

        if (order) {
            $('#edit-status-id').val(order.id);
            $('#order-status-select').val(order.status);
            $('#status-modal').css('display', 'flex');
        }
    });

    $('#status-form').on('submit', async function (e) {
        e.preventDefault();
        const id = $('#edit-status-id').val();
        const newStatus = $('#order-status-select').val();

        // 1. Try to find/update in sales
        const salesData = await window.appDB.getAll('sales');
        const sale = salesData.find(s => s.id == id);
        if (sale) {
            sale.status = newStatus;
            await window.appDB.put('sales', sale);
        }

        // 2. Try to find/update in kitchen_orders
        const kitchenData = await window.appDB.getAll('kitchen_orders');
        const kOrder = kitchenData.find(o => o.id == id);
        if (kOrder) {
            kOrder.status = newStatus;
            // If marked as paid, we should move it to sales (or ensure it's synced)
            // For now, just update the status in its native store
            await window.appDB.put('kitchen_orders', kOrder);
        }

        $('#status-modal').hide();
        await loadAllData();
        renderReports();
        alert('Order status updated.');
    });

    // Initial render
    setTimeout(renderReports, 500);

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

    $(document).on('click', '.start-prep', async function () {
        const id = $(this).data('id');
        const order = kitchenOrders.find(o => o.id == id);
        if (order) {
            order.status = 'preparing';
            await window.appDB.put('kitchen_orders', order);
            renderKitchen();
            renderUnpaidOrders();
        }
    });

    $(document).on('click', '.finish-prep', async function () {
        const id = $(this).data('id');
        const order = kitchenOrders.find(o => o.id == id);
        if (order) {
            order.status = 'ready';
            await window.appDB.put('kitchen_orders', order);
            renderKitchen();
            renderUnpaidOrders();
        }
    });

    // --- Sync check (for SPA feel) ---
    window.addEventListener('storage', async () => {
        await loadAllData();
    });
});


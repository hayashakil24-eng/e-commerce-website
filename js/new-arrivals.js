document.addEventListener("DOMContentLoaded", function () {
    // === CONFIGURATION & STATE ===
    const productGrid = document.getElementById('productGrid');
    const sortSelect = document.getElementById('sortSelect');
    const toggleFilterBtn = document.getElementById('toggleFilterBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const closeSidebarMobile = document.getElementById('closeSidebarMobile');
    const activeFiltersContainer = document.getElementById('activeFilters');
    const colorSwatches = document.querySelectorAll('.swatch');
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const priceInputs = document.querySelectorAll('input[name="price"]');
    const viewOptions = document.querySelectorAll('.view-options i');
    const loadMoreBtn = document.querySelector('.load-more-btn');

    // Use global coreProducts from main.js if available, otherwise fallback (or waiting for main.js to load)
    // Note: Since main.js is loaded before this script in HTML, coreProducts should be accessible.
    let allProducts = typeof coreProducts !== 'undefined' ? coreProducts : [];

    // Fallback Mock Data if main.js fails for some reason
    if (allProducts.length === 0) {
        console.warn("coreProducts not found from main.js, using fallback data.");
        // Add minimal fallback data or handle empty state
    }

    // Filter only NEW products
    let newArrivals = allProducts.filter(p => p.badge === 'NEW');

    let state = {
        products: [...newArrivals],
        filteredProducts: [...newArrivals],
        filters: {
            category: 'All',
            price: 'all',
            color: null
        },
        sort: 'newest',
        visibleCount: 8,
        itemsPerPage: 8
    };

    // === INITIALIZATION ===
    init();

    function init() {
        renderProducts();
        updateActiveFiltersUI();
        setupEventListeners();
        checkLoadMoreVisibility();
    }

    // === EVENT LISTENERS ===
    function setupEventListeners() {
        // Toggle Sidebar (Mobile/Tablet)
        toggleFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
            // On mobile, this will leverage the CSS transform
            // On desktop, we might want to toggle visibility or width, 
            // but CSS handles mobile 'active' state for slide-up. 
            // For desktop toggle implementation:
            if (window.innerWidth > 768) {
                filterSidebar.classList.toggle('hidden');
            }
        });

        closeSidebarMobile.addEventListener('click', () => {
            filterSidebar.classList.remove('active');
        });

        // Sorting
        sortSelect.addEventListener('change', (e) => {
            state.sort = e.target.value;
            applyFiltersAndSort();
        });

        // Category Filter
        categoryInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                state.filters.category = e.target.value;
                applyFiltersAndSort();
            });
        });

        // Price Filter
        priceInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                state.filters.price = e.target.value;
                applyFiltersAndSort();
            });
        });

        // Color Filter
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                // Toggle selection
                const color = swatch.dataset.color;
                if (state.filters.color === color) {
                    state.filters.color = null; // deselect
                    swatch.classList.remove('selected');
                } else {
                    state.filters.color = color;
                    // Reset others
                    colorSwatches.forEach(s => s.classList.remove('selected'));
                    swatch.classList.add('selected');
                }
                applyFiltersAndSort();
            });
        });

        // Grid View Toggle
        viewOptions.forEach(icon => {
            icon.addEventListener('click', () => {
                const cols = icon.dataset.col;
                // Update active state
                viewOptions.forEach(i => i.classList.remove('active'));
                icon.classList.add('active');

                // Update grid columns
                productGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            });
        });

        // Load More
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                state.visibleCount += state.itemsPerPage;
                renderProducts();
                checkLoadMoreVisibility();
            });
        }
    }

    // === CORE LOGIC ===

    function applyFiltersAndSort() {
        let result = [...newArrivals];

        // 1. Filter by Category
        if (state.filters.category !== 'All') {
            result = result.filter(p => p.category.toLowerCase() === state.filters.category.toLowerCase());
        }

        // 2. Filter by Price
        if (state.filters.price !== 'all') {
            result = result.filter(p => {
                if (state.filters.price === 'under-50') return p.price < 50;
                if (state.filters.price === '50-100') return p.price >= 50 && p.price <= 100;
                if (state.filters.price === '100-plus') return p.price > 100;
                return true;
            });
        }

        // 3. Filter by Color
        if (state.filters.color) {
            result = result.filter(p => p.colors && p.colors.includes(state.filters.color));
        }

        // 4. Sort
        if (state.sort === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (state.sort === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (state.sort === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Newest is default, usually by ID or Date if available. 
            // Since we have limited data, we assume standard order is 'newest' for now.
            // Or randomize/reverse for variation if needed.
        }

        state.filteredProducts = result;
        state.visibleCount = state.itemsPerPage; // Reset pagination
        renderProducts();
        updateActiveFiltersUI();
        checkLoadMoreVisibility();
    }

    function renderProducts() {
        productGrid.innerHTML = '';

        const visibleProducts = state.filteredProducts.slice(0, state.visibleCount);

        if (visibleProducts.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                    <h3>No new arrivals found.</h3>
                    <p style="color:#666;">Try adjusting your filters.</p>
                </div>
            `;
            return;
        }

        visibleProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card'; // Changed from 'na-product-card' to match shop style

            const badgeHtml = product.badge ? `<div class="product-badge" style="position: absolute; top: 10px; left: 10px; background: var(--primary-color); color: #fff; padding: 6px 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${product.badge}</div>` : '';

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${badgeHtml}
                    <div class="quick-view-icon" title="Quick View"><i class="fas fa-eye"></i></div>
                    <div class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    function updateActiveFiltersUI() {
        activeFiltersContainer.innerHTML = '';

        if (state.filters.category !== 'All') createChip(state.filters.category, 'category');
        if (state.filters.price !== 'all') {
            let label = state.filters.price.replace('-', ' ').replace('plus', '+');
            createChip(`Price: ${label}`, 'price');
        }
        if (state.filters.color) createChip(`Color: ${state.filters.color}`, 'color');
    }

    function createChip(label, type) {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';
        chip.innerHTML = `${label} <i class="fas fa-times"></i>`;
        chip.onclick = () => clearFilter(type);
        activeFiltersContainer.appendChild(chip);
    }

    function clearFilter(type) {
        if (type === 'category') {
            state.filters.category = 'All';
            // Update radio UI
            document.querySelector('input[name="category"][value="All"]').checked = true;
        } else if (type === 'price') {
            state.filters.price = 'all';
            document.querySelector('input[name="price"][value="all"]').checked = true;
        } else if (type === 'color') {
            state.filters.color = null;
            colorSwatches.forEach(s => s.classList.remove('selected'));
        }
        applyFiltersAndSort();
    }

    function checkLoadMoreVisibility() {
        if (!loadMoreBtn) return;
        if (state.filteredProducts.length > state.visibleCount) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
});

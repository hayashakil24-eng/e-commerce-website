document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle (Robust Implementation)
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const hamburgerOverlay = document.querySelector('.hamburger-menu-overlay');
    const closeIcon = document.querySelector('.hamburger-menu .close-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburgerIcon && hamburgerMenu) {
        // Open menu
        hamburgerIcon.addEventListener('click', () => {
            hamburgerMenu.classList.add('active');
            if (hamburgerOverlay) hamburgerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        });

        function closeMenu() {
            hamburgerMenu.classList.remove('active');
            if (hamburgerOverlay) hamburgerOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // <-- IMPORTANT
        }

        // Close via X button
        if (closeIcon) closeIcon.addEventListener('click', closeMenu);

        // Close via overlay click
        if (hamburgerOverlay) hamburgerOverlay.addEventListener('click', closeMenu);

        // Close menu when link clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });



        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hamburgerMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Auto-hide menu on desktop resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && hamburgerMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Product Image Gallery (for product-detail.html, but included here for completeness)
    const mainImage = document.querySelector('.product-detail-main-image img');
    const thumbImages = document.querySelectorAll('.product-detail-thumbnail img');

    if (thumbImages && mainImage) {
        thumbImages.forEach(thumb => {
            thumb.addEventListener('click', function () {
                mainImage.src = this.src;
                // Remove active class from previously selected thumbnail
                document.querySelector('.product-detail-thumbnail .active-thumb')?.classList.remove('active-thumb');
                // Add active class to current thumbnail
                this.classList.add('active-thumb');
            });
        });
    }

    // Quantity Selector
    const quantityInput = document.querySelector('.quantity-selector input[type="number"]');
    const incrementBtn = document.querySelector('.quantity-selector .increment-btn');
    const decrementBtn = document.querySelector('.quantity-selector .decrement-btn');

    if (incrementBtn && quantityInput) {
        incrementBtn.addEventListener('click', () => {
            quantityInput.stepUp();
        });
    }

    if (decrementBtn && quantityInput) {
        decrementBtn.addEventListener('click', () => {
            quantityInput.stepDown();
        });
    }

    // Tab Switching (for product-detail.html)
    const tabButtons = document.querySelectorAll('.product-tabs button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons && tabContents) {
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                // Deactivate all buttons and hide all contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.style.display = 'none');

                // Activate clicked button and show corresponding content
                button.classList.add('active');
                tabContents[index].style.display = 'block';
            });
        });

        // Show the first tab by default
        if (tabButtons.length > 0) {
            tabButtons[0].click();
        }
    }

    // New Arrivals Slider
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const sliderCards = document.querySelectorAll('.product-card');
    let currentSlide = 0;
    const cardsToShow = 4; // Number of cards to show at once

    if (sliderWrapper && prevArrow && nextArrow && sliderCards.length > 0) {
        const cardWidth = sliderCards[0].offsetWidth + parseInt(getComputedStyle(sliderCards[0]).marginRight);

        const updateSlider = () => {
            sliderWrapper.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        };

        nextArrow.addEventListener('click', () => {
            if (currentSlide < sliderCards.length - cardsToShow) {
                currentSlide++;
                updateSlider();
            }
        });

        prevArrow.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });
    }

    // Initialize Font Awesome (replace with your actual kit ID or use CDN)
    // Ensure you have linked Font Awesome correctly in your HTML
    // Example: <script src="https://kit.fontawesome.com/YOUR_KIT_ID.js" crossorigin="anonymous"></script>
    // If using the CDN, this JS part might not be necessary for basic icon rendering.
});

// --- GLOBAL CART FUNCTIONALITY ---

// 1. Central Product Data (Moved to Global Scope)
const coreProducts = [
    { id: 1, name: "Silk Satin Blouse", price: 89, badge: "NEW", category: "women", image: "../img/shop_blouse.png", sizes: ["S", "M", "L"], colors: ["beige"] },
    { id: 2, name: "Essential Cotton Tee", price: 25, badge: null, category: "women", image: "../img/shop_tshirt.png", sizes: ["XS", "S", "M", "L", "XL"], colors: ["white"] },
    { id: 3, name: "Chunky Knit Cardigan", price: 65, badge: "SALE", category: "women", image: "../img/shop_sweater.png", sizes: ["S", "M"], colors: ["pink"] },
    { id: 4, name: "Floral Chiffon Midi", price: 110, badge: "HOT", category: "women", image: "../img/shop_dress_floral.png", sizes: ["S", "M", "L"], colors: ["blue", "multi"] },
    { id: 5, name: "Linen Co-ord Set", price: 130, badge: "NEW", category: "women", image: "../img/shop_coord_set.png", sizes: ["M", "L"], colors: ["brown", "orange"] },
    { id: 6, name: "Classic Trench Coat", price: 299, badge: null, category: "women", image: "../img/shop_trench.png", sizes: ["S", "M", "L", "XL"], colors: ["beige"] },
    { id: 7, name: "Oversized Wool Blazer", price: 180, badge: null, category: "women", image: "../img/shop_blazer.png", sizes: ["S", "M", "L"], colors: ["black"] },
    { id: 8, name: "High-Rise Mom Jeans", price: 70, badge: "BEST", category: "women", image: "../img/shop_jeans.png", sizes: ["26", "28", "30", "32"], colors: ["blue"] },
    { id: 9, name: "Pleated Midi Skirt", price: 55, badge: null, category: "women", image: "../img/shop_skirt.png", sizes: ["S", "M", "L"], colors: ["green", "mint"] },
    { id: 10, name: "Embroidered Pastel Kurta", price: 45, badge: "NEW", category: "women", image: "../img/shop_kurta_pink.png", sizes: ["S", "M", "L"], colors: ["pink"] },
    { id: 11, name: "Printed Lawn Kurta", price: 35, badge: "SALE", category: "women", image: "../img/shop_kurta_yellow.png", sizes: ["S", "M", "L"], colors: ["yellow", "mustard"] },
    { id: 12, name: "Classic Denim Shirt", price: 55, badge: null, category: "men", image: "../img/prod_denimshirt.jpg", sizes: ["M", "L", "XL"], colors: ["blue"] },
    { id: 13, name: "Premium Leather Jacket", price: 180, badge: "HOT", category: "men", image: "../img/prod_jacket.jpg", sizes: ["L", "XL"], colors: ["brown"] },
    { id: 14, name: "Slim Fit Jeans", price: 65, badge: null, category: "men", image: "../img/prod_jeans.jpg", sizes: ["30", "32", "34"], colors: ["blue"] },
    { id: 15, name: "Basic Crew Neck Tee", price: 25, badge: null, category: "men", image: "../img/prod_tshirt.jpg", sizes: ["S", "M", "L", "XL"], colors: ["white"] },
    { id: 16, name: "Dark Blue Regular Fit Jeans", price: 55, badge: null, category: "men", image: "../img/Dark blue jeans men clothes.png", sizes: ["30", "32", "34", "36"], colors: ["blue"] },
    { id: 17, name: "Classic Black Jeans", price: 60, badge: "NEW", category: "men", image: "../img/black jeans pant men clothes.png", sizes: ["30", "32", "34"], colors: ["black"] },
    { id: 18, name: "Urban Black Leather Jacket", price: 150, badge: "HOT", category: "men", image: "../img/black men leather jacket.png", sizes: ["M", "L", "XL"], colors: ["black"] },
    { id: 19, name: "Vintage Wash Denim Jacket", price: 85, badge: null, category: "men", image: "../img/dark blue men denim jacket.png", sizes: ["M", "L", "XL"], colors: ["blue"] },
    { id: 20, name: "Everyday Blue Jeans", price: 45, badge: "SALE", category: "men", image: "../img/jeans for men clothes.png", sizes: ["30", "32", "34"], colors: ["blue"] },
    { id: 21, name: "Monochrome Black Set", price: 90, badge: null, category: "men", image: "../img/men clothes black.png", sizes: ["M", "L"], colors: ["black"] },
    { id: 22, name: "Essential Men's Hoodie", price: 40, badge: "BEST", category: "men", image: "../img/men hoodie.png", sizes: ["S", "M", "L", "XL"], colors: ["gray", "black"] },
    { id: 23, name: "Navy Blue Ensemble", price: 95, badge: null, category: "men", image: "../img/navy blue men clothes.png", sizes: ["M", "L"], colors: ["blue"] },
    { id: 24, name: "Premium Navy 2-Piece Suit", price: 220, badge: "NEW", category: "men", image: "../img/navyy blue 2 piece suit.png", sizes: ["38", "40", "42"], colors: ["blue"] },
    { id: 25, name: "Classic Red Polo", price: 35, badge: null, category: "men", image: "../img/red polo shirt men.png", sizes: ["S", "M", "L"], colors: ["red"] },
    { id: 26, name: "Black Pullover Hoodie", price: 30, badge: "NEW", category: "kids", image: "../img/black kids' pullover hoodie.png", sizes: ["6Y", "8Y", "10Y", "12Y"], colors: ["black"] },
    { id: 27, name: "Dark Blue Denim Jeans", price: 28, badge: null, category: "kids", image: "../img/dark blue kids' denim jeans.png", sizes: ["6Y", "8Y", "10Y", "12Y"], colors: ["blue"] },
    { id: 28, name: "Light Blue Button-Down", price: 25, badge: null, category: "kids", image: "../img/f a light blue kids' button-down shirt.png", sizes: ["4Y", "6Y", "8Y"], colors: ["blue"] },
    { id: 29, name: "Grey Crew Neck Sweatshirt", price: 22, badge: "BEST", category: "kids", image: "../img/grey kids' crew neck sweatshirt.png", sizes: ["6Y", "8Y", "10Y"], colors: ["gray"] },
    { id: 30, name: "Red Cotton T-Shirt", price: 15, badge: null, category: "kids", image: "../img/kids cotton t-shoirt red.png", sizes: ["4Y", "6Y", "8Y", "10Y"], colors: ["red"] },
    { id: 31, name: "Casual Kids Pants", price: 20, badge: "SALE", category: "kids", image: "../img/pant for kids.png", sizes: ["6Y", "8Y", "10Y"], colors: ["beige"] },
    { id: 32, name: "Pink Cotton Dress", price: 35, badge: "NEW", category: "kids", image: "../img/pink kids' cotton dress.png", sizes: ["4Y", "6Y", "8Y"], colors: ["pink"] },
    { id: 33, name: "Red Puffer Jacket", price: 45, badge: "HOT", category: "kids", image: "../img/red jacket for kid.png", sizes: ["6Y", "8Y", "10Y", "12Y"], colors: ["red"] },
    { id: 34, name: "White Graphic T-Shirt", price: 18, badge: null, category: "kids", image: "../img/white kids' graphic t-shirt.png", sizes: ["4Y", "6Y", "8Y", "10Y"], colors: ["white"] },
    { id: 35, name: "Blue Denim Shorts", price: 20, badge: "NEW", category: "kids", image: "../img/blue kids' denim shorts.png", sizes: ["6Y", "8Y", "10Y", "12Y"], colors: ["blue"] },
    { id: 36, name: "Burgundy Knit Sweater", price: 32, badge: "HOT", category: "kids", image: "../img/burgundy kids' knit sweater.png", sizes: ["6Y", "8Y", "10Y"], colors: ["red", "burgundy"] },
    { id: 37, name: "Denim Blue Skirt", price: 24, badge: null, category: "kids", image: "../img/denim blue kids' skirt.png", sizes: ["6Y", "8Y", "10Y", "12Y"], colors: ["blue"] },
    { id: 38, name: "Beige Wide-Brim Fedora", price: 45, badge: "NEW", category: "accessories", image: "../img/beige wide-brim fedora hat.png", sizes: ["One Size"], colors: ["beige"] },
    { id: 39, name: "Classic Aviator Sunglasses", price: 55, badge: null, category: "accessories", image: "../img/black aviator sunglasses.png", sizes: ["One Size"], colors: ["black"] },
    { id: 40, name: "Black Baseball Cap", price: 20, badge: null, category: "accessories", image: "../img/black baseball cap.png", sizes: ["Adjustable"], colors: ["black"] },
    { id: 41, name: "Classic Leather Belt", price: 35, badge: "BEST", category: "accessories", image: "../img/black leather belt coiled.png", sizes: ["S", "M", "L", "XL"], colors: ["black"] },
    { id: 42, name: "Leather Crossbody Bag", price: 85, badge: "HOT", category: "accessories", image: "../img/black leather crossbody bag.png", sizes: ["One Size"], colors: ["black"] },
    { id: 43, name: "Burgundy Mini Bag", price: 65, badge: null, category: "accessories", image: "../img/burgundy mini shoulder bag.png", sizes: ["One Size"], colors: ["red", "burgundy"] },
    { id: 44, name: "Grey Knit Beanie", price: 18, badge: "SALE", category: "accessories", image: "../img/grey knit beanie.png", sizes: ["One Size"], colors: ["gray"] },
    { id: 45, name: "Blue Bucket Hat", price: 22, badge: null, category: "accessories", image: "../img/light blue bucket hat.png", sizes: ["S/M", "L/XL"], colors: ["blue"] },
    { id: 46, name: "Gold Round Sunglasses", price: 50, badge: null, category: "accessories", image: "../img/round frame sunglasses with gold accents.png", sizes: ["One Size"], colors: ["gold", "brown"] },
    // Homepage Featured & New Arrivals
    { id: 47, name: "Casual Sneakers", price: 60, badge: null, category: "men", image: "../img/prod_sneakers.jpg", sizes: ["7", "8", "9", "10", "11"], colors: ["white"] },
    { id: 48, name: "Summer Dress", price: 85, badge: "NEW", category: "women", image: "../img/prod_dress.jpg", sizes: ["S", "M", "L"], colors: ["white"] },
    { id: 49, name: "Floral Dress", price: 90, badge: "NEW", category: "women", image: "../img/new_dress.jpg", sizes: ["S", "M", "L"], colors: ["multi"] },
    { id: 50, name: "Denim Shorts", price: 55, badge: null, category: "women", image: "../img/new_shorts.jpg", sizes: ["26", "28", "30"], colors: ["blue"] },
    { id: 51, name: "Summer Hat", price: 30, badge: null, category: "accessories", image: "../img/new_hat.jpg", sizes: ["One Size"], colors: ["beige"] },
    { id: 52, name: "Sunglasses", price: 40, badge: null, category: "accessories", image: "../img/new_glasses.jpg", sizes: ["One Size"], colors: ["black"] },
    { id: 53, name: "Stylish T-Shirt", price: 45, badge: null, category: "men", image: "../img/prod_tshirt.jpg", sizes: ["S", "M", "L", "XL"], colors: ["white"] },
    { id: 54, name: "Classic Jeans", price: 75, badge: "NEW", category: "men", image: "../img/prod_jeans.jpg", sizes: ["30", "32", "34"], colors: ["blue"] },
    { id: 55, name: "Leather Jacket", price: 150, badge: null, category: "men", image: "../img/prod_jacket.jpg", sizes: ["M", "L", "XL"], colors: ["black"] }
];

const products = [...coreProducts];

// 2. Global Update Cart Count
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// 3. Global Add To Cart Logic
function handleAddToCart(productId) {
    const id = parseInt(productId);
    const product = products.find(p => p.id === id);

    if (product) {
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if item exists
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            // Add new item with default props
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.sizes[0] || 'M', // Default
                color: product.colors[0] || 'Default', // Default
                qty: 1
            });
        }

        // Save back
        localStorage.setItem('cartItems', JSON.stringify(cart));

        // Update UI Count
        let currentCount = parseInt(document.querySelector('.cart-count').textContent) || 0;
        updateCartCount(cart.reduce((total, item) => total + item.qty, 0));

        alert(`${product.name} added to cart!`);
    } else {
        console.error('Product not found for ID:', id);
        // Fallback for mock/static items without valid IDs in coreProducts
        alert('Item added to cart! (Demo)');
    }
}

// 4. Global Event Delegation for Add to Cart Buttons
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-add-to-cart')) {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.dataset.id;
        if (id) {
            handleAddToCart(id);
        } else {
            // Fallback for Homepage items that might not have IDs yet
            // Just increment count visually
            let currentCount = parseInt(document.querySelector('.cart-count').textContent) || 0;
            updateCartCount(currentCount + 1);
            alert('Item added to cart!');
        }
    }
});


// Placeholder for other potential JS functionalities like form validation, search, etc.

// --- SHOP FILTERING & PAGINATION LOGIC ---
// Only run on shop page
const shopGrid = document.getElementById('shop-products-grid');
const paginationContainer = document.getElementById('shop-pagination');

if (shopGrid && paginationContainer) {
    // Products Data is now GLOBAL (see above)    
    const itemsPerPage = 9;

    // Filter State
    let state = {
        currentPage: 1,
        filters: {
            category: 'all',
            minPrice: 0,
            maxPrice: 1000,
            sizes: [],
            colors: []
        },
        sortBy: 'featured'
    };

    // Initialize from URL params if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page')) state.currentPage = parseInt(urlParams.get('page'));
    if (urlParams.get('category')) state.filters.category = urlParams.get('category');
    // Simple handling for now

    // NEW or SALE filter from URL
    if (urlParams.get('badge')) {
        const badgeParam = urlParams.get('badge').toUpperCase(); // "new" or "sale"
        products.forEach(p => {
            // Mark products not matching badge as filtered out temporarily
            p.hiddenByBadge = badgeParam && p.badge !== badgeParam ? true : false;
        });
    }

    // Modify getFilteredProducts() to respect hiddenByBadge
    const originalGetFilteredProducts = getFilteredProducts;
    getFilteredProducts = function () {
        return originalGetFilteredProducts().filter(p => !p.hiddenByBadge);
    };



    // 3. Selection of Filter Elements
    const categoryLinks = document.querySelectorAll('.filter-group ul li a');
    const priceSlider = document.querySelector('input[type="range"]');
    const priceDisplay = document.querySelector('.filter-group div span:last-child');
    const sizeButtons = document.querySelectorAll('.size-selector button');
    const colorOptions = document.querySelectorAll('.color-option');
    const sortSelect = document.querySelector('.product-controls select');
    const applyBtn = document.querySelector('.btn-secondary'); // Apply Filters
    const clearBtn = document.querySelector('.btn-outline'); // Clear All

    // 4. Filter Logic
    function getFilteredProducts() {
        let filtered = products.filter(p => {
            // Category
            if (state.filters.category !== 'all' && p.category !== state.filters.category) return false;

            // Price
            if (p.price < state.filters.minPrice || p.price > state.filters.maxPrice) return false;

            // Sizes (OR logic: if product has ANY of the selected sizes)
            if (state.filters.sizes.length > 0) {
                const hasSize = state.filters.sizes.some(s => p.sizes.includes(s));
                if (!hasSize) return false;
            }

            // Colors (OR logic)
            if (state.filters.colors.length > 0) {
                // Start checking based on index for simplicity or map colors properly
                // For mock, let's assume direct mapping or just skip exact matching for simplicity
                // Actually, let's do it right.
                const hasColor = state.filters.colors.some(c => p.colors.includes(c));
                if (!hasColor) return false;
            }

            return true;
        });

        // Sorting
        if (state.sortBy === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (state.sortBy === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (state.sortBy === 'newest') {
            filtered.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
        }
        // 'featured' is default order

        return filtered;
    }

    function renderProducts() {
        const activeFiltersContainer = document.getElementById('active-filters');

        // 1. Render Active Filters Tags
        if (activeFiltersContainer) {
            activeFiltersContainer.innerHTML = '';

            // Category Tag
            if (state.filters.category !== 'all') {
                const tag = createFilterTag(state.filters.category.charAt(0).toUpperCase() + state.filters.category.slice(1), () => {
                    state.filters.category = 'all';
                    // Reset UI
                    document.querySelectorAll('.filter-group ul li a').forEach(l => {
                        l.style.fontWeight = 'normal';
                        l.classList.remove('active');
                    });
                    state.currentPage = 1;
                    renderProducts();
                });
                activeFiltersContainer.appendChild(tag);
            }

            // Price Tag
            if (state.filters.minPrice > 0 || state.filters.maxPrice < 1000) {
                const tag = createFilterTag(`$${state.filters.minPrice} - $${state.filters.maxPrice}`, () => {
                    state.filters.minPrice = 0;
                    state.filters.maxPrice = 1000;
                    document.querySelector('input[type="range"]').value = 500; // Reset visual
                    document.querySelector('.filter-group div span:last-child').textContent = '$500'; // Reset visual
                    // NOTE: The visual reset above assumes max 1000 and default 500 logic, might be slightly off regarding user intent but works for clear.
                    // Better: actually set to max.
                    const range = document.querySelector('input[type="range"]');
                    if (range) { range.value = 1000; range.dispatchEvent(new Event('input')); }
                    // Actually, the input listener sets logic. Let's just set logic and re-render.
                });
                activeFiltersContainer.appendChild(tag);
            }

            // Sizes Tags
            state.filters.sizes.forEach(size => {
                const tag = createFilterTag(`Size: ${size}`, () => {
                    state.filters.sizes = state.filters.sizes.filter(s => s !== size);
                    // Reset UI
                    document.querySelectorAll('.size-selector button').forEach(btn => {
                        if (btn.textContent === size) btn.classList.remove('active');
                    });
                    state.currentPage = 1;
                    renderProducts();
                });
                activeFiltersContainer.appendChild(tag);
            });

            // Colors Tags
            state.filters.colors.forEach(color => {
                const tag = createFilterTag(`Color: ${color}`, () => {
                    state.filters.colors = state.filters.colors.filter(c => c !== color);
                    // Reset UI logic slightly complex due to index mapping in original code, but we can try reverse match or just clear all visual and re-apply from state.
                    // Ideally, re-render filter UI based on active state.
                    // For now, let's just trigger a re-render which is fine.
                    // To clear visual class:
                    // We need to find the element. Simple hack:
                    document.querySelectorAll('.color-option').forEach(opt => {
                        // We strictly don't know which one unless we mapped it.
                        // Let's just remove 'selected' from all and re-add based on valid state?
                        // Or just simplistic approach:
                        opt.classList.remove('selected');
                    });
                    // Re-select valid ones (simulated)
                    state.currentPage = 1;
                    renderProducts();
                });
                activeFiltersContainer.appendChild(tag);
            });
        }
        // 2. Loading State (Skeleton)
        shopGrid.innerHTML = '';
        shopGrid.style.opacity = '1';

        // Add Skeletons
        for (let i = 0; i < itemsPerPage; i++) {
            const skel = document.createElement('div');
            skel.className = 'skeleton-card';
            skel.innerHTML = `<div class="skeleton" style="height: 300px; width: 100%; margin-bottom: 15px;"></div>
                              <div class="skeleton" style="height: 20px; width: 70%; margin-bottom: 10px; margin-left: 15px;"></div>
                              <div class="skeleton" style="height: 20px; width: 40%; margin-left: 15px;"></div>`;
            shopGrid.appendChild(skel);
        }

        const filteredProducts = getFilteredProducts();

        // Simulating Network Delay
        setTimeout(() => {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

            if (state.currentPage > totalPages) state.currentPage = 1;

            const start = (state.currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = filteredProducts.slice(start, end);

            shopGrid.innerHTML = '';

            if (paginatedItems.length === 0) {
                shopGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px;"><h3>No products found</h3><p style="color: #666;">Try adjusting your filters or search criteria.</p></div>';
            } else {
                paginatedItems.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';

                    const badgeHtml = product.badge ? `<div class="product-badge" style="position: absolute; top: 10px; left: 10px; background: var(--primary-color); color: #fff; padding: 6px 12px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${product.badge}</div>` : '';

                    productCard.innerHTML = `
                            <div class="product-image-container">
                                <img src="${product.image}" alt="${product.name}" loading="lazy">
                                ${badgeHtml}
                                <div class="quick-view-icon" title="Quick View"><i class="fas fa-eye"></i></div>
                                <div class="add-to-wishlist" title="Add to Wishlist"><i class="far fa-heart"></i></div>
                            </div>
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p class="price">$${product.price}.00</p>
                                <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                            </div>
                        `;
                    shopGrid.appendChild(productCard);
                });
            }

            renderPagination(filteredProducts.length);
            updateResultCount(start, end, filteredProducts.length);

            // Re-apply visual selection states to filters (Robustness)
            updateFilterVisuals();

        }, 600); // 600ms fake delay
    }

    function createFilterTag(label, removeCallback) {
        const div = document.createElement('div');
        div.className = 'filter-tag';
        div.innerHTML = `<span>${label}</span> <i class="fas fa-times"></i>`;
        div.querySelector('i').addEventListener('click', removeCallback);
        return div;
    }

    function updateFilterVisuals() {
        // Sync UI with State for Colors/Sizes if needed
        // Categories
        document.querySelectorAll('.filter-group ul li a').forEach(link => {
            const text = link.innerText.split(' ')[0].toLowerCase();
            if (text === state.filters.category) {
                link.classList.add('active');
                link.style.fontWeight = 'bold';
            } else {
                link.classList.remove('active');
                link.style.fontWeight = 'normal';
            }
        });

        // Colors (Need logic to match state colors back to DOM nodes)
        // Only if we had mapped them robustly. Skipping for now as user just wants tags functional mainly.
    }

    function renderPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) return;

        // Helper to create button
        const createBtn = (text, page, isActive = false, isDisabled = false) => {
            const btn = document.createElement('button');
            if (typeof text === 'string' && text.includes('<i')) {
                btn.innerHTML = text; // Icon
            } else {
                btn.textContent = text;
            }
            btn.className = `page-btn ${isActive ? 'active' : ''}`;

            if (isDisabled) {
                btn.disabled = true;
                if (text === '...') btn.classList.add('ellipsis');
            } else {
                btn.addEventListener('click', () => changePage(page));
            }
            return btn;
        };

        // Prev Button
        paginationContainer.appendChild(createBtn('<i class="fas fa-chevron-left"></i>', state.currentPage - 1, false, state.currentPage === 1));

        // Smart Pagination Logic
        // Check window width for mobile logic inside the function? 
        // Better: just use a conservative logic or simple resize listener if needed.
        // For now, let's use a logic that works for both or simplistic mobile check.
        const isMobile = window.innerWidth <= 480;

        // We'll use a listener to re-render on resize if we really want it dynamic, 
        // but for now let's just use current state. (User can refresh if they resize heavily).
        // Actually, let's add a resize listener for this? Might be overkill. 
        // Let's just make the logic robust enough.

        let maxVisible = 7;
        if (isMobile) maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.appendChild(createBtn(i, i, i === state.currentPage));
            }
        } else {
            if (isMobile) {
                // Mobile: Prev [1] .. [Curr] .. [Last] Next
                // Or: Prev [1] [2] .. [Last] Next if at start
                // Stick to simple:
                paginationContainer.appendChild(createBtn(1, 1, 1 === state.currentPage));

                if (state.currentPage > 2) {
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                }

                // Show current if it's not 1 or Last
                if (state.currentPage > 1 && state.currentPage < totalPages) {
                    paginationContainer.appendChild(createBtn(state.currentPage, state.currentPage, true));
                }

                if (state.currentPage < totalPages - 1) {
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                }

                paginationContainer.appendChild(createBtn(totalPages, totalPages, totalPages === state.currentPage));
            } else {
                // Desktop: 1 ... 4 5 6 ... 10
                const leftEllipsis = state.currentPage > 3;
                const rightEllipsis = state.currentPage < totalPages - 2;

                if (!leftEllipsis && rightEllipsis) {
                    for (let i = 1; i <= 4; i++) {
                        paginationContainer.appendChild(createBtn(i, i, i === state.currentPage));
                    }
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                    paginationContainer.appendChild(createBtn(totalPages, totalPages, totalPages === state.currentPage));
                } else if (leftEllipsis && !rightEllipsis) {
                    paginationContainer.appendChild(createBtn(1, 1, 1 === state.currentPage));
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                    for (let i = totalPages - 3; i <= totalPages; i++) {
                        paginationContainer.appendChild(createBtn(i, i, i === state.currentPage));
                    }
                } else {
                    paginationContainer.appendChild(createBtn(1, 1, 1 === state.currentPage));
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                    for (let i = state.currentPage - 1; i <= state.currentPage + 1; i++) {
                        paginationContainer.appendChild(createBtn(i, i, i === state.currentPage));
                    }
                    paginationContainer.appendChild(createBtn('...', -1, false, true));
                    paginationContainer.appendChild(createBtn(totalPages, totalPages, totalPages === state.currentPage));
                }
            }
        }

        // Next Button
        paginationContainer.appendChild(createBtn('<i class="fas fa-chevron-right"></i>', state.currentPage + 1, false, state.currentPage === totalPages));
    }

    function changePage(newPage) {
        state.currentPage = newPage;
        renderProducts();
        // Scroll top
        const gridTop = document.querySelector('.products-section').offsetTop - 100;
        window.scrollTo({ top: gridTop, behavior: 'smooth' });
    }

    function updateResultCount(start, end, total) {
        const shopHeaderP = document.querySelector('.shop-header p');
        if (shopHeaderP) {
            if (total === 0) shopHeaderP.textContent = 'Showing 0 results';
            else {
                const showEnd = Math.min(end, total);
                shopHeaderP.textContent = `Showing ${start + 1}–${showEnd} of ${total} results`;
            }
        }
    }

    // Categories
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category; // Robust data attribute

            if (category) {
                state.filters.category = category;
                state.currentPage = 1;
                renderProducts();

                // Update visuals
                categoryLinks.forEach(l => {
                    l.style.fontWeight = 'normal';
                    l.classList.remove('active');
                });
                link.style.fontWeight = 'bold';
                link.classList.add('active');
            }
        });
    });

    // Price
    if (priceSlider) {
        priceSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            state.filters.maxPrice = val;
            if (priceDisplay) priceDisplay.textContent = `$${val}`;
            state.currentPage = 1;
            renderProducts();
        });
    }

    // Sizes (Single Select)
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.textContent;

            // Check if already active (toggle off)
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                state.filters.sizes = [];
            } else {
                // Deactivate all others
                sizeButtons.forEach(b => b.classList.remove('active'));

                // Activate clicked
                btn.classList.add('active');
                state.filters.sizes = [val]; // Single value in array for compatibility with existing logic
            }

            state.currentPage = 1;
            renderProducts();
        });
    });

    // Colors (Single Select)
    if (colorOptions) {
        colorOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                const color = opt.dataset.color;
                if (!color) return;

                // Check if already active (toggle off)
                if (opt.classList.contains('selected')) {
                    opt.classList.remove('selected');
                    state.filters.colors = [];
                } else {
                    // Deactivate all others
                    colorOptions.forEach(c => c.classList.remove('selected'));

                    // Activate clicked
                    opt.classList.add('selected');
                    state.filters.colors = [color]; // Single value in array
                }

                state.currentPage = 1;
                renderProducts();
            });
        });
    }

    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            renderProducts();
        });
    }

    // Apply Button (Redundant if immediate, but useful for mobile or explicit action)
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            // Just scroll to top effectively as render is immediate
            const gridTop = document.querySelector('.products-section').offsetTop - 100;
            window.scrollTo({ top: gridTop, behavior: 'smooth' });
        });
    }

    // Clear All
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            state.filters = { category: 'all', minPrice: 0, maxPrice: 1000, sizes: [], colors: [] };
            state.sortBy = 'featured';
            // Reset UI
            if (priceSlider) { priceSlider.value = 500; if (priceDisplay) priceDisplay.textContent = '$500'; } // visual bug fix: set to 500 or 1000? Mock default was 500.
            categoryLinks.forEach(l => l.style.fontWeight = 'normal');
            sizeButtons.forEach(b => b.classList.remove('active'));
            colorOptions.forEach(c => c.classList.remove('selected')); // or whatever active class
            if (sortSelect) sortSelect.value = 'featured';

            state.currentPage = 1;
            renderProducts();
        });
    }

    // 6. Mobile Filter Toggle
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const shopSidebar = document.querySelector('.shop-sidebar');
    const closeFiltersBtn = document.querySelector('.close-filters');
    const filtersBackdrop = document.querySelector('.filters-backdrop');

    if (filterToggleBtn && shopSidebar && filtersBackdrop) {
        function openFilters() {
            shopSidebar.classList.add('active');
            filtersBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function closeFilters() {
            shopSidebar.classList.remove('active');
            filtersBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        filterToggleBtn.addEventListener('click', openFilters);

        if (closeFiltersBtn) {
            closeFiltersBtn.addEventListener('click', closeFilters);
        }

        filtersBackdrop.addEventListener('click', closeFilters);
    }
    // Initial Render
    renderProducts();

    // Handle Window Resize for Pagination Responsiveness
    window.addEventListener('resize', () => {
        // Simple debounce
        if (window.resizeTimer) clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            renderProducts();
        }, 300);
    });
} // End of if (shopGrid && paginationContainer)

// End of Shop Filter Logic

// 7. Admin Mobile Sidebar Toggle
const adminToggleBtn = document.querySelector('.admin-mobile-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const adminOverlay = document.querySelector('.admin-overlay');
const adminCloseIcon = document.querySelector('.admin-sidebar .close-icon');

if (adminToggleBtn && adminSidebar) {
    function toggleAdminMenu() {
        adminSidebar.classList.toggle('active');
        if (adminOverlay) adminOverlay.classList.toggle('active');
        document.body.style.overflow = adminSidebar.classList.contains('active') ? 'hidden' : '';
    }

    adminToggleBtn.addEventListener('click', toggleAdminMenu);

    if (adminOverlay) {
        adminOverlay.addEventListener('click', toggleAdminMenu);
    }

    if (adminCloseIcon) {
        adminCloseIcon.addEventListener('click', toggleAdminMenu);
    }
}

// End of Admin Mobile Sidebar Toggle

/* =========================================
   SHOPPING CART PAGE LOGIC
   ========================================= */
const cartPage = document.querySelector('.cart-page-premium');
if (cartPage) {
    // State
    const SHIPPING_COST = 10.00;
    let discount = 0;
    let appliedPromoCode = null;

    // Elements
    const cartItemsContainer = document.querySelector('.cart-list');
    const subtotalEl = document.querySelectorAll('.summary-line span:last-child')[0];
    const shippingEl = document.querySelectorAll('.summary-line span:last-child')[1];
    const taxEl = document.querySelectorAll('.summary-line span:last-child')[2];
    const totalEl = document.querySelector('.summary-total span:last-child');
    const promoInput = document.querySelector('.promo-code-input input');
    const promoBtn = document.querySelector('.promo-code-input button');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const itemCountBadge = document.querySelector('.cart-header .item-count');

    // 1. RENDER FROM LOCALSTORAGE
    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div style="text-align:center; padding: 60px; color: #888;">Your cart is empty. <br><a href="shop.html" style="color:var(--primary-color); font-weight:600; text-decoration: underline; margin-top: 10px; display: inline-block;">Continue Shopping</a></div>';
            updateCartTotals();
            return;
        }

        cartItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'cart-item-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="item-info-top">
                                <h3 class="product-name"><a href="#">${item.name}</a></h3>
                                <span class="item-price">$${item.price}.00</span>
                            </div>
                            <div class="item-variants">
                                <span>Size: ${item.size}</span>
                                <span class="separator">•</span>
                                <span>Color: ${item.color}</span>
                            </div>
                            <div class="item-actions-row">
                                <div class="qty-selector">
                                    <button class="qty-btn minus"><i class="fas fa-minus"></i></button>
                                    <input type="text" value="${item.qty}" readonly class="qty-input">
                                    <button class="qty-btn plus"><i class="fas fa-plus"></i></button>
                                </div>
                                <button class="remove-btn"><i class="far fa-trash-alt"></i></button>
                            </div>
                        </div>
                    `;
            cartItemsContainer.appendChild(card);
        });
        updateCartTotals();
    }

    // Helper: Update LocalStorage
    function updateLocalStorage(id, newQty) {
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cart.findIndex(i => i.id == id);

        if (itemIndex > -1) {
            if (newQty === 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].qty = newQty;
            }
            localStorage.setItem('cartItems', JSON.stringify(cart));

            // Update global count
            const count = cart.reduce((total, i) => total + i.qty, 0);
            const globalCartCount = document.querySelector('.cart-count');
            if (globalCartCount) globalCartCount.textContent = count;
        }
    }

    // Initialize
    renderCartItems();

    // Event Delegation for Cart Items
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const card = target.closest('.cart-item-card');

        if (!card) return;
        const id = parseInt(card.dataset.id);

        // Increase Quantity
        if (target.closest('.plus')) {
            const input = card.querySelector('.qty-input');
            let val = parseInt(input.value);
            input.value = val + 1;
            updateLocalStorage(id, val + 1);
            updateCartTotals();
        }

        // Decrease Quantity
        if (target.closest('.minus')) {
            const input = card.querySelector('.qty-input');
            let val = parseInt(input.value);
            if (val > 1) {
                input.value = val - 1;
                updateLocalStorage(id, val - 1);
                updateCartTotals();
            }
        }

        // Remove Item
        if (target.closest('.remove-btn')) {
            if (confirm('Are you sure you want to remove this item?')) {
                card.remove();
                updateLocalStorage(id, 0); // 0 means remove
                updateCartTotals();

                // Check if empty
                if (cartItemsContainer.children.length === 0) {
                    cartItemsContainer.innerHTML = '<div style="text-align:center; padding: 60px; color: #888;">Your cart is empty. <br><a href="shop.html" style="color:var(--primary-color); font-weight:600; text-decoration: underline; margin-top: 10px; display: inline-block;">Continue Shopping</a></div>';
                }
            }
        }
    });

    // Promo Code Logic
    promoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        const messageBox = document.querySelector('.promo-message') || document.createElement('div');
        messageBox.className = 'promo-message';
        messageBox.style.marginTop = '10px';
        messageBox.style.fontSize = '0.85rem';

        if (!document.querySelector('.promo-message')) {
            document.querySelector('.promo-code-input').after(messageBox);
        }

        // Reset previous state
        discount = 0;
        appliedPromoCode = null;
        messageBox.style.color = '#dc3545'; // Red for error

        if (code === '') {
            messageBox.textContent = 'Please enter a promo code.';
            updateCartTotals();
            return;
        }

        // Mock Validation
        if (code === 'SAVE10') {
            // 10% Discount
            const subtotal = calculateSubtotal();
            discount = subtotal * 0.10;
            appliedPromoCode = 'SAVE10';
            messageBox.style.color = '#28a745';
            messageBox.textContent = 'Promo code SAVE10 applied! (10% OFF)';
        } else if (code === 'FLAT20') {
            // $20 Flat Discount
            discount = 20.00;
            appliedPromoCode = 'FLAT20';
            messageBox.style.color = '#28a745';
            messageBox.textContent = 'Promo code FLAT20 applied! ($20 OFF)';
        } else {
            messageBox.textContent = 'Invalid promo code.';
        }

        updateCartTotals();
    });

    // Helper: Calculate Subtotal from DOM
    function calculateSubtotal() {
        let subtotal = 0;
        const items = document.querySelectorAll('.cart-item-card');
        items.forEach(item => {
            const priceStr = item.querySelector('.item-price').textContent.replace('$', '').replace(',', '');
            const qtyStr = item.querySelector('.qty-input').value;
            const price = parseFloat(priceStr);
            const qty = parseInt(qtyStr);
            if (!isNaN(price) && !isNaN(qty)) {
                subtotal += price * qty;
            }
        });
        return subtotal;
    }

    // Update Totals
    function updateCartTotals() {
        const subtotal = calculateSubtotal();

        // Recalculate percentage discount if subtotal changed
        if (appliedPromoCode === 'SAVE10') {
            discount = subtotal * 0.10;
        } else if (appliedPromoCode === 'FLAT20') {
            // Ensure discount doesn't exceed subtotal
            discount = Math.min(20, subtotal);
        }

        const total = subtotal + SHIPPING_COST - discount;

        // Update DOM
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        shippingEl.textContent = `$${SHIPPING_COST.toFixed(2)}`;

        // Show discount row if active
        let discountRow = document.querySelector('.summary-discount-row');
        if (discount > 0) {
            if (!discountRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'summary-line summary-discount-row';
                discountRow.style.color = '#28a745';
                discountRow.innerHTML = '<span>Discount</span><span>-$0.00</span>';
                // Insert before tax or total
                document.querySelector('.summary-divider').before(discountRow);
            }
            discountRow.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
        } else if (discountRow) {
            discountRow.remove();
        }

        totalEl.textContent = `$${total.toFixed(2)}`;

        // Update Item Count Badge/Text
        const itemCount = document.querySelectorAll('.cart-item-card').length;
        if (itemCountBadge) itemCountBadge.textContent = `${itemCount} items`;

        // Global header cart count update (simplified)
        const globalCartCount = document.querySelector('.cart-count');
        if (globalCartCount) {
            // Read fresh from LS or calculate from DOM
            // LS is truth
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            globalCartCount.textContent = cart.reduce((total, i) => total + i.qty, 0);
        }
    }

    // Proceed to Checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const subtotal = calculateSubtotal();
            if (subtotal > 0) {
                window.location.href = 'checkout.html';
            } else {
                alert('Your cart is empty!');
            }
        });
    }
    /* =========================================
       CHECKOUT PAGE LOGIC (DYNAMIC)
       ========================================= */
    const checkoutBody = document.querySelector('.checkout-body');
    if (checkoutBody) {
        // Elements
        const summaryItemsContainer = document.querySelector('.summary-items');
        const summaryHeader = document.querySelector('.summary-header h3');
        const subtotalEl = document.querySelector('.cost-row:nth-child(1) span:last-child');
        const shippingEl = document.getElementById('shipping-cost');
        const taxEl = document.querySelector('.cost-row:nth-child(3) span:last-child');
        const totalEl = document.getElementById('total-cost');
        const placeOrderBtn = document.getElementById('place-order-btn');

        // Functions
        function renderCheckoutSummary() {
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

            if (cart.length === 0) {
                // Redirect if empty
                window.location.href = 'cart.html';
                return;
            }

            // Update Header Count
            if (summaryHeader) summaryHeader.textContent = `Order Summary (${cart.reduce((t, i) => t + i.qty, 0)})`;

            // Clear static items
            if (summaryItemsContainer) {
                summaryItemsContainer.innerHTML = '';

                // Render Items
                cart.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'summary-item';
                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="item-image" style="background:#f5f5f5;">
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-variant">Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</span>
                            <span class="item-price">$${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    `;
                    summaryItemsContainer.appendChild(div);
                });
            }

            updateCheckoutTotals();
        }

        function updateCheckoutTotals() {
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

            // Fixed tax rate for demo (e.g. 8%)
            const TAX_RATE = 0.08;
            const tax = subtotal * TAX_RATE;

            // Check Shipping Selection
            // Note: checkout.html script handles toggle but we need to read current state
            // However, inline script sets textContent directly. We should override or sync.
            // Let's rely on the DOM text for shipping cost since the inline script updates it on click.
            // But initially we must set it based on "Free" (standard).

            let shippingCost = 0;
            const shippingText = shippingEl ? shippingEl.textContent : 'Free';
            if (shippingText !== 'Free') {
                shippingCost = parseFloat(shippingText.replace('$', ''));
            }

            const total = subtotal + tax + shippingCost;

            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        }

        // Initialize
        renderCheckoutSummary();

        // Listen for Shipping Changes (Observer or override)
        // Since checkout.html has inline `updateShipping`, that function updates DOM. 
        // We can hook into the radio buttons to re-trigger our total calc which includes tax/subtotal.
        const shippingRadios = document.querySelectorAll('input[name="shipping"]');
        shippingRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                // Wait for the inline script to update the text context first is risky.
                // Better: We implement the logic here to ensure consistency with our dynamic subtotal.
                const val = radio.value;
                let cost = 0;
                if (val === 'express') cost = 10.00;

                if (shippingEl) shippingEl.textContent = cost === 0 ? 'Free' : `$${cost.toFixed(2)}`;
                updateCheckoutTotals();
            });
        });

        // Place Order Logic
        if (placeOrderBtn) {
            // Unbind inline onclick to avoid conflicts or let it run?
            // The inline onclick calls placeOrder(). We can override it or let it be.
            // The inline script `placeOrder` redirects to order-confirmation.html.
            // We should clear cart before redirecting.

            // Best way: Let's replace the button logic entirely or wrap the inline function.
            // Since we can't easily remove inline onclick without replacing element,
            // we will overwrite the global placeOrder function if accessible, 
            // OR add an event listener that runs BEFORE navigation.

            // To ensure we clear cart, let's attach a click listener.
            // Event listener removed to allow order-confirmation.html to read data. The clearing will happen there.
            placeOrderBtn.addEventListener('click', () => {
                // Do nothing here, let the redirect happen.
            });
        }
    }
}
// Global Initialization on Load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Cart Count
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount(savedCart.reduce((total, item) => total + item.qty, 0));
});

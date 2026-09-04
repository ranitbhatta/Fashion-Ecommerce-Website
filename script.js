const PRODUCTS = [
    {
        id:"navy",
        name:"Premium Navy Polo",
        category:"men",
        color:"Navy",
        price:1999,
        rating:"4.8",
        badge:"SIGNATURE",
        description:"A refined everyday polo in premium cotton with a clean silhouette and softly structured finish.",
        tags:["100% cotton","Modern fit","Easy care"],
        image:"images/navy-polo.png"
    },
    {
        id:"black",
        name:"Flawless Black",
        category:"women",
        color:"Black",
        price:1499,
        rating:"4.3",
        badge:"NEW",
        description:"A confident black essential with an effortless shape, designed for minimal everyday styling.",
        tags:["Soft touch","Relaxed","Versatile"],
        image:"images/black-womenswear.png"
    },
    {
        id:"white",
        name:"Immersive White",
        category:"men",
        color:"White",
        price:1899,
        rating:"4.2",
        badge:"ESSENTIAL",
        description:"A crisp white polo that balances clean proportions with a comfortable premium-cotton feel.",
        tags:["Premium cotton","Clean cut","Everyday"],
        image:"images/white-polo.png"
    },
    {
        id:"red",
        name:"Strong Red",
        category:"men",
        color:"Red",
        price:1799,
        rating:"4.6",
        badge:"TRENDING",
        description:"A bold red polo designed to add colour without compromising a refined silhouette.",
        tags:["Statement","Modern","Soft cotton"],
        image:"images/red-polo.png"
    },
    {
        id:"brown",
        name:"Women's Wear",
        category:"women",
        color:"Brown",
        price:2499,
        rating:"4.2",
        badge:"EDITOR'S PICK",
        description:"A graceful brown occasion-ready edit with rich tones and a polished, feminine finish.",
        tags:["Elegant","Occasion","Refined"],
        image:"images/brown-womenswear.png"
    },
    {
        id:"sage",
        name:"Sage Relaxed Shirt",
        category:"unisex",
        color:"Sage",
        price:2199,
        rating:"4.7",
        badge:"NEW",
        description:"A relaxed unisex shirt in a quiet sage tone for understated weekend dressing.",
        tags:["Relaxed fit","Unisex","Soft weave"],
        image:"images/men-lime-shirt.png"
    },
    {
        id:"stone",
        name:"Stone Everyday Tee",
        category:"unisex",
        color:"Stone",
        price:1299,
        rating:"4.5",
        badge:"ESSENTIAL",
        description:"An elevated everyday tee with a clean neckline and a neutral stone colourway.",
        tags:["Everyday","Minimal","Soft"],
        image:"images/women-charcoal-tee.png"
    },
    {
        id:"plum",
        name:"Plum Tailored Set",
        category:"women",
        color:"Plum",
        price:2899,
        rating:"4.9",
        badge:"LIMITED",
        description:"A considered statement set with a rich plum tone and modern tailored proportions.",
        tags:["Tailored","Premium","Statement"],
        image:"images/women-blue-floral.png"
    }
];

const state = {
    filter:"all",
    sort:"featured",
    cart: JSON.parse(localStorage.getItem("bangoprajukti-cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("bangoprajukti-wishlist") || "[]"),
    selectedProduct:null
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function money(value){
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, char => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));
}

function placeholderSvg(label, dark="#7b7878", light="#c7c3ad"){
    const safe = escapeHtml(label);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 850">
            <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${light}"/>
                    <stop offset="1" stop-color="${dark}"/>
                </linearGradient>
            </defs>
            <rect width="700" height="850" fill="url(#g)"/>
            <circle cx="350" cy="350" r="150" fill="rgba(255,255,255,.12)"/>
            <path d="M245 230h210l58 115-55 265H242l-55-265z" fill="rgba(20,20,20,.66)"/>
            <path d="M290 230h120v260H290z" fill="rgba(255,255,255,.08)"/>
            <text x="350" y="675" text-anchor="middle" fill="rgba(255,255,255,.78)" font-family="Arial,sans-serif" font-weight="800" font-size="26" letter-spacing="4">${safe}</text>
        </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function imageWithFallback(src, label){
    return src || placeholderSvg(label);
}

function save(){
    localStorage.setItem("bangoprajukti-cart", JSON.stringify(state.cart));
    localStorage.setItem("bangoprajukti-wishlist", JSON.stringify(state.wishlist));
    updateCounts();
}

function updateCounts(){
    $("#cartCount").textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
    $("#wishlistCount").textContent = state.wishlist.length;
}

function toast(message){
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => el.classList.remove("show"), 2200);
}

function sortedProducts(){
    let items = PRODUCTS.filter(product =>
        state.filter === "all" || product.category === state.filter
    );

    if(state.sort === "price-low") items = [...items].sort((a,b) => a.price - b.price);
    if(state.sort === "price-high") items = [...items].sort((a,b) => b.price - a.price);
    if(state.sort === "name") items = [...items].sort((a,b) => a.name.localeCompare(b.name));

    return items;
}

function productCard(product, index){
    const wished = state.wishlist.includes(product.id);

    return `
        <article class="product-card" style="animation-delay:${Math.min(index*45,220)}ms">
            <div class="product-image">
                <img src="${imageWithFallback(product.image, product.name.toUpperCase())}"
                     alt="${escapeHtml(product.name)}"
                     data-source="${escapeHtml(product.image || "")}">
                <span class="product-card-badge">${escapeHtml(product.badge)}</span>

                <div class="product-card-tools">
                    <button class="product-tool ${wished ? "active":""}"
                            data-action="wishlist"
                            data-id="${product.id}"
                            aria-label="${wished ? "Remove from wishlist" : "Add to wishlist"}">
                        ${wished ? "♥" : "♡"}
                    </button>
                    <button class="product-tool" data-action="quick" data-id="${product.id}" aria-label="Quick view">
                        ↗
                    </button>
                </div>
            </div>

            <div class="product-card-info">
                <div>
                    <h3>${escapeHtml(product.name)}</h3>
                    <strong>${money(product.price)}</strong>
                </div>
                <p>${escapeHtml(product.color)} · ★ ${escapeHtml(product.rating)}</p>
                <div class="product-card-meta">
                    ${product.tags.map(tag => `<span class="product-tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
                <div class="card-actions">
                    <button class="outline-button" data-action="quick" data-id="${product.id}" type="button">View</button>
                    <button class="dark-button" data-action="add" data-id="${product.id}" type="button">Add</button>
                </div>
            </div>
        </article>
    `;
}

function renderProducts(){
    $("#productGrid").innerHTML = sortedProducts().map(productCard).join("");
    bindProductActions();
}

function bindProductActions(){
    $$("#productGrid [data-action]").forEach(button => {
        button.addEventListener("click", () => {
            const product = PRODUCTS.find(item => item.id === button.dataset.id);
            if(!product) return;

            if(button.dataset.action === "add") addToCart(product.id);
            if(button.dataset.action === "quick") openQuickView(product);
            if(button.dataset.action === "wishlist") toggleWishlist(product.id);
        });
    });
}

function addToCart(id){
    const product = PRODUCTS.find(item => item.id === id);
    if(!product) return;

    const existing = state.cart.find(item => item.id === id);
    if(existing) existing.qty += 1;
    else state.cart.push({id, qty:1});

    save();
    toast(`${product.name} added to bag`);
}

function changeQty(id, delta){
    const item = state.cart.find(entry => entry.id === id);
    if(!item) return;

    item.qty += delta;
    if(item.qty <= 0){
        state.cart = state.cart.filter(entry => entry.id !== id);
    }
    save();
    renderCart();
}

function removeFromCart(id){
    state.cart = state.cart.filter(item => item.id !== id);
    save();
    renderCart();
}

function toggleWishlist(id){
    const product = PRODUCTS.find(item => item.id === id);
    if(!product) return;

    if(state.wishlist.includes(id)){
        state.wishlist = state.wishlist.filter(item => item !== id);
        toast(`${product.name} removed from wishlist`);
    }else{
        state.wishlist.push(id);
        toast(`${product.name} saved to wishlist`);
    }

    save();
    renderProducts();
    renderWishlist();
}

function renderCart(){
    const wrap = $("#cartItems");

    if(!state.cart.length){
        wrap.innerHTML = `
            <div class="empty-panel">
                <div>
                    <strong>Your bag is empty.</strong>
                    <p>Add a piece you love and it will appear here.</p>
                </div>
            </div>
        `;
        $("#cartTotal").textContent = "₹0";
        return;
    }

    let total = 0;

    wrap.innerHTML = state.cart.map(entry => {
        const product = PRODUCTS.find(item => item.id === entry.id);
        if(!product) return "";

        total += product.price * entry.qty;

        return `
            <div class="cart-line">
                <img src="${imageWithFallback(product.image, product.name.toUpperCase())}" alt="${escapeHtml(product.name)}">
                <div>
                    <h4>${escapeHtml(product.name)}</h4>
                    <p>${escapeHtml(product.color)} · ${money(product.price)}</p>
                    <div class="qty-controls">
                        <button data-cart-action="minus" data-id="${product.id}" aria-label="Decrease quantity">−</button>
                        <span>${entry.qty}</span>
                        <button data-cart-action="plus" data-id="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <div class="line-actions">
                    <strong>${money(product.price * entry.qty)}</strong>
                    <button class="remove-line" data-cart-action="remove" data-id="${product.id}" aria-label="Remove item">×</button>
                </div>
            </div>
        `;
    }).join("");

    $("#cartTotal").textContent = money(total);

    $$("[data-cart-action]", $("#cartItems")).forEach(button => {
        button.addEventListener("click", () => {
            const action = button.dataset.cartAction;
            const id = button.dataset.id;

            if(action === "plus") changeQty(id, 1);
            if(action === "minus") changeQty(id, -1);
            if(action === "remove") removeFromCart(id);
        });
    });
}

function renderWishlist(){
    const wrap = $("#wishlistItems");

    if(!state.wishlist.length){
        wrap.innerHTML = `
            <div class="empty-panel">
                <div>
                    <strong>Your wishlist is empty.</strong>
                    <p>Save products to keep your shortlist here.</p>
                </div>
            </div>
        `;
        return;
    }

    wrap.innerHTML = state.wishlist.map(id => {
        const product = PRODUCTS.find(item => item.id === id);
        if(!product) return "";

        return `
            <div class="wish-line">
                <img src="${imageWithFallback(product.image, product.name.toUpperCase())}" alt="${escapeHtml(product.name)}">
                <div>
                    <h4>${escapeHtml(product.name)}</h4>
                    <p>${money(product.price)} · ${escapeHtml(product.color)}</p>
                    <button class="wish-add" data-wish-add="${product.id}" type="button">Add to bag</button>
                </div>
                <button class="remove-line" data-wish-remove="${product.id}" aria-label="Remove wishlist item">×</button>
            </div>
        `;
    }).join("");

    $$("[data-wish-add]", wrap).forEach(btn => btn.addEventListener("click", () => {
        addToCart(btn.dataset.wishAdd);
    }));

    $$("[data-wish-remove]", wrap).forEach(btn => btn.addEventListener("click", () => {
        toggleWishlist(btn.dataset.wishRemove);
    }));
}

function showDrawer(id){
    closeAllOverlays();
    const drawer = $(`#${id}`);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("open");

    if(id === "cartDrawer") renderCart();
    if(id === "wishlistDrawer") renderWishlist();
}

function hideOverlay(id){
    const el = $(`#${id}`);
    if(!el) return;
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");

    const anyDrawer = $$(".drawer.open").length > 0;
    const anyModal = $$(".modal.open").length > 0;
    if(!anyDrawer && !anyModal){
        $("#overlay").classList.remove("open");
    }
}

function closeAllOverlays(){
    $$(".drawer.open,.modal.open").forEach(el => {
        el.classList.remove("open");
        el.setAttribute("aria-hidden","true");
    });
    $("#overlay").classList.remove("open");
}

function openQuickView(product){
    state.selectedProduct = product.id;
    $("#quickImage").src = imageWithFallback(product.image, product.name.toUpperCase());
    $("#quickImage").alt = product.name;
    $("#quickCategory").textContent = product.category.toUpperCase();
    $("#quickName").textContent = product.name;
    $("#quickDescription").textContent = product.description;
    $("#quickPrice").textContent = money(product.price);
    $("#quickMeta").innerHTML = product.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("");
    $("#quickViewModal").classList.add("open");
    $("#quickViewModal").setAttribute("aria-hidden","false");
    $("#overlay").classList.add("open");
}

function renderSearch(query=""){
    const q = query.trim().toLowerCase();
    const items = PRODUCTS.filter(product =>
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.color.toLowerCase().includes(q) ||
        product.tags.some(tag => tag.toLowerCase().includes(q))
    );

    $("#searchResults").innerHTML = items.length
        ? items.map(product => `
            <div class="search-result-line">
                <div>
                    <strong>${escapeHtml(product.name)}</strong>
                    <span>${escapeHtml(product.color)} · ${money(product.price)}</span>
                </div>
                <button class="outline-button" style="min-height:38px;padding:7px 12px" data-search-id="${product.id}" type="button">View</button>
            </div>
        `).join("")
        : `<div class="empty-panel" style="min-height:120px"><div>No matching products found.</div></div>`;

    $$("[data-search-id]", $("#searchResults")).forEach(button => {
        button.addEventListener("click", () => {
            const product = PRODUCTS.find(item => item.id === button.dataset.searchId);
            closeAllOverlays();
            openQuickView(product);
        });
    });
}

$$(".filter-tab").forEach(button => {
    button.addEventListener("click", () => {
        $$(".filter-tab").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
        state.filter = button.dataset.filter;
        renderProducts();
    });
});

$("#sortButton").addEventListener("click", () => {
    const options = [
        ["featured","Featured"],
        ["price-low","Price: low to high"],
        ["price-high","Price: high to low"],
        ["name","Name A–Z"]
    ];

    const currentIndex = options.findIndex(option => option[0] === state.sort);
    const next = options[(currentIndex + 1) % options.length];

    state.sort = next[0];
    $("#sortLabel").textContent = next[1];
    renderProducts();
    toast(`Sorted by ${next[1]}`);
});

$$(".palette-dot").forEach(button => {
    button.addEventListener("click", () => {
        $$(".palette-dot").forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        const image = $("#heroProductImage");
        const src = button.dataset.image;
        image.src = imageWithFallback(src, `${button.dataset.color} POLO`);
        image.dataset.source = src;
        image.alt = `Premium ${button.dataset.color.toLowerCase()} polo shirt`;

        $(".hero-product-meta span").textContent = money(button.dataset.price);
        $(".hero-floating-note strong").textContent = `CL-HB-${button.dataset.color.toUpperCase()}`;
        toast(`${button.dataset.color} selected`);
    });
});

$("#heroAdd").addEventListener("click", () => addToCart("navy"));
$("#heroQuickView").addEventListener("click", () => openQuickView(PRODUCTS[0]));

$("#searchOpen").addEventListener("click", () => {
    closeAllOverlays();
    $("#searchModal").classList.add("open");
    $("#searchModal").setAttribute("aria-hidden","false");
    $("#overlay").classList.add("open");
    $("#siteSearch").focus();
    renderSearch("");
});

$("#cartOpen").addEventListener("click", () => showDrawer("cartDrawer"));
$("#wishlistOpen").addEventListener("click", () => showDrawer("wishlistDrawer"));

$$("[data-close]").forEach(button => {
    button.addEventListener("click", () => hideOverlay(button.dataset.close));
});

$("#overlay").addEventListener("click", closeAllOverlays);

document.addEventListener("keydown", event => {
    if(event.key === "Escape") closeAllOverlays();
});

$("#siteSearch").addEventListener("input", event => renderSearch(event.target.value));

$("#quickAdd").addEventListener("click", () => {
    if(state.selectedProduct) addToCart(state.selectedProduct);
});

$("#checkoutButton").addEventListener("click", () => {
    if(!state.cart.length){
        toast("Your bag is empty");
        return;
    }
    toast("Demo checkout ready — connect your live payment gateway.");
});

$("#watchStory").addEventListener("click", () => {
    document.querySelector("#story").scrollIntoView({behavior:"smooth"});
});

$("#menuOpen").addEventListener("click", () => {
    const header = $("#siteHeader");
    const open = header.classList.toggle("menu-open");
    $("#menuOpen").setAttribute("aria-expanded", String(open));
    $("#menuOpen").textContent = open ? "✕" : "☰";
});

$$(".mobile-panel a").forEach(link => {
    link.addEventListener("click", () => {
        $("#siteHeader").classList.remove("menu-open");
        $("#menuOpen").setAttribute("aria-expanded","false");
        $("#menuOpen").textContent = "☰";
    });
});

$("#closeAnnouncement").addEventListener("click", () => {
    $(".announcement").style.display = "none";
});

$("#newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#newsletterEmail");

    if(!input.checkValidity()){
        input.reportValidity();
        return;
    }

    toast("You're on the list — welcome to the next drop.");
    input.value = "";
});

$$(".hero-product img, .product-image img, .quick-image-wrap img").forEach(img => {
    img.addEventListener("error", () => {
        if(img.dataset.fallbackApplied === "true") return;
        img.dataset.fallbackApplied = "true";
        img.src = placeholderSvg(img.alt || "BANGOPRAJUKTI");
    });
});

updateCounts();
renderProducts();
renderCart();
renderWishlist();

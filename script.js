(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const money = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    })
      .format(Number(value) || 0)
      .replace(/\s/g, "");

  const CART_STORAGE_KEY = "lorem-cart-v1";
  const ORDER_STORAGE_KEY = "lorem-orders-v1";
  const MAX_FLOWERS = 12;
  const ORDER_STAGES = ["Order Placed", "Processing", "Shipped", "Delivered"];

  const WHATSAPP_NUMBER = "08881548329";

  const escapeHTML = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  function readArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.warn(`Could not read ${key}:`, error);
      return [];
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Could not save ${key}:`, error);
      return false;
    }
  }

  /* =====================================================
     1. INITIAL PAGE SETUP
  ===================================================== */

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  document.documentElement.classList.add("js-ready");

  /* =====================================================
     2. HEADER + MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  const siteHeader = $("#top");

  if (siteHeader) {
    let previousScrollY = window.scrollY;

    const showHeader = () => siteHeader.classList.remove("is-hidden");
    const hideHeader = () => {
      if (mainNav?.classList.contains("open")) return;
      siteHeader.classList.add("is-hidden");
    };

    if (previousScrollY > 0) hideHeader();

    window.addEventListener(
      "scroll",
      () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY <= 0) {
          showHeader();
        } else if (currentScrollY > previousScrollY) {
          hideHeader();
        } else if (currentScrollY < previousScrollY) {
          showHeader();
        }
        previousScrollY = currentScrollY;
      },
      { passive: true },
    );

    document.addEventListener(
      "pointermove",
      (event) => {
        if (event.clientY <= siteHeader.offsetHeight) showHeader();
      },
      { passive: true },
    );

    siteHeader.addEventListener("focusin", showHeader);
  }

  function closeMenu() {
    if (!menuToggle || !mainNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mainNav.classList.remove("open");
  }

  menuToggle?.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close navigation" : "Open navigation",
    );
    mainNav?.classList.toggle("open", willOpen);
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      $$(".nav-link").forEach((item) =>
        item.classList.toggle("active", item === link),
      );
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (!mainNav?.classList.contains("open")) return;
    if (mainNav.contains(event.target) || menuToggle?.contains(event.target))
      return;
    closeMenu();
  });

  /* =====================================================
     3. ACTIVE SECTION + SCROLL REVEAL
  ===================================================== */

  const sections = $$("main section[id], main footer[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$(".nav-link").forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    $$(
      ".section-heading, .shop-layout, .builder-workspace, .builder-checkout, .about-copy, .footer-main",
    ).forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    $$(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  /* =====================================================
     4. TOAST NOTIFICATION
  ===================================================== */

  const toast = $("#toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* =====================================================
     5. SHOP PRODUCT SELECTION
  ===================================================== */

  const shopProducts = {
    "white-lily": {
      name: "A Promise of Spring",
      subtitle: "",
      description:
        "A delicate arrangement inspired by a heartfelt gesture, symbolizing sincere affection, new beginnings, and the beauty of love that blooms unexpectedly.",
      price: 340000,
      image: "assets/flowers/chair-UWMA.svg",
      index: "FEATURED PIECE / 001",
      meta: "Artificial floral arrangement · Decorative use",
      dimensions: "40 × 60 cm",
      composition: "3 pink alstroemeria · 4 white gerbera / daisy",
      icon: "✿",
    },
    "blush-tulip": {
      name: "The Lily of Silent Release",
      subtitle: "",
      description:
        "The beauty of love beyond endings, symbolizing that death doesn't mean everything has ceased, for sincerity and affection can continue to bloom even without the need to hold on",
      price: 200000,
      image: "assets/flowers/chair-YY.svg",
      index: "CURATED PIECE / 002",
      meta: "Artificial lily arrangement · Decorative use",
      dimensions: "38 × 43 cm",
      composition: "2 white lilies · 3 red roses",
      icon: "🌷",
    },
    "lavender-bloom": {
      name: "The Blush of Everlasting Love",
      subtitle: "",
      description:
        "A graceful expression of love, admiration, and sincere affection. The white lilies symbolize purity and devotion, the red roses represent deep and passionate love, while the pink tulips embody tenderness and happiness. Wrapped in soft blush-pink elegance, this bouquet represents a beautiful reminder that genuine love can bloom endlessly through every moment, gesture, and memory.",
      price: 209000,
      image: "assets/flowers/chair-DN.svg",
      index: "CURATED PIECE / 003",
      meta: "Artificial floral arrangement · Decorative use",
      dimensions: "60 × 43 cm",
      composition: "2 white lilies · 3 red roses · 5–6 pink tulips",
      icon: "✳",
    },
  };

  const shopName = $("#shopProductName");
  const shopDescription = $("#shopProductDescription");
  const shopPrice = $("#shopProductPrice");
  const shopIndex = $("#shopProductIndex");
  const shopMeta = $("#shopProductMeta");
  const shopDimensions = $("#shopProductDimensions");
  const shopComposition = $("#shopProductComposition");
  const shopImage = $("#shopChairBouquet");
  const shopAddButton = $("#shopAddButton");
  const productCards = $$(".shop-product-card");
  let activeProductId = "white-lily";

  productCards.forEach((card) => {
    const image = $(".shop-card-art", card);
    const product = shopProducts[card.dataset.shopProduct];
    if (!image || !product) return;
    image.addEventListener("error", () => {
      image.hidden = true;
      let fallback = $(".shop-card-fallback", card);
      if (!fallback) {
        fallback = document.createElement("span");
        fallback.className = "shop-card-fallback";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = product.icon;
        image.after(fallback);
      }
    }, { once: true });
  });

  function updateProductSelection(id) {
    productCards.forEach((card) => {
      const isSelected = card.dataset.shopProduct === id;
      card.classList.toggle("is-selected", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function selectShopProduct(id) {
    const product = shopProducts[id];
    if (!product) return;

    activeProductId = id;
    updateProductSelection(id);

    if (shopIndex) shopIndex.textContent = product.index;
    if (shopName) {
      shopName.innerHTML = product.subtitle
        ? `${escapeHTML(product.name)}<br><em>${escapeHTML(product.subtitle)}</em>`
        : escapeHTML(product.name);
    }
    if (shopDescription) shopDescription.textContent = product.description;
    if (shopPrice) shopPrice.textContent = money(product.price);
    if (shopMeta) shopMeta.textContent = product.meta;
    if (shopDimensions) shopDimensions.textContent = product.dimensions;
    if (shopComposition) shopComposition.textContent = product.composition;
    if (shopAddButton) shopAddButton.dataset.addProduct = id;

    if (shopImage) {
      shopImage.style.display = "block";
      shopImage.alt = [product.name, product.subtitle]
        .filter(Boolean)
        .join(" ");
      shopImage.onerror = () => {
        shopImage.style.display = "none";
        const fallback = $(".chair-fallback");
        if (fallback) fallback.style.display = "block";
        const flowerFallback = $(".bouquet-fallback");
        if (flowerFallback) flowerFallback.style.display = "block";
      };
      shopImage.onload = () => {
        const fallback = $(".chair-fallback");
        if (fallback) fallback.style.display = "none";
        const flowerFallback = $(".bouquet-fallback");
        if (flowerFallback) flowerFallback.style.display = "none";
      };
      shopImage.src = product.image;
    }
  }

  productCards.forEach((card) => {
    card.addEventListener("click", () =>
      selectShopProduct(card.dataset.shopProduct),
    );
  });

  const shopSearch = $("#shopSearch");
  const shopSort = $("#shopSort");
  const shopResults = $("#shopResults");
  const shopList = $(".shop-product-list");
  const originalProductOrder = [...productCards];

  function updateShopListing() {
    if (!shopList) return;
    const query = String(shopSearch?.value || "").trim().toLowerCase();
    const sort = shopSort?.value || "featured";
    const cards = [...originalProductOrder];
    if (sort === "price-asc") cards.sort((a, b) => shopProducts[a.dataset.shopProduct].price - shopProducts[b.dataset.shopProduct].price);
    if (sort === "price-desc") cards.sort((a, b) => shopProducts[b.dataset.shopProduct].price - shopProducts[a.dataset.shopProduct].price);
    if (sort === "name") cards.sort((a, b) => shopProducts[a.dataset.shopProduct].name.localeCompare(shopProducts[b.dataset.shopProduct].name, "id"));
    cards.forEach((card) => {
      const product = shopProducts[card.dataset.shopProduct];
      const matches = `${product.name} ${product.subtitle} ${product.description}`.toLowerCase().includes(query);
      card.hidden = !matches;
      shopList.append(card);
    });
    const visible = cards.filter((card) => !card.hidden).length;
    if (shopResults) shopResults.textContent = `${visible} ${visible === 1 ? "piece" : "pieces"} found`;
    if (query && !visible) {
      let empty = $("#shopEmptyState");
      if (!empty) {
        empty = document.createElement("p");
        empty.id = "shopEmptyState";
        empty.className = "shop-empty-state";
        empty.textContent = "No products match your search.";
        shopList.after(empty);
      }
      empty.hidden = false;
    } else {
      const empty = $("#shopEmptyState");
      if (empty) empty.hidden = true;
    }
  }
  shopSearch?.addEventListener("input", updateShopListing);
  shopSort?.addEventListener("change", updateShopListing);

  /* =====================================================
     6. CART + LOCAL STORAGE
  ===================================================== */

  const cart = readArray(CART_STORAGE_KEY)
    .filter(
      (item) =>
        item &&
        typeof item.name === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) >= 0,
    )
    .map((item) => ({
      name: item.name,
      price: Number(item.price),
      icon: String(item.icon || "✿"),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      detail: String(item.detail || ""),
      ...(item.configuration && typeof item.configuration === "object"
        ? { configuration: item.configuration }
        : {}),
    }));

  const cartDrawer = $("#cartDrawer");
  const cartBackdrop = $("#cartBackdrop");
  const cartItems = $("#cartItems");
  let lastFocusedElement = null;
  let editingCartIndex = null;

  function saveCart() {
    if (!writeStorage(CART_STORAGE_KEY, cart)) {
      showToast(
        "Browser storage is unavailable; cart may not persist after refresh.",
      );
    }
  }

  function openCart() {
    if (!cartDrawer || !cartBackdrop) return;
    lastFocusedElement = document.activeElement;
    cartDrawer.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartDrawer.inert = false;
    cartBackdrop.hidden = false;
    document.body.classList.add("cart-is-open");
    document.body.style.overflow = "hidden";
    $("#closeCart")?.focus();
  }

  function closeCart(restoreFocus = true) {
    if (!cartDrawer || !cartBackdrop) return;
    const wasOpen = cartDrawer.classList.contains("open");
    cartDrawer.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartDrawer.inert = true;
    cartBackdrop.hidden = true;
    document.body.classList.remove("cart-is-open");
    document.body.style.overflow = "";
    if (wasOpen && restoreFocus)
      (lastFocusedElement || $("#cartButton"))?.focus();
  }

  function cartSubtotalValue() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function renderCartBouquetPreview(configuration, expanded = false) {
    const flowers = Array.isArray(configuration?.flowers) ? configuration.flowers : [];
    const wrappingId = String(configuration?.wrapping || "0");
    const wrappingScale = Math.max(50, Math.min(150, Number(configuration?.wrappingScale) || 100)) / 100;
    const blooms = flowers.map((entry, index) => {
      const flower = flowerData[entry.id];
      if (!flower) return "";
      const legacyLayout = !Number.isFinite(Number(entry.width));
      const autoPose = (bouquetLayouts[flowers.length] || bouquetLayouts[12])[index] || [50, 0, 0.76];
      const width = Number(entry.width) || (flower.category === "addons" || flower.category === "greenery" ? 30 : flower.category === "hydrangea" ? 38 : 34);
      const x = legacyLayout ? 50 : (Number(entry.x) || 50);
      const y = legacyLayout ? 0 : (Number(entry.y) || 0);
      const angle = legacyLayout ? autoPose[1] : (Number(entry.angle) || 0);
      const scale = legacyLayout ? autoPose[2] : (Number(entry.scale) || 1);
      const layer = legacyLayout ? index + 1 : (Number(entry.layer) || index + 1);
      const image = flower.image
        ? `<img src="${escapeHTML(flower.image)}" alt="" loading="lazy">`
        : `<span class="cart-preview-fallback">${escapeHTML(flower.glyph || "✿")}</span>`;
      return `<span class="cart-preview-bloom" style="--flower-x:${x}%;--flower-y:${y}%;--flower-angle:${angle}deg;--flower-scale:${scale};--flower-layer:${layer};--flower-width:${width}px">${image}</span>`;
    }).join("");
    const wrappingBack = ["1", "2", "3"].includes(wrappingId)
      ? `<img class="cart-preview-wrap cart-preview-wrap-back" src="assets/WRAPPING/BACK/${wrappingId}.svg" alt="" style="--wrapping-scale:${wrappingScale}">`
      : "";
    const wrappingFront = ["1", "2", "3"].includes(wrappingId)
      ? `<img class="cart-preview-wrap cart-preview-wrap-front" src="assets/WRAPPING/FRONT/${wrappingId}.svg" alt="" style="--wrapping-scale:${wrappingScale}">`
      : "";
    return `<div class="cart-bouquet-preview${expanded ? " is-expanded" : ""}" role="img" aria-label="Preview of the saved custom bouquet">${wrappingBack}<div class="cart-preview-blooms">${blooms}</div>${wrappingFront}</div>`;
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartSubtotalValue();

    if ($("#cartCount")) $("#cartCount").textContent = count;
    if ($("#drawerCount")) $("#drawerCount").textContent = `(${count})`;
    if ($("#cartSubtotal")) $("#cartSubtotal").textContent = money(total);
    if ($("#checkoutButton")) $("#checkoutButton").disabled = count === 0;
    if ($("#clearCart")) $("#clearCart").disabled = count === 0;

    if (!cartItems) {
      saveCart();
      updateCheckoutTotals();
      return;
    }

    if (!cart.length) {
      cartItems.innerHTML =
        '<p class="cart-empty">Your cart is empty for now.</p>';
    } else {
      cartItems.innerHTML = cart
        .map(
          (item, index) => {
            const hasDesign = Array.isArray(item.configuration?.flowers) && item.configuration.flowers.length > 0;
            const expanded = item.previewExpanded === true;
            const designPreview = hasDesign
              ? renderCartBouquetPreview(item.configuration, expanded)
              : `<div class="cart-item-art" aria-hidden="true">${escapeHTML(item.icon || "✿")}</div>`;
            return `
        <article class="cart-item${hasDesign ? " cart-item-custom" : ""}${expanded ? " is-preview-expanded" : ""}">
          ${designPreview}
          <div class="cart-item-info">
            <strong>${escapeHTML(item.name)}</strong>
            ${item.detail ? `<small class="cart-item-detail">${escapeHTML(item.detail)}</small>` : ""}
            ${hasDesign ? `<div class="cart-item-design-actions"><button class="cart-preview-toggle" type="button" data-cart-action="preview" data-cart-index="${index}" aria-expanded="${expanded}">${expanded ? "Hide design" : "View design"}</button><button class="cart-edit-button" type="button" data-cart-action="edit" data-cart-index="${index}">Edit bouquet</button></div>` : ""}
            <div class="cart-quantity-control" aria-label="Quantity controls">
              <button type="button" data-cart-action="decrease" data-cart-index="${index}" aria-label="Decrease ${escapeHTML(item.name)} quantity" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
              <output>${item.quantity}</output>
              <button type="button" data-cart-action="increase" data-cart-index="${index}" aria-label="Increase ${escapeHTML(item.name)} quantity">+</button>
            </div>
          </div>
          <span class="cart-item-price">${money(item.price * item.quantity)}</span>
          <button class="cart-remove" type="button" data-cart-action="remove" data-cart-index="${index}" aria-label="Remove ${escapeHTML(item.name)}">×</button>
        </article>
      `;
          },
        )
        .join("");
    }

    saveCart();
    updateCheckoutTotals();
  }

  function addToCart(item) {
    if (!item || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)
      return;

    const normalized = {
      name: String(item.name || "D’YFleur item"),
      price: Number(item.price),
      icon: String(item.icon || "✿"),
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      detail: String(item.detail || ""),
      ...(item.configuration ? { configuration: item.configuration } : {}),
    };

    const configurationKey = JSON.stringify(normalized.configuration || null);
    const existing = cart.find(
      (row) =>
        row.name === normalized.name &&
        row.detail === normalized.detail &&
        JSON.stringify(row.configuration || null) === configurationKey,
    );
    if (existing) {
      if (existing.quantity + normalized.quantity > 99) {
        showToast("Maximum 99 units per cart item");
        return;
      }
      existing.quantity += normalized.quantity;
    } else cart.push(normalized);

    renderCart();
    showToast(`${normalized.name} added to your cart`);
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-product]");
    if (!addButton) return;
    const product = shopProducts[addButton.dataset.addProduct];
    if (!product) return;

    addToCart({
      name: `${product.name} ${product.subtitle}`.trim(),
      price: product.price,
      icon: product.icon,
      quantity: 1,
    });
  });

  $("#cartButton")?.addEventListener("click", openCart);
  $("#closeCart")?.addEventListener("click", () => closeCart());
  cartBackdrop?.addEventListener("click", () => closeCart());

  cartItems?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const index = Number(button.dataset.cartIndex);
    const item = cart[index];
    if (!item) return;

    if (button.dataset.cartAction === "increase") {
      if (item.quantity >= 99) {
        showToast("Maximum 99 units per cart item");
        return;
      }
      item.quantity += 1;
    }
    if (button.dataset.cartAction === "decrease" && item.quantity > 1)
      item.quantity -= 1;
    if (button.dataset.cartAction === "remove") cart.splice(index, 1);
    if (button.dataset.cartAction === "preview") {
      item.previewExpanded = !item.previewExpanded;
      renderCart();
      return;
    }
    if (button.dataset.cartAction === "edit") {
      if (!item.configuration || !Array.isArray(item.configuration.flowers)) return;
      editingCartIndex = index;
      const savedFlowers = item.configuration.flowers.filter((flower) => flowerData[flower.id]);
      selectedFlowers.splice(0, selectedFlowers.length, ...savedFlowers.map((flower) => flower.id));
      flowerAdjustments.splice(0, flowerAdjustments.length, ...savedFlowers.map((flower, flowerIndex) => ({
        uid: nextFlowerInstanceId++, angle: Number(flower.angle) || 0, scale: Number(flower.scale) || 1,
        x: Number(flower.x) - 50 || 0, y: Number(flower.y) || 0, layer: Number(flower.layer) || flowerIndex + 1,
      })));
      selectedFlowerIndex = selectedFlowers.length ? 0 : -1;
      autoArrangeEnabled = false;
      if (wrapping) wrapping.value = String(item.configuration.wrapping || "0");
      currentWrappingScale = Math.max(70, Math.min(130, Number(item.configuration.wrappingScale) || 100));
      if (wrappingScale) wrappingScale.value = String(currentWrappingScale);
      if ($("#customBouquetName")) $("#customBouquetName").value = item.name;
      renderBuilder();
      closeCart();
      $("#builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Edit the bouquet, then choose Update cart item");
      return;
    }

    renderCart();
  });

  $("#clearCart")?.addEventListener("click", () => {
    if (!cart.length) return;
    if (!window.confirm("Remove all items from your cart?")) return;
    cart.length = 0;
    renderCart();
    showToast("Cart cleared");
  });

  /* =====================================================
     7. BOUQUET BUILDER
  ===================================================== */

  const flowerData = {
    // Catalog prices are provisional demo values until final prices are supplied.
    "addons-babys-breath": { name: "Baby's Breath", price: 7000, category: "addons", image: "assets/flowers/add-ons-flower/babys-breath.png", glyph: "✳", size: 48 },
    "addons-chamomile": { name: "Chamomile", price: 6000, category: "addons", image: "assets/flowers/add-ons-flower/chamomile.png", glyph: "✿", size: 48 },
    "addons-million-stars": { name: "Million Stars", price: 7000, category: "addons", image: "assets/flowers/add-ons-flower/million-stars.png", glyph: "✳", size: 48 },
    "addons-statice": { name: "Statice", price: 6000, category: "addons", image: "assets/flowers/add-ons-flower/statice.png", glyph: "✿", size: 48 },
    "addons-wax-flower": { name: "Wax Flower", price: 6000, category: "addons", image: "assets/flowers/add-ons-flower/wax-flower.png", glyph: "✳", size: 48 },

    "carnation-pink": { name: "Pink Carnation", price: 11000, category: "carnation", image: "assets/flowers/Carnation/pink-carnation.png", glyph: "✿", size: 58 },
    "carnation-purple": { name: "Purple Carnation", price: 11000, category: "carnation", image: "assets/flowers/Carnation/purple-carnation.png", glyph: "✿", size: 58 },
    "carnation-red": { name: "Red Carnation", price: 11000, category: "carnation", image: "assets/flowers/Carnation/red-carnation.png", glyph: "✿", size: 58 },
    "carnation-white": { name: "White Carnation", price: 11000, category: "carnation", image: "assets/flowers/Carnation/white carnation.png", glyph: "✿", size: 58 },
    
    "gerbera-orange": { name: "Orange Gerbera", price: 11000, category: "gerbera", image: "assets/flowers/Gerberas/orange-gerbera.png", glyph: "✿", size: 58 },
    "gerbera-pink": { name: "Pink Gerbera", price: 11000, category: "gerbera", image: "assets/flowers/Gerberas/pink-gerbera.png", glyph: "✿", size: 58 },
    "gerbera-red": { name: "Red Gerbera", price: 11000, category: "gerbera", image: "assets/flowers/Gerberas/red-gerbera.png", glyph: "✿", size: 58 },
    "gerbera-white": { name: "White Gerbera", price: 11000, category: "gerbera", image: "assets/flowers/Gerberas/white-gerbera.png", glyph: "✿", size: 58 },
    
    "hydrangea-white": { name: "White Hydrangea", price: 20000, category: "hydrangea", image: "assets/flowers/Hydrangeas/white-hydrangea.png", glyph: "✿", size: 66 },
    "hydrangea-purple": { name: "Purple Hydrangea", price: 20000, category: "hydrangea", image: "assets/flowers/Hydrangeas/purple-hydrangea.png", glyph: "✿", size: 62 },
    "hydrangea-pink": { name: "Pink Hydrangea", price: 20000, category: "hydrangea", image: "assets/flowers/Hydrangeas/pink-hydrangea.png", glyph: "✿", size: 62 },
    "hydrangea-blue": { name: "Blue Hydrangea", price: 20000, category: "hydrangea", image: "assets/flowers/Hydrangeas/blue hydrangea.png", glyph: "✿", size: 58 },
    
    "lily-orange": { name: "Orange Lily", price: 12000, category: "lily", image: "assets/flowers/Lilies/orange-lily.png", glyph: "✿", color: "#d98b58", size: 60 },
    "lily-pink": { name: "Pink Lily", price: 12000, category: "lily", image: "assets/flowers/Lilies/pink-lily.png", glyph: "✿", color: "#d98b9c", size: 58 },
    "lily-white": { name: "White Lily", price: 12000, category: "lily", image: "assets/flowers/Lilies/white-lily.png", glyph: "✿", color: "#e9e1c9", size: 58 },
    "lily-yellow": { name: "Yellow Lily", price: 12000, category: "lily", image: "assets/flowers/Lilies/yellow-lily.png", glyph: "✿", color: "#e3c45e", size: 60 },
    
    "peony-pink": { name: "Pink Peony", price: 15000, category: "peonies", image: "assets/flowers/Peonies/pink-peony.png", glyph: "✿", color: "#d98b9c", size: 62 },
    "peony-white": { name: "White Peony", price: 15000, category: "peonies", image: "assets/flowers/Peonies/white-peony.png", glyph: "✿", color: "#eee7d8", size: 62 },
    "peony-red": { name: "Red Peony", price: 15000, category: "peonies", image: "assets/flowers/Peonies/red-peony.png", glyph: "✿", color: "#a94358", size: 62 },
    
    "rose-peach": { name: "Peach Rose", price: 12000, category: "roses", image: "assets/flowers/Roses/peach-rose.png", glyph: "✿", color: "#e8a17f", size: 54 },
    "rose-pink": { name: "Pink Rose", price: 12000, category: "roses", image: "assets/flowers/Roses/pink-rose.png", glyph: "✿", color: "#d98b9c", size: 54 },
    "rose-white": { name: "White Rose", price: 12000, category: "roses", image: "assets/flowers/Roses/white-rose.png", glyph: "✿", color: "#eee7d8", size: 54 },
    "rose-yellow": { name: "Yellow Rose", price: 12000, category: "roses", image: "assets/flowers/Roses/yellow-rose.png", glyph: "✿", color: "#e3c45e", size: 54 },
    "rose-red": { name: "Red Rose", price: 12000, category: "roses", image: "assets/flowers/Roses/red-rose.png", glyph: "✿", color: "#a94358", size: 54 },
    
    "sunflower": { name: "Sunflower", price: 10000, category: "sunflower", image: "assets/flowers/sunflower/sunflower.png", glyph: "✿", color: "#e2b64c", size: 66 },
    
    "tulip-purple": { name: "Purple Tulip", price: 10000, category: "tulip", image: "assets/flowers/Tulips/purple-tulip.png", glyph: "🌷", size: 52 },
    "tulip-pink": { name: "Pink Tulip", price: 10000, category: "tulip", image: "assets/flowers/Tulips/pink-tulip.png", glyph: "🌷", size: 52 },
    "tulip-white": { name: "White Tulip", price: 10000, category: "tulip", image: "assets/flowers/Tulips/white-tulip.png", glyph: "🌷", size: 52 },
    "tulip-yellow": { name: "Yellow Tulip", price: 10000, category: "tulip", image: "assets/flowers/Tulips/yellow-tulip.png", glyph: "🌷", color: "#e3c45e", size: 52 },
    "tulip-red": { name: "Red Tulip", price: 10000, category: "tulip", image: "assets/flowers/Tulips/red-tulip.png", glyph: "🌷", color: "#a94358", size: 52 },
    
    "oncidium-orchid": { name: "Oncidium Orchid", price: 12000, category: "greenery", image: "assets/flowers/orchid/oncidium-orchid.png", glyph: "❧", color: "#8caa91", size: 58 },
    "vanda-orchid": { name: "Vanda Orchid", price: 12000, category: "greenery", image: "assets/flowers/orchid/vanda-orchid.png", glyph: "❧", color: "#6f936e", size: 58 },
  };
  const selectedFlowers = [];
  // Per-stem adjustments stay aligned with selectedFlowers by array index.
  const flowerAdjustments = [];
  let selectedFlowerIndex = -1;
  let autoArrangeEnabled = true;
  const previewBlooms = $("#previewBlooms");
  const previewWrapBack = $("#previewWrapBack");
  const previewWrapFront = $("#previewWrapFront");
  const wrappingScale = $("#wrappingScale");
  const wrappingScaleValue = $("#wrappingScaleValue");
  const wrapping = $("#wrapping");
  let currentWrappingScale = 100;
  const flowerOptions = $("#flowerOptions");
  const wrappingOptions = $("#wrappingOptions");

  // Each SVG already contains its own stem. These layouts position the complete
  // flower assets as a bouquet, with stems converging toward the wrapping.
  const bouquetLayouts = {
    // Every flower rotates around the same bottom-center anchor.
    // The flower heads fan outward while the original stems meet in the middle.
    1:  [[50, 0, 0.92]],
    2:  [[50, -12, 0.90], [50, 12, 0.90]],
    3:  [[50, 0, 0.94], [50, -20, 0.86], [50, 20, 0.86]],
    4:  [[50, -10, 0.90], [50, 10, 0.90], [50, -27, 0.82], [50, 27, 0.82]],
    5:  [[50, 0, 0.94], [50, -16, 0.88], [50, 16, 0.88], [50, -30, 0.80], [50, 30, 0.80]],
    6:  [[50, 0, 0.96], [50, -13, 0.90], [50, 13, 0.90], [50, -25, 0.83], [50, 25, 0.83], [50, 5, 0.78]],
    7:  [[50, 0, 0.96], [50, -12, 0.91], [50, 12, 0.91], [50, -24, 0.84], [50, 24, 0.84], [50, -34, 0.76], [50, 34, 0.76]],
    8:  [[50, 0, 0.98], [50, -10, 0.92], [50, 10, 0.92], [50, -21, 0.86], [50, 21, 0.86], [50, -31, 0.80], [50, 31, 0.80], [50, 4, 0.76]],
    9:  [[50, 0, 0.98], [50, -10, 0.93], [50, 10, 0.93], [50, -20, 0.87], [50, 20, 0.87], [50, -30, 0.81], [50, 30, 0.81], [50, -38, 0.75], [50, 38, 0.75]],
    10: [[50, 0, 0.98], [50, -9, 0.94], [50, 9, 0.94], [50, -19, 0.88], [50, 19, 0.88], [50, -28, 0.82], [50, 28, 0.82], [50, -36, 0.76], [50, 36, 0.76], [50, 4, 0.74]],
    11: [[50, 0, 1.00], [50, -9, 0.94], [50, 9, 0.94], [50, -18, 0.89], [50, 18, 0.89], [50, -27, 0.83], [50, 27, 0.83], [50, -35, 0.77], [50, 35, 0.77], [50, -14, 0.80], [50, 14, 0.80]],
    12: [[50, 0, 1.00], [50, -8, 0.95], [50, 8, 0.95], [50, -17, 0.90], [50, 17, 0.90], [50, -25, 0.84], [50, 25, 0.84], [50, -33, 0.78], [50, 33, 0.78], [50, -13, 0.82], [50, 13, 0.82], [50, 4, 0.76]],
  };

  function currentCategory() {
    return $("#flowerCategory")?.value || "all";
  }

  let nextFlowerInstanceId = 1;
  function getInstanceLabel(index) {
    const id = selectedFlowers[index];
    const ordinal = selectedFlowers.slice(0, index + 1).filter((item) => item === id).length;
    return `${flowerData[id].name} ${ordinal}`;
  }

  function getAutoX() {
    // Complete flower assets pivot from the same bottom-center point.
    return 50;
  }

  function renderFlowerOptions() {
    if (!flowerOptions) return;

    flowerOptions.innerHTML = Object.entries(flowerData)
      .map(([id, flower]) => {
        const quantity = selectedFlowers.filter(
          (selected) => selected === id,
        ).length;
        const atLimit = selectedFlowers.length >= MAX_FLOWERS;

        return `
        <article class="flower-option" data-flower="${id}">
          <span class="flower-thumb" aria-hidden="true">${flower.image ? `<img src="${flower.image}" alt="" loading="lazy"><span>${flower.glyph}</span>` : `<span class="flower-fallback" style="--fallback-color:${flower.color || '#bd8d9a'}">${flower.glyph}</span>`}</span>
          <span class="flower-info">
            <strong>${escapeHTML(flower.name)}</strong>
            <small>${money(flower.price)} / stem</small>
          </span>
          <span class="quantity-control">
            <button type="button" class="quantity-button" data-qty-change="-1" data-flower-id="${id}" aria-label="Remove one ${escapeHTML(flower.name)}" ${quantity === 0 ? "disabled" : ""}>−</button>
            <output class="quantity-value" aria-label="${quantity} selected">${quantity}</output>
            <button type="button" class="quantity-button" data-qty-change="1" data-flower-id="${id}" aria-label="Add one ${escapeHTML(flower.name)}" ${atLimit ? "disabled" : ""}>+</button>
          </span>
        </article>
      `;
      })
      .join("");

    $$(".flower-thumb img", flowerOptions).forEach((image) => {
      image.addEventListener("error", () => {
        image.hidden = true;
      }, { once: true });
    });

    const category = currentCategory();
    $$(".flower-option", flowerOptions).forEach((option) => {
      option.hidden =
        category !== "all" &&
        flowerData[option.dataset.flower].category !== category;
    });

    const visibleCount = $$(
      ".flower-option:not([hidden])",
      flowerOptions,
    ).length;
    const availableCount = $("#availableCount");
    if (availableCount)
      availableCount.textContent = `${String(visibleCount).padStart(2, "0")} ITEMS`;
  }

  const wrappingData = [
    { value: "0", name: "No Wrapping", price: 0, tone: "none", description: "Show the natural stems", asset: null },
    { value: "15000", name: "Wrapping 01", price: 15000, tone: "ivory", description: "Layered paper design 01", asset: "1" },
    { value: "20000", name: "Wrapping 02", price: 20000, tone: "rose", description: "Layered paper design 02", asset: "2" },
    { value: "25000", name: "Wrapping 03", price: 25000, tone: "burgundy", description: "Layered paper design 03", asset: "3" },
  ];

  function renderWrappingOptions() {
    if (!wrappingOptions || !wrapping) return;
    wrappingOptions.innerHTML = wrappingData.map((paper) => `
      <button type="button" class="wrapping-option ${wrapping.value === paper.value ? "is-selected" : ""}" data-wrap-value="${paper.value}" aria-pressed="${wrapping.value === paper.value}">
        <span class="wrapping-option-preview" aria-hidden="true">${paper.asset ? `<img class="option-wrap-back" src="assets/WRAPPING/BACK/${paper.asset}.svg" alt=""><img class="option-wrap-front" src="assets/WRAPPING/FRONT/${paper.asset}.svg" alt="">` : `<span class="wrapping-swatch wrapping-swatch-none"><i></i></span>`}</span>
        <span class="wrapping-option-info"><strong>${escapeHTML(paper.name)}</strong><small>${escapeHTML(paper.description)}</small><em>${money(paper.price)}</em></span>
        <span class="wrapping-check" aria-hidden="true">✓</span>
      </button>
    `).join("");
  }

  function setMaterialTab(tab) {
    const showWrapping = tab === "wrapping";
    const flowerPanel = $("#flowerCatalog");
    const wrappingPanel = $("#wrappingCatalog");
    const flowersTab = $("#flowersTab");
    const wrappingTab = $("#wrappingTab");
    flowerPanel?.classList.toggle("is-active", !showWrapping);
    wrappingPanel?.classList.toggle("is-active", showWrapping);
    if (flowerPanel) flowerPanel.hidden = showWrapping;
    if (wrappingPanel) wrappingPanel.hidden = !showWrapping;
    flowersTab?.classList.toggle("is-active", !showWrapping);
    wrappingTab?.classList.toggle("is-active", showWrapping);
    flowersTab?.setAttribute("aria-selected", String(!showWrapping));
    wrappingTab?.setAttribute("aria-selected", String(showWrapping));
  }

  function updateWrappingPreview() {
    if (!wrapping) return;
    const selected = wrappingData.find((paper) => paper.value === wrapping.value);
    const hasWrapping = Boolean(selected?.asset) && selectedFlowers.length > 0;
    const scale = currentWrappingScale / 100;
    [previewWrapBack, previewWrapFront].forEach((layer) => {
      if (!layer) return;
      layer.hidden = !hasWrapping;
      layer.style.setProperty("--wrapping-scale", String(scale));
      layer.src = hasWrapping
        ? `assets/WRAPPING/${layer === previewWrapBack ? "BACK" : "FRONT"}/${selected.asset}.svg`
        : "";
    });
    if (wrappingScale) wrappingScale.disabled = !selected?.asset;
    if (wrappingScaleValue) wrappingScaleValue.textContent = `${currentWrappingScale}%`;
  }

  function renderBuilder() {
    const count = selectedFlowers.length;
    const flowerTotal = selectedFlowers.reduce(
      (sum, id) => sum + flowerData[id].price,
      0,
    );
    const wrapTotal = Number(wrapping?.value || 0);
    const total = flowerTotal + wrapTotal;
    const wrapLabel =
      wrapping?.options[wrapping.selectedIndex]?.text.split(" — ")[0] ||
      "No wrapping";

    const flowerCount = $("#flowerCount");
    const builderTotal = $("#builderTotal");
    const builderSummary = $("#builderSummary");
    const builderBreakdown = $("#builderBreakdown");
    const addBouquetButton = $("#addBouquet");
    const cancelEditButton = $("#cancelBouquetEdit");
    if (addBouquetButton) {
      addBouquetButton.innerHTML = editingCartIndex === null ? 'Add bouquet to cart <span>↗</span>' : 'Update cart item <span>✓</span>';
      addBouquetButton.disabled = count === 0;
    }
    if (cancelEditButton) cancelEditButton.hidden = editingCartIndex === null;

    if (flowerCount)
      flowerCount.textContent = `${count} ${count === 1 ? "flower" : "flowers"} selected`;
    if (builderTotal) builderTotal.textContent = money(total);
    if (builderSummary)
      builderSummary.textContent = count
        ? `${count} ${count === 1 ? "stem" : "stems"} · ${wrapLabel}`
        : "Your bouquet is waiting";
    if (builderBreakdown) {
      const flowerLabel = money(flowerTotal);
      const wrapPrice = money(wrapTotal);
      builderBreakdown.textContent = count
        ? `Flowers ${flowerLabel} + wrapping ${wrapPrice}`
        : "Choose flowers to see your price breakdown.";
    }
    updateWrappingPreview();
    renderFlowerOptions();
    renderWrappingOptions();

    if (!previewBlooms) return;

    // Keep editor mode, selected instance dropdown, and controls synchronized.
    const autoButton = $("#autoArrange");
    const hint = $("#editorHint");
    const selectionLabel = $("#controlSelection");
    const instanceSelect = $("#flowerInstanceSelect");
    const controlButtons = $$ ("[data-flower-control]");
    if (autoButton) {
      autoButton.classList.toggle("is-active", autoArrangeEnabled);
      autoButton.setAttribute("aria-pressed", String(autoArrangeEnabled));
    }
    const manualButton = $("#manualArrange");
    if (manualButton) {
      manualButton.classList.toggle("is-active", !autoArrangeEnabled);
      manualButton.setAttribute("aria-pressed", String(!autoArrangeEnabled));
    }
    if (hint) hint.textContent = autoArrangeEnabled ? "Automatic layout is on" : "Manual mode · drag or select a flower";
    if (instanceSelect) {
      const previous = selectedFlowerIndex;
      instanceSelect.innerHTML = count
        ? selectedFlowers.map((id, index) => `<option value="${index}">${escapeHTML(getInstanceLabel(index))}</option>`).join("")
        : '<option value="">No flowers selected</option>';
      instanceSelect.disabled = !count || autoArrangeEnabled;
      if (previous >= 0 && previous < count) instanceSelect.value = String(previous);
      else if (count && !autoArrangeEnabled) instanceSelect.value = "0";
    }
    if (!autoArrangeEnabled && count && selectedFlowerIndex < 0) selectedFlowerIndex = 0;
    if (selectionLabel) selectionLabel.textContent = !autoArrangeEnabled && selectedFlowerIndex >= 0 && selectedFlowers[selectedFlowerIndex]
      ? `${getInstanceLabel(selectedFlowerIndex)} selected`
      : autoArrangeEnabled ? "Turn off Auto Arrange to edit" : "Select a flower to edit";
    controlButtons.forEach((button) => {
      button.disabled = autoArrangeEnabled || selectedFlowerIndex < 0 || !selectedFlowers[selectedFlowerIndex];
    });
    const activeAdjustment = selectedFlowerIndex >= 0 ? flowerAdjustments[selectedFlowerIndex] : null;
    ["X", "Y"].forEach((axis) => {
      const input = $(`#flowerPosition${axis}`);
      const output = $(`#flowerPosition${axis}Value`);
      const value = activeAdjustment ? (axis === "X" ? activeAdjustment.x : activeAdjustment.y) || 0 : 0;
      if (input) { input.value = String(value); input.disabled = autoArrangeEnabled || !activeAdjustment; }
      if (output) output.textContent = String(Math.round(value));
    });
    if (!count) {
      previewBlooms.innerHTML =
        '<div class="empty-preview"><span>✿</span><p>Your bouquet starts here</p><small>Select blooms to add them</small></div>';
      return;
    }

    const layout = bouquetLayouts[count] || bouquetLayouts[12];
    previewBlooms.innerHTML = selectedFlowers.map((id, index) => {
      const flower = flowerData[id];
      const autoPose = layout[index] || [50, 0, 0.76];
      const adjustment = flowerAdjustments[index] || { angle: 0, scale: 1, x: 0, y: 0, layer: index + 1 };
      const x = autoArrangeEnabled ? getAutoX(index, count) : Math.max(8, Math.min(92, 50 + (adjustment.x || 0)));
      const y = autoArrangeEnabled ? 0 : (adjustment.y || 0);
      const angle = autoArrangeEnabled ? autoPose[1] : adjustment.angle;
      const scale = autoArrangeEnabled ? autoPose[2] : adjustment.scale;
      const layer = autoArrangeEnabled ? index + 1 : adjustment.layer;
      const width = flower.category === "addons" || flower.category === "greenery" ? 30 : flower.category === "hydrangea" ? 38 : 34;
      const selected = index === selectedFlowerIndex && !autoArrangeEnabled;
      const image = flower.image ? `<img src="${flower.image}" alt="">` : `<span class="preview-fallback" style="--fallback-color:${flower.color || '#bd8d9a'}">${flower.glyph}</span>`;
      return `<button class="preview-bloom${selected ? " is-selected" : ""}" type="button" data-preview-index="${index}" aria-label="Select ${escapeHTML(getInstanceLabel(index))}" aria-pressed="${selected}" style="--flower-x:${x}%;--flower-y:${y}%;--flower-angle:${angle}deg;--flower-scale:${scale};--flower-layer:${layer};--flower-width:${width}px">${image}</button>`;
    }).join("");
    $$(".preview-bloom", previewBlooms).sort((a, b) => Number(a.style.getPropertyValue("--flower-layer")) - Number(b.style.getPropertyValue("--flower-layer"))).forEach((bloom) => {
      bloom.addEventListener("click", () => {
        if (autoArrangeEnabled) return;
        selectedFlowerIndex = Number(bloom.dataset.previewIndex);
        renderBuilder();
      });
      bloom.addEventListener("pointerdown", (event) => {
        if (autoArrangeEnabled || event.button !== 0) return;
        selectedFlowerIndex = Number(bloom.dataset.previewIndex);
        const adjustment = flowerAdjustments[selectedFlowerIndex];
        const canvasRect = previewBlooms.getBoundingClientRect();
        bloom.setPointerCapture?.(event.pointerId);
        bloom.dataset.dragStartX = String(event.clientX);
        bloom.dataset.dragStartY = String(event.clientY);
        bloom.dataset.dragOriginX = String(adjustment.x || 0);
        bloom.dataset.dragOriginY = String(adjustment.y || 0);
        bloom.dataset.canvasWidth = String(canvasRect.width || 1);
        bloom.dataset.canvasHeight = String(canvasRect.height || 1);
      });
      bloom.addEventListener("pointerup", (event) => {
        if (autoArrangeEnabled || bloom.dataset.dragStartX == null) return;
        const index = Number(bloom.dataset.previewIndex);
        const dx = event.clientX - Number(bloom.dataset.dragStartX);
        const dy = event.clientY - Number(bloom.dataset.dragStartY);
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          const adjustment = flowerAdjustments[index];
          adjustment.x = Math.max(-42, Math.min(42, Number(bloom.dataset.dragOriginX) + dx / Number(bloom.dataset.canvasWidth) * 100));
          adjustment.y = Math.max(-48, Math.min(18, Number(bloom.dataset.dragOriginY) - dy / Number(bloom.dataset.canvasHeight) * 100));
        }
        selectedFlowerIndex = index;
        renderBuilder();
        delete bloom.dataset.dragStartX;
        delete bloom.dataset.dragStartY;
      });
      const image = $("img", bloom);
      image?.addEventListener("error", () => {
        bloom.classList.add("asset-missing");
        image.remove();
      }, { once: true });
    });
  }

  flowerOptions?.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-qty-change]");
    if (!quantityButton || quantityButton.disabled) return;

    const id = quantityButton.dataset.flowerId;
    const change = Number(quantityButton.dataset.qtyChange);
    if (!flowerData[id]) return;

    if (change > 0) {
      if (selectedFlowers.length >= MAX_FLOWERS) {
        showToast(`Maximum ${MAX_FLOWERS} stems per bouquet`);
        return;
      }
      selectedFlowers.push(id);
      flowerAdjustments.push({ uid: nextFlowerInstanceId++, angle: 0, scale: 1, x: 0, y: 0, layer: selectedFlowers.length });
      selectedFlowerIndex = selectedFlowers.length - 1;
    } else {
      const index = selectedFlowers.lastIndexOf(id);
      if (index !== -1) {
        selectedFlowers.splice(index, 1);
        flowerAdjustments.splice(index, 1);
        if (selectedFlowerIndex === index) selectedFlowerIndex = selectedFlowers.length ? Math.min(index, selectedFlowers.length - 1) : -1;
        else if (selectedFlowerIndex > index) selectedFlowerIndex -= 1;
      }
    }

    renderBuilder();
  });

  $("#flowerCategory")?.addEventListener("change", renderFlowerOptions);

  $("#flowerInstanceSelect")?.addEventListener("change", (event) => {
    selectedFlowerIndex = Number(event.target.value);
    if (!Number.isInteger(selectedFlowerIndex) || !selectedFlowers[selectedFlowerIndex]) selectedFlowerIndex = -1;
    renderBuilder();
  });

  $("#autoArrange")?.addEventListener("click", () => {
    autoArrangeEnabled = true;
    selectedFlowerIndex = -1;
    renderBuilder();
  });

  $("#manualArrange")?.addEventListener("click", () => {
    autoArrangeEnabled = false;
    selectedFlowerIndex = selectedFlowers.length ? 0 : -1;
    renderBuilder();
  });

  $("#flowersTab")?.addEventListener("click", () => setMaterialTab("flowers"));
  $("#wrappingTab")?.addEventListener("click", () => setMaterialTab("wrapping"));
  wrappingOptions?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-wrap-value]");
    if (!option || !wrapping) return;
    wrapping.value = option.dataset.wrapValue;
    renderBuilder();
  });

  $("#flowerControls")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-flower-control]");
    if (!button || button.disabled || autoArrangeEnabled || selectedFlowerIndex < 0) return;
    const adjustment = flowerAdjustments[selectedFlowerIndex];
    if (!adjustment) return;
    switch (button.dataset.flowerControl) {
      case "rotate-left": adjustment.angle = Math.max(-65, adjustment.angle - 5); break;
      case "rotate-right": adjustment.angle = Math.min(65, adjustment.angle + 5); break;
      case "smaller": adjustment.scale = Math.max(0.55, +(adjustment.scale - 0.05).toFixed(2)); break;
      case "larger": adjustment.scale = Math.min(1.5, +(adjustment.scale + 0.05).toFixed(2)); break;
      case "reset-one": Object.assign(adjustment, { angle: 0, scale: 1, x: 0, y: 0, layer: selectedFlowerIndex + 1 }); break;
      case "backward":
      case "forward":
      case "send-back":
      case "bring-front": {
        const order = flowerAdjustments.map((item, index) => index).sort((a, b) => flowerAdjustments[a].layer - flowerAdjustments[b].layer || a - b);
        const position = order.indexOf(selectedFlowerIndex);
        if (button.dataset.flowerControl === "backward" && position > 0) [order[position - 1], order[position]] = [order[position], order[position - 1]];
        if (button.dataset.flowerControl === "forward" && position < order.length - 1) [order[position + 1], order[position]] = [order[position], order[position + 1]];
        if (button.dataset.flowerControl === "send-back") { order.splice(position, 1); order.unshift(selectedFlowerIndex); }
        if (button.dataset.flowerControl === "bring-front") { order.splice(position, 1); order.push(selectedFlowerIndex); }
        order.forEach((index, rank) => { flowerAdjustments[index].layer = rank + 1; });
        break;
      }
    }
    renderBuilder();
  });

  ["X", "Y"].forEach((axis) => {
    $(`#flowerPosition${axis}`)?.addEventListener("change", (event) => {
      if (autoArrangeEnabled || selectedFlowerIndex < 0) return;
      const adjustment = flowerAdjustments[selectedFlowerIndex];
      if (!adjustment) return;
      adjustment[axis.toLowerCase()] = Number(event.target.value);
      renderBuilder();
    });
  });

  wrapping?.addEventListener("change", renderBuilder);
  wrappingScale?.addEventListener("input", (event) => {
    currentWrappingScale = Number(event.target.value);
    updateWrappingPreview();
  });

  $("#cancelBouquetEdit")?.addEventListener("click", () => {
    editingCartIndex = null; selectedFlowers.length = 0; flowerAdjustments.length = 0;
    selectedFlowerIndex = -1; autoArrangeEnabled = true;
    if (wrapping) wrapping.value = "0"; currentWrappingScale = 100;
    if (wrappingScale) wrappingScale.value = "100";
    if ($("#customBouquetName")) $("#customBouquetName").value = "";
    renderBuilder(); showToast("Bouquet editing cancelled");
  });

  $("#resetBouquet")?.addEventListener("click", () => {
    // Reset only builder state; saved cart data changes only on explicit update.
    editingCartIndex = null;
    selectedFlowers.length = 0;
    flowerAdjustments.length = 0;
    selectedFlowerIndex = -1;
    autoArrangeEnabled = true;
    if (wrapping) wrapping.value = "0";
    currentWrappingScale = 100;
    if (wrappingScale) wrappingScale.value = "100";
    const bouquetNameInput = $("#customBouquetName");
    if (bouquetNameInput) bouquetNameInput.value = "";
    renderBuilder();
    showToast("Your arrangement has been reset");
  });

  $("#addBouquet")?.addEventListener("click", () => {
    if (!selectedFlowers.length) return;

    const customBouquetNameInput = $("#customBouquetName");
    const customBouquetName = String(customBouquetNameInput?.value || "").trim();
    if (!customBouquetName) {
      showToast("Please give your bouquet a name");
      customBouquetNameInput?.focus();
      return;
    }

    const flowerTotal = selectedFlowers.reduce(
      (sum, id) => sum + flowerData[id].price,
      0,
    );
    const total = flowerTotal + Number(wrapping?.value || 0);

    const counts = selectedFlowers.reduce((result, id) => {
      result[id] = (result[id] || 0) + 1;
      return result;
    }, {});

    const details = Object.entries(counts)
      .map(
        ([id, quantity]) =>
          `${quantity > 1 ? `${quantity}x ` : ""}${flowerData[id].name}`,
      )
      .join(", ");

    const wrapLabel =
      wrapping?.options[wrapping.selectedIndex]?.text.split(" — ")[0] ||
      "No wrapping";

    const configuration = {
      flowers: selectedFlowers.map((id, index) => {
        const flower = flowerData[id];
        const adjustment = flowerAdjustments[index] || {};
        const autoPose = (bouquetLayouts[selectedFlowers.length] || bouquetLayouts[12])[index] || [50, 0, 0.76];
        const x = autoArrangeEnabled ? getAutoX(index, selectedFlowers.length) : Math.max(8, Math.min(92, 50 + (adjustment.x || 0)));
        return {
          id,
          angle: autoArrangeEnabled ? autoPose[1] : Number(adjustment.angle) || 0,
          scale: autoArrangeEnabled ? autoPose[2] : Number(adjustment.scale) || 1,
          x,
          y: autoArrangeEnabled ? 0 : Number(adjustment.y) || 0,
          layer: autoArrangeEnabled ? index + 1 : Number(adjustment.layer) || index + 1,
          width: flower.category === "addons" || flower.category === "greenery" ? 30 : flower.category === "hydrangea" ? 38 : 34,
        };
      }),
      wrapping: wrapping?.value || "0",
      wrappingScale: currentWrappingScale,
    };

    const updatedItem = {
      name: customBouquetName, price: total, icon: "💐", quantity: 1,
      detail: `${selectedFlowers.length} ${selectedFlowers.length === 1 ? "stem" : "stems"} · ${wrapping?.value === "0" ? details : `${details}; ${wrapLabel}`}`,
      configuration,
    };
    if (editingCartIndex !== null) {
      const target = cart[editingCartIndex];
      if (!target) { editingCartIndex = null; showToast("Cart item no longer exists. Add this bouquet again."); renderBuilder(); return; }
      target.name = updatedItem.name; target.price = updatedItem.price; target.icon = updatedItem.icon;
      target.detail = updatedItem.detail; target.configuration = updatedItem.configuration; target.previewExpanded = true;
      editingCartIndex = null;
      renderCart(); renderBuilder(); showToast("Bouquet updated in your cart"); openCart();
      return;
    }
    addToCart(updatedItem);
    openCart();
  });

  /* =====================================================
     8. GUEST CHECKOUT — FORM + ORDER SUMMARY
  ===================================================== */

  const checkoutDialog = $("#checkoutDialog");
  const checkoutForm = $("#checkoutForm");
  const checkoutPanel = $("#checkoutPanel");
  const orderSuccess = $("#orderSuccess");
  const checkoutShipping = $("#checkoutShipping");
  const customerPhoneInput = $("#customerPhone");
  const qrisCode = $("#qrisCode");
  const successQrisCode = $("#successQrisCode");
  let currentOrder = null;

  function normalizeIndonesianPhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("0")) return `62${digits.slice(1)}`;
    if (digits.startsWith("8")) return `62${digits}`;
    return digits;
  }

  function isValidIndonesianPhone(phone) {
    return /^628[0-9]{8,11}$/.test(phone);
  }

  customerPhoneInput?.addEventListener("input", () => {
    customerPhoneInput.value = normalizeIndonesianPhone(customerPhoneInput.value);
    customerPhoneInput.setCustomValidity("");
  });

  function shippingValue() {
    return Number(checkoutShipping?.value || 0);
  }

  function renderOrderItems(target, items) {
    if (!target) return;

    if (!items.length) {
      target.innerHTML =
        '<p class="checkout-items-empty">No items in this order.</p>';
      return;
    }

    target.innerHTML = items
      .map(
        (item) => `
      <div class="checkout-order-item">
        <span>
          <strong>${escapeHTML(item.name)}</strong>
          ${item.detail ? `<small>${escapeHTML(item.detail)}</small>` : ""}
          <small>Qty ${item.quantity}</small>
        </span>
        <strong>${money(item.price * item.quantity)}</strong>
      </div>
    `,
      )
      .join("");
  }

  function updateCheckoutTotals() {
    if (!checkoutDialog) return;

    const subtotal = cartSubtotalValue();
    const shipping = shippingValue();

    if ($("#checkoutSubtotal"))
      $("#checkoutSubtotal").textContent = money(subtotal);
    if ($("#checkoutShippingCost"))
      $("#checkoutShippingCost").textContent = money(shipping);
    if ($("#checkoutGrandTotal"))
      $("#checkoutGrandTotal").textContent = money(subtotal + shipping);

    renderOrderItems($("#checkoutItems"), cart);
  }

  function openCheckout() {
    if (!cart.length) return;
    if (!checkoutDialog || typeof checkoutDialog.showModal !== "function") {
      showToast("Checkout dialog is not supported in this browser.");
      return;
    }

    closeCart(false);
    checkoutForm?.reset();
    if (qrisCode) qrisCode.hidden = true;
    const submitButton = $(".checkout-submit");
    if (submitButton) submitButton.disabled = false;
    if (checkoutForm) checkoutForm.hidden = false;
    if (checkoutPanel) checkoutPanel.hidden = false;
    if (orderSuccess) orderSuccess.hidden = true;

    checkoutDialog.showModal();
    updateCheckoutTotals();
    $("#customerName")?.focus();
  }

  $("#checkoutButton")?.addEventListener("click", openCheckout);
  checkoutForm
    ?.querySelectorAll('input[name="paymentMethod"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        if (qrisCode) qrisCode.hidden = input.value !== "QRIS";
      });
    });
  checkoutShipping?.addEventListener("change", updateCheckoutTotals);
  $("#closeCheckout")?.addEventListener("click", () => checkoutDialog?.close());
  $("#closeCheckoutSuccess")?.addEventListener("click", () =>
    checkoutDialog?.close(),
  );

  checkoutDialog?.addEventListener("click", (event) => {
    if (event.target === checkoutDialog) checkoutDialog.close();
  });

  checkoutDialog?.addEventListener("close", () => {
    $("#cartButton")?.focus();
  });

  /* =====================================================
     9. ORDER STORAGE + CONFIRMATION
  ===================================================== */

  function saveOrder(order) {
    const orders = readArray(ORDER_STORAGE_KEY);
    orders.unshift(order);
    return writeStorage(ORDER_STORAGE_KEY, orders.slice(0, 30));
  }

  const orderHistoryDialog = $("#orderHistoryDialog");
  const orderHistoryList = $("#orderHistoryList");

  function renderOrderHistory() {
    if (!orderHistoryList) return;
    const orders = readArray(ORDER_STORAGE_KEY);
    if (!orders.length) {
      orderHistoryList.innerHTML = '<p class="history-empty">Belum ada pesanan tersimpan di browser ini.</p>';
      return;
    }
    orderHistoryList.innerHTML = orders.slice(0, 20).map((order) => {
      const date = order.createdAt ? new Date(order.createdAt) : null;
      const dateLabel = date && !Number.isNaN(date.getTime())
        ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date)
        : "Tanggal tidak tersedia";
      const status = ORDER_STAGES[Math.min(Math.max(Number(order.statusIndex) || 0, 0), ORDER_STAGES.length - 1)];
      const itemSummary = (order.items || []).map((item) => `${escapeHTML(item.name)} ×${Math.max(1, Number(item.quantity) || 1)}`).join(" · ");
      return `<article class="history-order"><div class="history-order-top"><strong>${escapeHTML(order.orderId || "Order")}</strong><span>${escapeHTML(status)}</span></div><small>${escapeHTML(dateLabel)}</small><p>${itemSummary || "Order details unavailable"}</p><div class="history-order-bottom"><span>${money(Number(order.total) || ((order.items || []).reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0) + (Number(order.shipping) || 0)))}</span><small>${escapeHTML(order.customer?.name || "Guest")}</small></div></article>`;
    }).join("");
  }

  $("#openOrderHistory")?.addEventListener("click", () => {
    renderOrderHistory();
    if (orderHistoryDialog?.showModal) {
      closeCart(false);
      orderHistoryDialog.showModal();
    } else {
      showToast("Order history dialog is not supported in this browser.");
    }
  });
  $("#closeOrderHistory")?.addEventListener("click", () => orderHistoryDialog?.close());
  orderHistoryDialog?.addEventListener("click", (event) => {
    if (event.target === orderHistoryDialog) orderHistoryDialog.close();
  });
  orderHistoryDialog?.addEventListener("close", () => $("#cartButton")?.focus());

  function renderTracking(order) {
    const timeline = $("#trackingTimeline");
    if (!timeline) return;

    const descriptions = [
      "Order has been received.",
      "The florist is preparing your arrangement.",
      "Your order has been handed to the courier.",
      "Your order has reached the customer.",
    ];

    timeline.innerHTML = ORDER_STAGES.map((stage, index) => {
      const state =
        index < order.statusIndex
          ? "completed"
          : index === order.statusIndex
            ? "current"
            : "";
      const marker = index < order.statusIndex ? "✓" : String(index + 1);
      return `
        <div class="tracking-step ${state}">
          <span class="tracking-dot">${marker}</span>
          <div>
            <strong>${stage}</strong>
            <small>${descriptions[index]}</small>
          </div>
        </div>
      `;
    }).join("");

    const advanceButton = $("#advanceOrderStatus");
    if (advanceButton) {
      const isDelivered = order.statusIndex >= ORDER_STAGES.length - 1;
      advanceButton.disabled = isDelivered;
      advanceButton.textContent = isDelivered
        ? "Order delivered"
        : `Demo: advance to ${ORDER_STAGES[order.statusIndex + 1]}`;
    }
  }

  function getOrderAddress(customer) {
    return [
      customer.address,
      customer.district,
      customer.city,
      customer.province,
      customer.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  }

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cart.length || !checkoutForm.reportValidity()) return;
    const normalizedPhone = normalizeIndonesianPhone(customerPhoneInput?.value);
    if (!isValidIndonesianPhone(normalizedPhone)) {
      customerPhoneInput?.setCustomValidity("Gunakan nomor WhatsApp Indonesia yang valid, contoh 081234567890.");
      customerPhoneInput?.reportValidity();
      return;
    }
    customerPhoneInput?.setCustomValidity("");
    if (customerPhoneInput) customerPhoneInput.value = normalizedPhone;

    const data = new FormData(checkoutForm);
    const subtotal = cartSubtotalValue();
    const shipping = shippingValue();
    const randomSuffix = Math.random().toString(36).slice(2, 4).toUpperCase();
    const orderId = `LRM-${Date.now().toString().slice(-8)}-${randomSuffix}`;

    currentOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: String(data.get("customerName") || "").trim(),
        phone: normalizedPhone,
        province: String(data.get("province") || "").trim(),
        city: String(data.get("city") || "").trim(),
        district: String(data.get("district") || "").trim(),
        postalCode: String(data.get("postalCode") || "").trim(),
        address: String(data.get("address") || "").trim(),
        notes: String(data.get("deliveryNotes") || "").trim(),
      },
      payment: String(data.get("paymentMethod") || ""),
      shippingLabel:
        checkoutShipping?.selectedOptions[0]?.textContent.trim() ||
        "Shipping simulation",
      items: cart.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total: subtotal + shipping,
      statusIndex: 0,
    };
    if (successQrisCode)
      successQrisCode.hidden = currentOrder.payment !== "QRIS";

    const orderSaved = saveOrder(currentOrder);
    const submitButton = $(".checkout-submit");
    if (!orderSaved) {
      if (submitButton) submitButton.disabled = false;
      showToast("Pesanan gagal disimpan. Keranjang Anda tetap aman; coba lagi.");
      return;
    }

    renderOrderHistory();
    if (submitButton) submitButton.disabled = true;
    cart.length = 0;
    renderCart();

    if (checkoutForm) checkoutForm.hidden = true;
    if (checkoutPanel) checkoutPanel.hidden = true;
    if (orderSuccess) orderSuccess.hidden = false;

    if ($("#successOrderNumber"))
      $("#successOrderNumber").textContent = currentOrder.orderId;
    if ($("#successOrderName"))
      $("#successOrderName").textContent = currentOrder.customer.name;
    if ($("#successPayment"))
      $("#successPayment").textContent = currentOrder.payment;
    if ($("#successOrderTotal"))
      $("#successOrderTotal").textContent = money(currentOrder.total);
    if ($("#successShippingCost"))
      $("#successShippingCost").textContent = money(currentOrder.shipping);
    if ($("#successDeliveryAddress"))
      $("#successDeliveryAddress").textContent = getOrderAddress(
        currentOrder.customer,
      );

    renderOrderItems($("#successOrderItems"), currentOrder.items);
    renderTracking(currentOrder);

    const feedback = $("#whatsappFeedback");
    if (feedback) {
      feedback.textContent =
        "Demo order saved in this browser. Payment has not been verified.";
    }
  });

  /* =====================================================
     10. DEMO DELIVERY STATUS
  ===================================================== */

  $("#advanceOrderStatus")?.addEventListener("click", () => {
    if (!currentOrder || currentOrder.statusIndex >= ORDER_STAGES.length - 1)
      return;

    currentOrder.statusIndex += 1;
    const orders = readArray(ORDER_STORAGE_KEY);
    const existingIndex = orders.findIndex(
      (order) => order.orderId === currentOrder.orderId,
    );

    if (existingIndex >= 0) {
      orders[existingIndex] = currentOrder;
      writeStorage(ORDER_STORAGE_KEY, orders);
    }

    renderTracking(currentOrder);
  });

  /* =====================================================
     11. WHATSAPP ORDER CONFIRMATION
  ===================================================== */

  $("#sendWhatsAppOrder")?.addEventListener("click", () => {
    if (!currentOrder) return;

    const customer = currentOrder.customer;
    const address = getOrderAddress(customer);
    const itemLines = currentOrder.items.map(
      (item) =>
        `- ${item.name}${item.detail ? ` (${item.detail})` : ""} x${item.quantity}: ${money(item.price * item.quantity)}`,
    );

    const message = [
      `Halo D’YFleur, saya ingin konfirmasi pesanan ${currentOrder.orderId}.`,
      `Nama: ${customer.name}`,
      `WhatsApp: ${customer.phone}`,
      `Alamat: ${address}`,
      `Catatan kurir: ${customer.notes || "-"}`,
      `Pembayaran: ${currentOrder.payment}`,
      `Pengiriman: ${currentOrder.shippingLabel}`,
      ...itemLines,
      `Subtotal: ${money(currentOrder.subtotal)}`,
      `Ongkir: ${money(currentOrder.shipping)}`,
      `TOTAL: ${money(currentOrder.total)}`,
      "Catatan: pembayaran belum diverifikasi oleh sistem.",
    ].join("\n");

    const feedback = $("#whatsappFeedback");
    const internationalNumber = WHATSAPP_NUMBER.replace(/^0/, "62");
    if (!/^62\d{8,15}$/.test(internationalNumber)) {
      if (feedback)
        feedback.textContent =
          "Nomor WhatsApp toko belum diatur. Isi WHATSAPP_NUMBER di script.js sebelum demo.";
      return;
    }

    const url = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(url, "_blank");

    if (popup) {
      popup.opener = null;
      if (feedback)
        feedback.textContent =
          "Pesanan siap dikirim melalui WhatsApp. Periksa kembali detail sebelum mengirim.";
    } else if (feedback) {
      feedback.textContent =
        "Browser memblokir tab baru. Izinkan pop-up lalu coba kembali.";
    }
  });

  /* =====================================================
     12. KEYBOARD SUPPORT
  ===================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (cartDrawer?.classList.contains("open")) closeCart();
      if (mainNav?.classList.contains("open")) {
        closeMenu();
        menuToggle?.focus();
      }
    }

    if (event.key === "Tab" && cartDrawer?.classList.contains("open")) {
      const focusable = $$(
        'button:not([disabled]), a[href], select, input, [tabindex]:not([tabindex="-1"])',
        cartDrawer,
      ).filter(
        (element) =>
          !element.hidden && element.getAttribute("aria-hidden") !== "true",
      );

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !cartDrawer.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !cartDrawer.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* =====================================================
     13. INITIAL STATE
  ===================================================== */

  selectShopProduct(activeProductId);
  updateShopListing();
  renderBuilder();
  renderCart();
})();

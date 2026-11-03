const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia("(max-width: 720px)").matches) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      navigation.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      navigation.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const setupImageSlots = (root) => {
  root.querySelectorAll("[data-image-slot]").forEach((image) => {
    const imageFrame = image.closest(".image-frame, .appliance-card-icon, .category-image");
    const updateImageState = () => {
      const hasImage = image.naturalWidth > 0;
      imageFrame.classList.toggle("has-image", hasImage);
      imageFrame.closest(".category-card")?.classList.toggle("has-image", hasImage);
    };

    image.addEventListener("load", updateImageState, { once: true });
    image.addEventListener("error", updateImageState, { once: true });
    if (image.complete) updateImageState();
  });
};

setupImageSlots(document);

const createProductIllustration = (division, product) => {
  const { model, name } = product;
  const seed = Array.from(model).reduce((value, character) => value + character.charCodeAt(0), 0);
  const accent = ["#2875f0", "#12a6a0", "#7062d9", "#e79a36", "#4385b7", "#d4687a"][seed % 6];
  const screen = `<defs>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${accent}" />
      <stop offset="1" stop-color="#142d58" />
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0.9" y2="1">
      <stop stop-color="#fff" />
      <stop offset="1" stop-color="#dce6f3" />
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#365477" flood-opacity=".16" />
    </filter>
  </defs>`;
  const finish = `<ellipse cx="210" cy="254" rx="118" ry="13" fill="#dce7f5" opacity=".7" />`;
  let appliance;

  if (division.slug === "television") {
    if (model.startsWith("WTV")) {
      const width = 218 + (seed % 4) * 12;
      const x = (420 - width) / 2;
      appliance = `<g filter="url(#shadow)">
        <rect x="${x}" y="48" width="${width}" height="151" rx="9" fill="#18243a" />
        <rect x="${x + 7}" y="55" width="${width - 14}" height="137" rx="5" fill="url(#screen)" />
        <path d="M${x + 18} 166 Q${x + width / 2} 94 ${x + width - 18} 135 V187 H${x + 18}Z" fill="#fff" opacity=".14" />
        <path d="M185 200h50l12 28h-74z" fill="#53657d" />
        <path d="M161 229h98" stroke="#24344e" stroke-width="8" stroke-linecap="round" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="76" y="146" width="268" height="43" rx="11" fill="#26354a" />
        <rect x="90" y="155" width="240" height="8" rx="4" fill="#8292a7" opacity=".5" />
        <circle cx="322" cy="178" r="3" fill="${accent}" />
        <rect x="96" y="60" width="42" height="148" rx="7" fill="#202c40" />
        <rect x="282" y="60" width="42" height="148" rx="7" fill="#202c40" />
        <circle cx="117" cy="112" r="7" fill="#8493a8" /><circle cx="303" cy="112" r="7" fill="#8493a8" />
        <path d="M108 171h18m186 0h18" stroke="#a8b5c5" stroke-width="3" stroke-linecap="round" />
      </g>`;
    }
  } else if (division.slug === "refrigeration") {
    if (model.startsWith("WCF")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="90" y="111" width="240" height="112" rx="18" fill="url(#metal)" stroke="#c5d2e2" stroke-width="3" />
        <path d="M91 137h238" stroke="#aab9ca" stroke-width="4" />
        <path d="M112 114v-13q0-12 12-12h34" fill="none" stroke="#63758c" stroke-width="5" stroke-linecap="round" />
        <path d="M309 157v31" stroke="#a3b2c5" stroke-width="5" stroke-linecap="round" />
        <circle cx="130" cy="228" r="8" fill="#74849a" /><circle cx="290" cy="228" r="8" fill="#74849a" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="125" y="39" width="170" height="203" rx="13" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <path d="M210 42v197" stroke="#c3cfdd" stroke-width="3" />
        <path d="M267 91v53m-115-53v53" stroke="#8495aa" stroke-width="5" stroke-linecap="round" />
        <path d="M137 58h61v7h-61zm85 0h61v7h-61z" fill="${accent}" opacity=".72" />
        <path d="M139 221h142" stroke="#d0dbe8" stroke-width="2" />
      </g>`;
    }
  } else if (division.slug === "air-conditioning") {
    if (Number(model.match(/\d+/)?.[0]) >= 36) {
      appliance = `<g filter="url(#shadow)">
        <rect x="145" y="35" width="130" height="209" rx="17" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="161" y="54" width="98" height="18" rx="6" fill="${accent}" opacity=".82" />
        <path d="M163 176h94m-90 11h86m-79 11h72" stroke="#8294aa" stroke-width="4" stroke-linecap="round" />
        <circle cx="210" cy="101" r="20" fill="#eaf1f8" stroke="#c6d3e2" stroke-width="3" />
        <path d="M210 83v36m-18-18h36m-31-13 26 26m0-26-26 26" stroke="${accent}" stroke-width="3" opacity=".72" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="72" y="82" width="276" height="85" rx="17" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="91" y="100" width="238" height="12" rx="6" fill="#d8e2ee" />
        <path d="M98 139h210" stroke="#8fa0b4" stroke-width="5" stroke-linecap="round" />
        <circle cx="312" cy="125" r="5" fill="${accent}" />
      </g>`;
    }
  } else if (division.slug === "laundry") {
    if (model.endsWith("T")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="125" y="48" width="170" height="192" rx="15" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="143" y="66" width="134" height="47" rx="8" fill="#f3f7fb" stroke="#d4deea" stroke-width="2" />
        <circle cx="260" cy="89" r="10" fill="${accent}" />
        <path d="M151 132h118" stroke="#b7c5d5" stroke-width="3" />
        <rect x="146" y="146" width="128" height="74" rx="11" fill="#eef3f8" stroke="#d1dce8" stroke-width="2" />
        <path d="M162 169h96" stroke="#aab9c9" stroke-width="4" stroke-linecap="round" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="125" y="39" width="170" height="203" rx="15" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="143" y="55" width="134" height="30" rx="7" fill="#eef3f8" />
        <circle cx="257" cy="70" r="7" fill="${accent}" />
        <circle cx="210" cy="158" r="48" fill="#9dafc3" />
        <circle cx="210" cy="158" r="37" fill="#e6f0fa" />
        <circle cx="210" cy="158" r="27" fill="#bfd3e8" />
        <path d="M158 222h104" stroke="#d2dce7" stroke-width="3" />
      </g>`;
    }
  } else if (division.slug === "kitchen") {
    if (model.startsWith("WK")) {
      appliance = `<g filter="url(#shadow)">
        <path d="M153 99q0-16 17-16h82q17 0 17 16v105q0 12-13 12h-90q-13 0-13-12z" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <path d="M269 121h24q18 0 18 18v35q0 18-18 18h-24" fill="none" stroke="#8fa1b6" stroke-width="9" />
        <path d="M167 113h87v58h-87z" fill="#e8f3fb" stroke="#c5d5e5" stroke-width="2" />
        <path d="M185 99q25-27 50 0" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" />
        <path d="M148 218h128" stroke="#8698ad" stroke-width="7" stroke-linecap="round" />
      </g>`;
    } else if (model.startsWith("WB-")) {
      appliance = `<g filter="url(#shadow)">
        <path d="M163 53h94l-9 102q-2 17-18 17h-40q-16 0-18-17z" fill="#f5f8fc" stroke="#bccada" stroke-width="3" />
        <path d="M169 112h82l-5 41q-2 13-16 13h-39q-14 0-16-13z" fill="${accent}" opacity=".24" />
        <path d="M182 57h56" stroke="${accent}" stroke-width="7" stroke-linecap="round" />
        <rect x="150" y="173" width="120" height="62" rx="12" fill="#53657c" />
        <rect x="169" y="185" width="82" height="25" rx="6" fill="#263750" />
        <circle cx="210" cy="222" r="5" fill="#e8eef6" />
      </g>`;
    } else if (model.startsWith("WAF")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="139" y="49" width="142" height="185" rx="28" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="160" y="68" width="100" height="34" rx="11" fill="#263750" />
        <circle cx="181" cy="85" r="7" fill="${accent}" /><circle cx="205" cy="85" r="7" fill="#8396ad" />
        <path d="M161 117h98v82q0 17-17 17h-64q-17 0-17-17z" fill="#dce5ef" stroke="#b6c5d6" stroke-width="3" />
        <path d="M167 137h86v50q0 14-14 14h-58q-14 0-14-14z" fill="#8295ad" opacity=".55" />
        <path d="M177 222h66" stroke="#53657c" stroke-width="6" stroke-linecap="round" />
      </g>`;
    } else if (model.startsWith("WMO")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="88" y="69" width="244" height="154" rx="15" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="104" y="86" width="160" height="120" rx="9" fill="#eaf2fa" stroke="#aebed0" stroke-width="3" />
        <path d="M118 177q28-62 62-22t68-11v53H118z" fill="${accent}" opacity=".45" />
        <rect x="276" y="88" width="39" height="23" rx="5" fill="#263750" />
        <circle cx="289" cy="133" r="6" fill="${accent}" /><circle cx="306" cy="133" r="6" fill="#8798ad" />
        <path d="M280 164h30m-30 13h30" stroke="#9eafc2" stroke-width="4" stroke-linecap="round" />
      </g>`;
    } else if (model.startsWith("WTO")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="125" y="75" width="170" height="144" rx="16" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <path d="M160 75v-26m100 26V49" stroke="#65778e" stroke-width="8" stroke-linecap="round" />
        <rect x="148" y="109" width="124" height="72" rx="14" fill="#e8eef6" stroke="#c0cddd" stroke-width="3" />
        <path d="M158 143h104" stroke="#aab9ca" stroke-width="5" />
        <circle cx="160" cy="199" r="5" fill="${accent}" /><circle cx="181" cy="199" r="5" fill="#8294aa" />
      </g>`;
    } else if (model.startsWith("WOV") || model.startsWith("WDW")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="128" y="34" width="164" height="211" rx="11" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="145" y="49" width="130" height="27" rx="7" fill="#263750" />
        <circle cx="162" cy="62" r="5" fill="${accent}" /><circle cx="181" cy="62" r="5" fill="#9aa9bb" />
        <rect x="145" y="91" width="130" height="129" rx="8" fill="#dce7f2" stroke="#afbed0" stroke-width="3" />
        <rect x="154" y="104" width="112" height="93" rx="7" fill="#536a84" />
        <path d="M164 151h92m-92 21h92" stroke="#bfcedd" stroke-width="4" />
        <path d="M159 230h102" stroke="#8b9db2" stroke-width="4" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="112" y="40" width="196" height="202" rx="12" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <path d="M126 84h168M126 99h168" stroke="#8c9db1" stroke-width="4" />
        <rect x="131" y="112" width="158" height="107" rx="8" fill="#36485f" />
        <path d="M145 128h130v77H145z" fill="#273750" />
        <circle cx="164" cy="132" r="18" fill="#c6d3e2" stroke="#8496ac" stroke-width="4" />
        <circle cx="254" cy="132" r="18" fill="#c6d3e2" stroke="#8496ac" stroke-width="4" />
        <path d="M164 132h90" stroke="${accent}" stroke-width="4" opacity=".8" />
      </g>`;
    }
  } else if (division.slug === "water-home") {
    if (model.startsWith("WWD")) {
      appliance = `<g filter="url(#shadow)">
        <path d="M166 88V57q0-20 20-20h48q20 0 20 20v31" fill="#b9d6f1" stroke="#8ba9c8" stroke-width="4" />
        <path d="M147 88h126v145q0 12-12 12h-102q-12 0-12-12z" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="164" y="110" width="92" height="67" rx="8" fill="#e7f2fc" />
        <path d="M184 189v25m48-25v25" stroke="${accent}" stroke-width="8" stroke-linecap="round" />
        <path d="M178 220h60" stroke="#93a5ba" stroke-width="4" />
      </g>`;
    } else if (model.startsWith("WWP") || model.startsWith("WWH")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="151" y="39" width="118" height="205" rx="23" fill="url(#metal)" stroke="#c6d3e2" stroke-width="3" />
        <rect x="169" y="57" width="82" height="36" rx="10" fill="#edf4fb" />
        <circle cx="210" cy="75" r="8" fill="${accent}" />
        <path d="M164 111h92m-92 18h92m-92 18h92m-92 18h92" stroke="#cfdae7" stroke-width="3" />
        <path d="M174 193h72" stroke="#8496ac" stroke-width="5" stroke-linecap="round" />
        <path d="M177 233v12m66-12v12" stroke="#65778d" stroke-width="5" />
      </g>`;
    } else if (model.startsWith("WSF") || model.startsWith("WCF")) {
      appliance = `<g filter="url(#shadow)">
        <circle cx="210" cy="108" r="57" fill="#f2f7fc" stroke="#aebed0" stroke-width="5" />
        <circle cx="210" cy="108" r="11" fill="${accent}" />
        <path d="M210 99q-5-39 9-37 14 5-4 41m4 8q38-8 39 7 0 14-42 2m-13-4q-24 31-35 18-9-11 34-28m8-5q9-36-5-39" fill="${accent}" opacity=".76" />
        <path d="M210 166v59m-39 10h78l-39-10z" fill="#dce6f1" stroke="#91a2b7" stroke-width="4" stroke-linejoin="round" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <path d="M181 70q29-31 58 0l38 55q16 22-4 34l-14 10 29 39q10 15-6 26l-15 10q-15 10-26-5l-33-46-34 25q-16 11-27-5l-10-14q-10-15 5-27l45-37-23-33q-11-16 2-32z" fill="url(#metal)" stroke="#aebed0" stroke-width="4" />
        <path d="M208 111q17-16 34 1m-56 55 42-31" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" />
        <circle cx="222" cy="89" r="12" fill="#dce8f4" />
      </g>`;
    }
  } else {
    if (model.startsWith("WSI") || model.startsWith("WLB")) {
      appliance = `<g filter="url(#shadow)">
        <rect x="119" y="42" width="182" height="200" rx="16" fill="#edf3f9" stroke="#b9c8d8" stroke-width="4" />
        <rect x="137" y="60" width="146" height="66" rx="11" fill="#263750" />
        <rect x="151" y="74" width="72" height="34" rx="5" fill="#b7e5d7" />
        <path d="m187 78-14 17h15l-9 12 27-22h-16l9-7z" fill="${accent}" />
        <circle cx="253" cy="80" r="6" fill="#56c797" /><circle cx="253" cy="103" r="6" fill="#f1b85e" />
        <path d="M144 151h132m-132 18h132m-132 18h132" stroke="#c2cfdd" stroke-width="5" stroke-linecap="round" />
        <path d="M155 232v11m110-11v11" stroke="#6b7d93" stroke-width="5" />
      </g>`;
    } else if (model.startsWith("WSP")) {
      appliance = `<g filter="url(#shadow)">
        <path d="m71 115 119-54 161 55-121 62z" fill="#263750" stroke="#14243a" stroke-width="4" />
        <path d="m89 115 102-45 134 46-104 52z" fill="#3472b8" />
        <path d="m133 96 10 47m40-61 8 64m38-50 7 64m38-50 8 64m-126-73 135 45m-174-29 135 45" stroke="#b5d5f5" stroke-width="3" opacity=".7" />
        <path d="M119 177h182v50H119z" fill="#e8eff7" stroke="#bdcbd9" stroke-width="3" />
        <path d="M140 193h139m-139 15h139" stroke="${accent}" stroke-width="4" opacity=".7" />
      </g>`;
    } else {
      appliance = `<g filter="url(#shadow)">
        <rect x="104" y="57" width="212" height="168" rx="26" fill="#dfe8f2" stroke="#aebed0" stroke-width="4" />
        <rect x="122" y="74" width="176" height="128" rx="18" fill="#263750" />
        <rect x="143" y="91" width="76" height="44" rx="8" fill="#b7e5d7" />
        <path d="m181 96-20 23h21l-10 13 32-27h-21l8-9z" fill="${accent}" />
        <circle cx="265" cy="97" r="7" fill="#56c797" />
        <path d="M151 158h118m-118 13h84" stroke="#91a3b8" stroke-width="5" stroke-linecap="round" />
        <path d="M137 225v10m150-10v10" stroke="#6b7d93" stroke-width="5" />
      </g>`;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280">
    ${screen}
    <rect width="420" height="280" rx="18" fill="#f5f8fd" />
    <circle cx="${75 + (seed % 260)}" cy="${54 + (seed % 28)}" r="82" fill="${accent}" opacity=".055" />
    ${finish}
    ${appliance}
    <rect x="18" y="18" width="5" height="28" rx="2.5" fill="${accent}" opacity=".72" />
    <circle cx="36" cy="31" r="3" fill="${accent}" opacity=".45" />
    <rect x="319" y="239" width="82" height="23" rx="11.5" fill="#fff" stroke="#dce6f2" />
    <text x="360" y="254" fill="#43556e" font-family="Arial,sans-serif" font-size="9" font-weight="700"
      text-anchor="middle" letter-spacing=".5">${model}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const productGrid = document.querySelector("[data-product-grid]");

if (productGrid) {
  const divisions = window.WILSON_PRODUCT_DIVISIONS;
  if (!Array.isArray(divisions)) {
    throw new Error("The Wilson product catalog could not be loaded.");
  }

  const fragment = document.createDocumentFragment();
  divisions.forEach((division) => {
    division.products.forEach((product) => {
      const card = document.createElement("article");
      card.className = "appliance-card";
      card.dataset.category = division.slug;
      card.dataset.productName = `${product.model} ${product.name} ${product.tier} ${division.name}`.toLowerCase();

      const icon = document.createElement("div");
      icon.className = `appliance-card-icon division-${division.slug}`;
      icon.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      image.className = "image-slot";
      image.dataset.imageSlot = "";
      image.src = createProductIllustration(division, product);
      image.alt = "";
      image.loading = "lazy";
      const iconText = document.createElement("span");
      iconText.textContent = division.icon;
      icon.append(image, iconText);
      setupImageSlots(icon);

      const category = document.createElement("p");
      category.className = "appliance-card-division";
      category.textContent = division.name;

      const meta = document.createElement("div");
      meta.className = "appliance-card-meta";
      const model = document.createElement("p");
      model.className = "appliance-card-model";
      model.textContent = product.model;
      const tier = document.createElement("span");
      tier.className = `appliance-card-tier tier-${product.tier.toLowerCase()}`;
      tier.textContent = product.tier;
      meta.append(model, tier);

      const heading = document.createElement("h3");
      heading.textContent = product.name;

      const link = document.createElement("a");
      link.href = `contact.html?product=${encodeURIComponent(product.name)}&model=${encodeURIComponent(product.model)}#contact-message`;
      link.className = "appliance-card-link";
      link.setAttribute("aria-label", `Enquire about ${product.name}, model ${product.model}`);
      link.append("Enquire", document.createTextNode(" →"));

      const copy = document.createElement("div");
      copy.className = "appliance-card-copy";
      copy.append(category, meta, heading, link);
      card.append(icon, copy);
      fragment.append(card);
    });
  });
  productGrid.replaceChildren(fragment);

  const cards = Array.from(productGrid.querySelectorAll("[data-category]"));
  const searchInput = document.querySelector("[data-product-search]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const count = document.querySelector("[data-product-count]");
  const emptyState = document.createElement("p");
  emptyState.className = "empty-state appliance-empty-state";
  emptyState.textContent = "No models match your search. Try another model code or division.";
  emptyState.hidden = true;
  productGrid.append(emptyState);
  const params = new URLSearchParams(window.location.search);
  const requestedDivision = params.get("division");
  let activeCategory = divisions.some((division) => division.slug === requestedDivision) ? requestedDivision : "all";

  const updateProducts = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      const matchesQuery = `${card.dataset.productName} ${card.querySelector(".appliance-card-division").textContent.toLowerCase()}`.includes(query);
      const isVisible = matchesCategory && matchesQuery;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === activeCategory));
    });
    count.textContent = `${visibleCount} ${visibleCount === 1 ? "model" : "models"}`;
    emptyState.hidden = visibleCount > 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      updateProducts();
    });
  });
  searchInput.addEventListener("input", updateProducts);
  updateProducts();
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const formNote = contactForm.querySelector("[data-form-note]");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const params = new URLSearchParams(window.location.search);
  const requestedProduct = params.get("product");
  const requestedModel = params.get("model");
  if (requestedProduct) {
    const model = requestedModel ? ` (model ${requestedModel})` : "";
    contactForm.elements.message.value = `I'm interested in ${requestedProduct}${model}. Please share more product information.`;
    contactForm.elements.subject.value = "Wilson product range";
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formNote.textContent = "";
    formNote.dataset.status = "";

    if (contactForm.action.includes("YOUR_FORM_ID")) {
      formNote.textContent = "This contact form is not configured yet. Please contact Wilson directly.";
      formNote.dataset.status = "error";
      return;
    }

    const originalButtonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.textContent = "Sending...";
    formNote.textContent = "Sending your message...";
    formNote.dataset.status = "loading";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const detail = result?.errors?.map((error) => error.message).filter(Boolean).join(" ");
        throw new Error(detail || `Form submission failed with status ${response.status}.`);
      }

      contactForm.reset();
      formNote.textContent = "Thank you! Your message has been sent. We'll be in touch soon.";
      formNote.dataset.status = "success";
    } catch (error) {
      console.error("Contact form submission failed:", error);
      formNote.textContent = error instanceof TypeError
        ? "We couldn't send your message. Check your internet connection and try again."
        : `${error.message} Please try again.`;
      formNote.dataset.status = "error";
    } finally {
      submitButton.innerHTML = originalButtonContent;
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
    }
  });
}

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
    const imageFrame = image.closest(".image-frame, .appliance-card-icon");
    const updateImageState = () => {
      imageFrame.classList.toggle("has-image", image.naturalWidth > 0);
    };

    image.addEventListener("load", updateImageState, { once: true });
    image.addEventListener("error", updateImageState, { once: true });
    if (image.complete) updateImageState();
  });
};

setupImageSlots(document);

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
      card.dataset.productName = product.toLowerCase();

      const icon = document.createElement("div");
      icon.className = `appliance-card-icon division-${division.slug}`;
      icon.setAttribute("aria-hidden", "true");
      const image = document.createElement("img");
      image.className = "image-slot";
      image.dataset.imageSlot = "";
      image.src = division.image;
      image.alt = "";
      image.loading = "lazy";
      const iconText = document.createElement("span");
      iconText.textContent = division.icon;
      icon.append(image, iconText);
      setupImageSlots(icon);

      const category = document.createElement("p");
      category.className = "appliance-card-division";
      category.textContent = division.name;

      const heading = document.createElement("h3");
      heading.textContent = product;

      const link = document.createElement("a");
      link.href = `contact.html?product=${encodeURIComponent(product)}#contact-message`;
      link.className = "appliance-card-link";
      link.setAttribute("aria-label", `Enquire about ${product}`);
      link.append("Enquire", document.createTextNode(" →"));

      const copy = document.createElement("div");
      copy.className = "appliance-card-copy";
      copy.append(category, heading, link);
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
  emptyState.textContent = "No appliance families match your search. Try another product or division.";
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
    count.textContent = `${visibleCount} ${visibleCount === 1 ? "product" : "products"}`;
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
  const requestedProduct = new URLSearchParams(window.location.search).get("product");
  if (requestedProduct) {
    contactForm.elements.message.value = `I'm interested in ${requestedProduct}. Please share more product information.`;
    contactForm.elements.subject.value = "Wilson product range";
  }
}

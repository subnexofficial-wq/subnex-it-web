export function slugifyProductTitle(title = "") {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProductSlug(product = {}) {
  if (product.slug && typeof product.slug === "string") {
    return product.slug;
  }

  return slugifyProductTitle(product.title || "") || "product";
}

export function getProductPath(product = {}) {
  return `/products/${getProductSlug(product)}`;
}

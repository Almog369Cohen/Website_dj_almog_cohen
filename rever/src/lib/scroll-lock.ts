/** iOS-safe scroll lock: body overflow alone does not stop rubber-band scrolling in Safari. */
let locks = 0;
let savedY = 0;

export function lockScroll() {
  if (locks++ > 0) return;
  savedY = window.scrollY;
  const b = document.body.style;
  b.position = "fixed";
  b.top = `-${savedY}px`;
  b.left = "0";
  b.right = "0";
  b.width = "100%";
}

export function unlockScroll() {
  if (--locks > 0) return;
  locks = 0;
  const b = document.body.style;
  b.position = b.top = b.left = b.right = b.width = "";
  window.scrollTo(0, savedY);
}

let isDown = false;
let startX;
let scrollLeft;

const carousel = document.querySelector(".row-carousel");
const carouselContent = document.querySelector(".carousel-content");

carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseleave", () => {
  isDown = false;
});

carousel.addEventListener("mouseup", () => {
  isDown = false;
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 2; // Adjust the multiplier to control scrolling speed
  carousel.scrollLeft = scrollLeft - walk;
});

function goToDetailPage(itemId) {
  window.location.href = `/pages/detailPage.html`; // Redirect to detail page with item ID
}

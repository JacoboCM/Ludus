const images = [
  "https://picsum.photos/1920/1080",
  "https://picsum.photos/1921/1080",
  "https://picsum.photos/1922/1080",
];

const fallbackImage = "https://via.placeholder.com/1920x1080";

let currentIndex = 0;
const carouselImage = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Function to load the current image
function loadCurrentImage() {
  carouselImage.src = images[currentIndex];
}

// Set the initial image
loadCurrentImage();

// Add event listeners to the buttons
prevBtn.addEventListener("click", function () {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  loadCurrentImage();
});

nextBtn.addEventListener("click", function () {
  currentIndex = (currentIndex + 1) % images.length;
  loadCurrentImage();
});

// Set fallback image if loading fails
carouselImage.addEventListener("error", function () {
  carouselImage.src = fallbackImage;
});

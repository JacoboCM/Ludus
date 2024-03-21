let slideIndex = 0;
const slides = document.querySelectorAll(".carousel-slide img");

function showSlide(index) {
  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  slides[index].style.display = "block";
}

function moveSlide(n) {
  console.log("HOLA", n);
  slideIndex += n;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  } else if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  showSlide(slideIndex);
}

showSlide(slideIndex);

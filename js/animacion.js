// Animacion de slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const slideInterval = setInterval(nextSlide, 3000);

function nextSlide() {
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add('active');
}

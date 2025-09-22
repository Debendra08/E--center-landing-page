<script>
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let index = 0;
const slideCount = slides.length;
let autoSlide;

/* // Update slide position */
function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

// Go to next slide
function nextSlide() {
  index = (index + 1) % slideCount;
  updateSlider();
}

// Go to previous slide
function prevSlide() {
  index = (index - 1 + slideCount) % slideCount;
  updateSlider();
}

// Auto slide every 10 seconds
function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 10000);
}

// Stop auto slide when user interacts
function stopAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide(); // restart timer
}

// Event listeners
nextBtn.addEventListener('click', () => {
  nextSlide();
  stopAutoSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  stopAutoSlide();
});

dots.forEach((dot, dotIndex) => {
  dot.addEventListener('click', () => {
    index = dotIndex;
    updateSlider();
    stopAutoSlide();
  });
});

// Initialize
updateSlider();
startAutoSlide();
</script>
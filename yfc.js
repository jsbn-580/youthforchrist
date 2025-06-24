// Slideshow logic
let slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function showNextSlide() {
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === currentIndex) slide.classList.add('active');
  });
  currentIndex = (currentIndex + 1) % slides.length;
}
setInterval(showNextSlide, 3000);
showNextSlide();

// Animated counter
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");
  counters.forEach(counter => {
    const update = () => {
      const target = +counter.getAttribute("data-target");
      const count = +counter.innerText;
      const increment = target / 100;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(update, 20);
      } else {
        counter.innerText = target;
      }
    };
    update();
  });
});

// Floating Balls Animation
function animateBall(ball, offsetX, offsetY, frequencyX, frequencyY) {
  let angle = 0;
  function move() {
    const x = offsetX + Math.sin(angle * frequencyX) * 15;
    const y = offsetY + Math.cos(angle * frequencyY) * 15;
    ball.style.transform = `translate(${x}px, ${y}px)`;
    angle += 0.02;
    requestAnimationFrame(move);
  }
  move();
}

document.querySelectorAll(".ball").forEach((ball, index) => {
  animateBall(ball, index * 10, index * 10, 1 + index * 0.3, 1 + index * 0.2);
});

// Animate sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fade-up");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));

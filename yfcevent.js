document.addEventListener("DOMContentLoaded", () => {
  // Animate counters
  const counters = document.querySelectorAll('.stat-box h2');
  const speed = 200;

  counters.forEach(counter => {
    const animate = () => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText.replace('+', '') || 0;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = `${Math.ceil(count + increment)}+`;
        setTimeout(animate, 10);
      } else {
        counter.innerText = `${target}+`;
      }
    };
    animate();
  });

  // Scroll opacity effect
  const bgOverlay = document.querySelector('.background-overlay');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bgOverlay.style.opacity = Math.max(0.1, 0.2 - scrollY / 600);
  });

  // Animate welcome boxes on scroll
  const boxes = document.querySelectorAll('.welcome-box');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.3
  });

  boxes.forEach(box => {
    observer.observe(box);
  });
});

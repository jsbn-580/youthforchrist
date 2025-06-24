document.addEventListener("DOMContentLoaded", () => {
  // Animate form-boxes on load with delay
  const boxes = document.querySelectorAll('.form-box');
  boxes.forEach((box, index) => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(20px)';
    box.style.transition = `opacity 0.6s ease-out ${index * 0.3}s, transform 0.6s ease-out ${index * 0.3}s`;
  });

  // When page loads, reveal boxes
  setTimeout(() => {
    boxes.forEach(box => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    });
  }, 100);

  // Animate buttons on click
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mousedown', () => {
      button.style.transform = 'scale(0.95)';
      button.style.opacity = '0.9';
    });
    button.addEventListener('mouseup', () => {
      button.style.transform = 'scale(1)';
      button.style.opacity = '1';
    });
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.opacity = '1';
    });
  });

  // Optional: Scroll animation (boxes fade in on scroll)
  const revealOnScroll = () => {
    const elements = document.querySelectorAll('.form-box');
    const windowHeight = window.innerHeight;

    elements.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;
      if (boxTop < windowHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run on load
});

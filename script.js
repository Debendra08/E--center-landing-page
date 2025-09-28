document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number");
  const section = document.querySelector(".about-container");
  let started = false;

  const startCounting = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      let increment;

      // 🎯 Separate speed control
      if (target > 1000) {
        increment = Math.ceil(target / 100); // Faster for large numbers
      } else {
        // increment = Math.ceil(target / 9000000000);
        increment = 1; // Slower for small numbers
      }

      const updateCounter = () => {
        count += increment;
        if (count >= target) {
          counter.textContent = target + "+";
        } else {
          counter.textContent = count + "+";
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();
    });
  };

  // Detect when section becomes visible
  window.addEventListener("scroll", () => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (!started && sectionTop < windowHeight - 100) {
      started = true;
      startCounting();
    }
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const boot = document.getElementById("boot-screen");
  const fill = document.getElementById("bootFill");
  const text = document.getElementById("bootText");

  const messages = [
    "Checking hardware...",
    "Loading system files...",
    "Starting window manager...",
    "Initializing desktop...",
    "Finalizing setup..."
  ];

  let progress = 0;
  let step = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 10;

    if (progress > 100) progress = 100;

    fill.style.width = progress + "%";

    if (step < messages.length && progress > step * 20) {
      text.textContent = messages[step];
      step++;
    }

    if (progress >= 100) {
      clearInterval(interval);

      text.textContent = "Welcome.";

      setTimeout(() => {
        boot.style.transition = "opacity 0.6s ease";
        boot.style.opacity = "0";

        setTimeout(() => {
          boot.remove();

          // ✅ SYSTEM READY SIGNAL (IMPORTANT FIX)
          window.dispatchEvent(new Event("system-ready"));
        }, 600);
      }, 400);
    }
  }, 120);

  // skip boot
  window.addEventListener("keydown", skip);
  window.addEventListener("click", skip);

  function skip() {
    fill.style.width = "100%";
    text.textContent = "Welcome.";

    setTimeout(() => {
      boot.remove();

      // ✅ SYSTEM READY SIGNAL (IMPORTANT FIX)
      window.dispatchEvent(new Event("system-ready"));
    }, 200);

    window.removeEventListener("keydown", skip);
    window.removeEventListener("click", skip);
  }
});
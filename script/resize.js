function makeResizable(element) {
  const minWidth = 250;
  const minHeight = 150;

  const resizers = element.querySelectorAll(".resizer");

  resizers.forEach((resizer) => {
    resizer.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;

      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;

      const startLeft = element.offsetLeft;
      const startTop = element.offsetTop;

      const dir = resizer.classList;

      // IMPORTANT: lock pointer so we never lose it
      resizer.setPointerCapture(e.pointerId);

      function onMove(ev) {
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (dir.contains("bottom-right")) {
          newWidth = startWidth + dx;
          newHeight = startHeight + dy;
        }

        if (dir.contains("right")) {
          newWidth = startWidth + dx;
        }

        if (dir.contains("bottom")) {
          newHeight = startHeight + dy;
        }

        // LEFT resize fix (this is what was breaking for fast movement)
        if (dir.contains("bottom-left")) {
          newWidth = startWidth - dx;
          newHeight = startHeight + dy;
          newLeft = startLeft + dx;
        }

        element.style.width = Math.max(minWidth, newWidth) + "px";
        element.style.height = Math.max(minHeight, newHeight) + "px";
        element.style.left = newLeft + "px";
        element.style.top = newTop + "px";
      }

      function onUp(ev) {
        resizer.releasePointerCapture(ev.pointerId);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    });
  });
}
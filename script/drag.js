function dragElement(elmnt) {
  const header = elmnt.querySelector(".window-header");
  const dragTarget = header || elmnt;

  let startX, startY, startLeft, startTop;

  dragTarget.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("btn")) return;

    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;

    startLeft = elmnt.offsetLeft;
    startTop = elmnt.offsetTop;

    dragTarget.setPointerCapture(e.pointerId);

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      const BUFFER = 10; // 🔥 softness amount
      const HEADER_HEIGHT = 30;

      const maxLeft = window.innerWidth - elmnt.offsetWidth;
      const maxTop = window.innerHeight - HEADER_HEIGHT;

      // ================= LEFT / RIGHT =================
      if (newLeft < -BUFFER) newLeft = -BUFFER;
      if (newLeft > maxLeft + BUFFER) newLeft = maxLeft + BUFFER;

      // ================= TOP =================
      if (newTop < -BUFFER) newTop = -BUFFER;

      // ================= BOTTOM =================
      // allow content below screen but keep header visible
      if (newTop > maxTop + BUFFER) newTop = maxTop + BUFFER;

      elmnt.style.left = newLeft + "px";
      elmnt.style.top = newTop + "px";
    }

    function onUp(ev) {
      dragTarget.releasePointerCapture(ev.pointerId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      // 🔥 snap back inside cleanly
      let left = elmnt.offsetLeft;
      let top = elmnt.offsetTop;

      const HEADER_HEIGHT = 30;

      const maxLeft = window.innerWidth - elmnt.offsetWidth;
      const maxTop = window.innerHeight - HEADER_HEIGHT;

      if (left < 0) left = 0;
      if (left > maxLeft) left = maxLeft;

      if (top < 0) top = 0;
      if (top > maxTop) top = maxTop;

      elmnt.style.left = left + "px";
      elmnt.style.top = top + "px";
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  });
}
function updateClock() {
  const c = document.getElementById("clock");
  if (!c) return;

  const now = new Date();

  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12;
  c.textContent = `${h}:${m} ${ampm}`;
}

setInterval(updateClock, 1000);
updateClock();
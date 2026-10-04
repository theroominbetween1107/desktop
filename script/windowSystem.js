let zIndex = 10;

const openWindows = {};
let activeWindow = null;

// ================= WINDOW SPAWN =================

const SPAWN_LEFT = 200;
const SPAWN_TOP = 120;

const STACK_OFFSET = 25;
const MAX_STACK_OFFSET = 150;

let lastSpawnedWindow = null;


function getNextSpawnPosition() {

  let left = SPAWN_LEFT;
  let top = SPAWN_TOP;


  if (
    lastSpawnedWindow &&
    document.body.contains(lastSpawnedWindow)
  ) {

    const previousLeft =
      lastSpawnedWindow.offsetLeft;

    const previousTop =
      lastSpawnedWindow.offsetTop;


    const originalLeft =
      Number(lastSpawnedWindow.dataset.spawnLeft);

    const originalTop =
      Number(lastSpawnedWindow.dataset.spawnTop);


    const previousWasMoved =
      previousLeft !== originalLeft ||
      previousTop !== originalTop;


    if (!previousWasMoved) {

      const previousStackOffset =
        Number(
          lastSpawnedWindow.dataset.stackOffset || 0
        );


      const nextStackOffset =
        Math.min(
          previousStackOffset + STACK_OFFSET,
          MAX_STACK_OFFSET
        );


      left =
        SPAWN_LEFT + nextStackOffset;

      top =
        SPAWN_TOP + nextStackOffset;

    }

  }


  return {
    left: left,
    top: top
  };

}


// ================= SCREEN CLAMP =================

function clampWindowToScreen(win) {

  const HEADER_HEIGHT = 30;
  const TASKBAR_HEIGHT = 40;


  let left =
    win.offsetLeft;

  let top =
    win.offsetTop;


  const maxLeft =
    Math.max(
      0,
      window.innerWidth - win.offsetWidth
    );


  const maxTop =
    Math.max(
      0,
      window.innerHeight -
      HEADER_HEIGHT -
      TASKBAR_HEIGHT -
      win.offsetHeight
    );


  left =
    Math.max(
      0,
      Math.min(left, maxLeft)
    );


  top =
    Math.max(
      0,
      Math.min(top, maxTop)
    );


  win.style.left =
    left + "px";

  win.style.top =
    top + "px";

}


// ================= WINDOW CREATION =================

function createWindow(title, url) {

  if (openWindows[url]) {

    const existing =
      openWindows[url];


    if (
      existing.style.display === "none"
    ) {
      return;
    }


    existing.style.zIndex =
      ++zIndex;

    activeWindow =
      existing;

    return;

  }


  const win =
    document.createElement("div");


  win.className =
    "window";

  win.style.zIndex =
    zIndex++;


  // ================= SPAWN POSITION =================

  if (url.includes("ie-gag.html")) {

    const maxLeft =
      Math.max(
        0,
        window.innerWidth - 500
      );


    const maxTop =
      Math.max(
        0,
        window.innerHeight - 440
      );


    win.style.left =
      Math.floor(
        Math.random() * maxLeft
      ) + "px";


    win.style.top =
      Math.floor(
        Math.random() * maxTop
      ) + "px";

  } else {

    const spawn =
      getNextSpawnPosition();


    win.style.left =
      spawn.left + "px";


    win.style.top =
      spawn.top + "px";


    win.dataset.spawnLeft =
      String(spawn.left);


    win.dataset.spawnTop =
      String(spawn.top);


    win.dataset.stackOffset =
      String(
        spawn.left - SPAWN_LEFT
      );

  }


  win.innerHTML = `
    <div class="window-header">
      <span class="window-title">${title}</span>

      <div class="window-buttons">
        <div class="btn minimize">_</div>
        <div class="btn maximize">□</div>
        <div class="btn close">X</div>
      </div>
    </div>

    <div class="window-content">
      <iframe src="${url}"></iframe>
    </div>

    <div class="resizer right"></div>
    <div class="resizer bottom"></div>
    <div class="resizer bottom-right"></div>
  `;


  document
    .getElementById("desktop")
    .appendChild(win);


  openWindows[url] =
    win;


  dragElement(win);
  makeResizable(win);


  clampWindowToScreen(win);


  // IMPORTANT:
  // Remember the most recently spawned normal window.
  if (!url.includes("ie-gag.html")) {
    lastSpawnedWindow = win;
  }


  win.addEventListener(
    "mousedown",
    () => {

      win.style.zIndex =
        ++zIndex;

      activeWindow =
        win;

    }
  );


  const minBtn =
    win.querySelector(".minimize");

  const maxBtn =
    win.querySelector(".maximize");

  const closeBtn =
    win.querySelector(".close");


  // ================= CLOSE =================

  closeBtn.onclick = () => {

    delete openWindows[url];


    if (activeWindow === win) {
      activeWindow = null;
    }


    if (lastSpawnedWindow === win) {
      lastSpawnedWindow = null;
    }


    win.remove();

  };


  // ================= MINIMIZE =================

  minBtn.onclick = () => {

    win.style.display =
      "none";


    createTaskbarItem(
      title,
      win
    );


    if (activeWindow === win) {
      activeWindow = null;
    }

  };


  // ================= MAXIMIZE =================

  let maxed = false;
  let old = {};


  maxBtn.onclick = () => {

    if (!maxed) {

      old = {
        top: win.style.top,
        left: win.style.left,
        width: win.style.width,
        height: win.style.height
      };


      win.style.top =
        "0";

      win.style.left =
        "0";

      win.style.width =
        "100vw";

      win.style.height =
        "calc(100vh - 40px)";

    } else {

      Object.assign(
        win.style,
        old
      );


      clampWindowToScreen(win);

    }


    maxed =
      !maxed;

  };

}


// ================= TASKBAR =================

function createTaskbarItem(title, win) {

  const bar =
    document.getElementById(
      "taskbar-apps"
    );


  const item =
    document.createElement("div");


  item.className =
    "taskbar-app";


  item.textContent =
    title;


  bar.appendChild(item);


  item.onclick = () => {

    win.style.display =
      "flex";


    win.style.zIndex =
      ++zIndex;


    activeWindow =
      win;


    clampWindowToScreen(win);


    item.remove();

  };

}


// ================= START MENU =================

document.addEventListener(
  "click",
  (e) => {

    const menu =
      document.getElementById(
        "start-menu"
      );


    const btn =
      document.querySelector(
        ".start-button"
      );


    if (!menu || !btn) {
      return;
    }


    if (btn.contains(e.target)) {

      menu.style.display =
        menu.style.display === "block"
          ? "none"
          : "block";

    } else if (
      !menu.contains(e.target)
    ) {

      menu.style.display =
        "none";

    }


    if (e.target.dataset.app) {

      const name =
        e.target.textContent;


      createWindow(
        name,
        "apps/" +
        e.target.dataset.app
      );


      menu.style.display =
        "none";

    }

  }
);


// ================= DESKTOP INIT =================

function initDesktop() {

  document
    .querySelectorAll(".desktop-icon")
    .forEach((icon) => {

      icon.ondblclick = (e) => {

        e.preventDefault();
        e.stopPropagation();


        const title =
          icon.dataset.title;


        const app =
          icon.dataset.app;


        createWindow(
          title,
          "apps/" + app
        );

      };

    });

}


// ================= BOOT =================

window.addEventListener(
  "system-ready",
  initDesktop
);
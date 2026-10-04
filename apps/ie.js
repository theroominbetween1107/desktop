let chaosStarted = false;
let chaosCount = 0;

document.getElementById("browseButton").addEventListener("click", function() {

  if (chaosStarted) {
    return;
  }

  chaosStarted = true;

  console.log("GAG ACTIVATED");

  const audio = document.getElementById("gagAudio");

  if (audio) {
    audio.currentTime = 0;

    audio.play().catch(function(error) {
      console.log("Audio failed:", error);
    });
  }

  createGagWindow();

  setTimeout(function() {
    createGagWindow();
  }, 700);

  setTimeout(function() {
    createGagWindow();
  }, 1400);

  setTimeout(function() {
    createGagWindow();
  }, 2100);

  setTimeout(function() {
    createGagWindow();
  }, 2800);

  setTimeout(function() {
    createGagWindow();
  }, 3500);

  setTimeout(function() {
    createGagWindow();
  }, 4200);

  setTimeout(function() {
    createGagWindow();
  }, 4900);

  setTimeout(function() {
    changePage();
  }, 6000);

});

function createGagWindow() {

  chaosCount++;

  window.parent.createWindow(
    "Internet Explorer",
    "apps/ie-gag.html?gag=" + chaosCount
  );

}

function changePage() {

  document.querySelector(".page").innerHTML = `
    <div style="
      padding: 40px;
      text-align: center;
      font-family: 'MS Sans Serif', Arial, sans-serif;
    ">

      <h1>Internet Explorer</h1>

      <p>Internet Explorer has encountered an unexpected problem.</p>

      <p>ERROR CODE: 0b00110001001100010011000000110111</p>

      <br>

      <button onclick="location.reload()">
        Try Again
      </button>

    </div>
  `;

}
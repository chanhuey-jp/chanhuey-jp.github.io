(function () {
  "use strict";

  var ipElement = document.getElementById("visitor-ip");
  if (!ipElement) return;

  fetch("https://api64.ipify.org?format=json", {
    method: "GET",
    mode: "cors",
    credentials: "omit",
    cache: "no-store"
  })
    .then(function (response) {
      if (!response.ok) throw new Error("IP request failed");
      return response.json();
    })
    .then(function (data) {
      ipElement.textContent = data.ip || "Unavailable";
    })
    .catch(function () {
      ipElement.textContent = "Unavailable";
    });
})();

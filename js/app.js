(function () {
  "use strict";

  var HEART_PATH = "M12 21s-6.7-4.2-9.3-8.6C1 9.7 1.7 6.4 4.6 5.1c2.1-.9 4.4-.1 5.7 1.7L12 8.7l1.7-1.9c1.3-1.8 3.6-2.6 5.7-1.7 2.9 1.3 3.6 4.6 1.9 7.3C18.7 16.8 12 21 12 21z";
  var HOUSE_PATH = ["M4 11.5 12 4l8 7.5", "M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"];
  var SHIELD_PATH = ["M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z", "M9 12l2 2 4-4"];
  var CAMERA_PATH = "M4 8a2 2 0 0 1 2-2h1.2l.9-1.6A1 1 0 0 1 8.9 4h6.2a1 1 0 0 1 .9.6L16.8 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z";

  var listings = [
    { id: "l1", price: "€189.000", title: "Svetao dvosoban stan", addr: "Vračar, Beograd", beds: 2, baths: 1, area: "64 m²", verified: true, photos: 12 },
    { id: "l2", price: "€245.000", title: "Porodična kuća sa dvorištem", addr: "Zemun, Beograd", beds: 4, baths: 2, area: "180 m²", verified: true, photos: 18, fav: true },
    { id: "l3", price: "€520 / mesečno", title: "Moderna garsonjera", addr: "Novi Sad, Centar", beds: 1, baths: 1, area: "32 m²", verified: false, photos: 8 },
    { id: "l4", price: "€310.000", title: "Penthouse sa terasom", addr: "Novi Beograd", beds: 3, baths: 2, area: "112 m²", verified: true, photos: 21 }
  ];

  function svgIcon(paths, opts) {
    opts = opts || {};
    var w = opts.w || 16, h = opts.h || 16, stroke = opts.stroke || "#6E6E73", sw = opts.sw || 1.6, fill = opts.fill || "none";
    var arr = Array.isArray(paths) ? paths : [paths];
    var inner = arr.map(function (d) { return '<path d="' + d + '"/>'; }).join("");
    return '<svg viewBox="0 0 24 24" width="' + w + '" height="' + h + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + inner + "</svg>";
  }

  function heartIcon(active) {
    return svgIcon(HEART_PATH, {
      w: 17, h: 17,
      fill: active ? "#D6417F" : "none",
      stroke: active ? "#D6417F" : "#1D1D1F",
      sw: 1.6
    });
  }

  function cardHtml(item) {
    var verifiedBadge = item.verified
      ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D6417F" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' + SHIELD_PATH[0] + '"/><path d="' + SHIELD_PATH[1] + '"/></svg>'
      : "";
    return (
      '<div class="card" data-id="' + item.id + '">' +
        '<div class="card-photo">' +
          '<svg class="house-icon" viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#1D1D1F" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="' + HOUSE_PATH[0] + '"/><path d="' + HOUSE_PATH[1] + '"/></svg>' +
          '<button class="heart-btn" data-fav-id="' + item.id + '" aria-label="Sačuvaj oglas">' + heartIcon(!!item.fav) + '</button>' +
          '<div class="photo-count"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + CAMERA_PATH + '"/><circle cx="12" cy="12.5" r="3.4"/></svg>' + item.photos + "</div>" +
        "</div>" +
        '<div class="card-body">' +
          '<div class="card-top"><span class="card-price">' + item.price + "</span>" + verifiedBadge + "</div>" +
          '<div class="card-title">' + item.title + "</div>" +
          '<div class="card-addr">' + item.addr + "</div>" +
          '<div class="card-stats">' +
            "<span>" + svgIcon(["M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6", "M3 18v2M21 18v2", "M3 12V7a1 1 0 0 1 1-1h5v5"], { w: 14, h: 14 }) + item.beds + "</span>" +
            "<span>" + svgIcon(["M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z", "M7 12V6a2 2 0 0 1 3.6-1.2"], { w: 14, h: 14 }) + item.baths + "</span>" +
            "<span>" + svgIcon(["M8 3v3M18 3v4M3 8h3M3 18h4"], { w: 14, h: 14 }) + item.area + "</span>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderListings() {
    var grid = document.getElementById("listing-grid");
    if (!grid) return;
    grid.innerHTML = listings.map(cardHtml).join("");
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-fav-id]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var item = listings.filter(function (l) { return l.id === btn.getAttribute("data-fav-id"); })[0];
      item.fav = !item.fav;
      btn.innerHTML = heartIcon(item.fav);
    });
  }

  function initSearchTabs() {
    var tabs = document.querySelectorAll(".tab-btn[data-tab]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
      });
    });
  }

  function initChips() {
    var chips = document.querySelectorAll(".chip[data-chip]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
      });
    });
  }

  function initMobileTabs() {
    var tabs = document.querySelectorAll(".mobile-tab[data-tab]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
      });
    });
  }

  function initListingFav() {
    var favBtn = document.getElementById("fav-btn");
    var favHeart = document.getElementById("fav-heart");
    if (!favBtn || !favHeart) return;
    var active = false;
    favBtn.addEventListener("click", function () {
      active = !active;
      favHeart.setAttribute("fill", active ? "#D6417F" : "none");
      favHeart.setAttribute("stroke", active ? "#D6417F" : "#1D1D1F");
    });
  }

  function initNavMenu() {
    var btn = document.querySelector(".nav-menu-btn");
    var links = document.querySelector(".nav-links");
    if (!btn || !links) return;
    btn.addEventListener("click", function () {
      links.style.display = links.style.display === "flex" ? "none" : "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "68px";
      links.style.left = "0";
      links.style.right = "0";
      links.style.background = "#fff";
      links.style.padding = "16px 20px";
      links.style.borderBottom = "1px solid #ECECEE";
      links.style.gap = "16px";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderListings();
    initSearchTabs();
    initChips();
    initMobileTabs();
    initListingFav();
    initNavMenu();
  });
})();

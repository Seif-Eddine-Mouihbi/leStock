/**
 * @copyright Seif Eddine Mouihbi 2024
 * @author Seif <mouihbiseif@gmail.com>
 */

"use strict";

/**
 * Import
 */

import { client } from "../../js/api_configure.js";
import { menu } from "../../js/menu.js";
import { favorite } from "../../js/favorite.js";

/**
 * Menu toggle
 */

const /** {NodeList} */ $menuWrappers = document.querySelectorAll(
    "[data-menu-wrapper]"
  );

$menuWrappers.forEach(($menuWrapper) => {
  menu($menuWrapper);
});

/**
 * Add to favorite
 */

const /** {Object} */ favoriteVideos = JSON.parse(
    window.localStorage.getItem("favorite")
  ).videos;
const /** {NodeElement} */ $favoriteBtn =
    document.querySelector("[data-add-favorite");
const /** {String} */ videoId = window.location.search.split("=")[1];

$favoriteBtn.classList[favoriteVideos[videoId] ? "add" : "remove"]("active");
favorite($favoriteBtn, "videos", videoId);

/**
 * Render detail data
 */

const /** {NodeElement} */ $detailWrapper = document.querySelector(
    "[data-detail-wrapper]"
  );
const /** {NodeElement} */ $downloadLink = document.querySelector(
    "[data-download-link]"
  );
const /** {NodeElement} */ $downloadMenu = document.querySelector(
    "[data-download-menu]"
  );

client.videos.detail(videoId, (data) => {
  const {
    width,
    height,
    image,
    user: { name },
    video_files,
  } = data;

  const /** {Object} */ hdVideo = video_files.find(
      (item) => item.quality === "hd"
    );
  const { file_type, link } = hdVideo;

  $downloadLink.href = link;

  video_files.forEach((item) => {
    const { width, height, quality, link } = item;
    $downloadMenu.innerHTML += `
            <a href="${link}" download class="menu-item">
             <span class="label-large text">${quality.toUpperCase()}</span>
             <span class="label-large trailing-text">${width}x${height}</span>
             <div class="state-layer"></div>
            </a>
        `;
  });

  $detailWrapper.innerHTML = `
        <div class="detail-banner" style="aspect-ratio: ${width} / ${height}">
            <video poster="${image}" controls class="img-cover" data-video>
              <source src="${link}" type="${file_type}"/>
            </video>
        </div>

        <p class="title-small">Video by <span class="color-primary">${name}</span></p>
    `;
});

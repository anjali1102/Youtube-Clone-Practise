const YOUTUBE_API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";
const VIDEO_LINK_URL = "https://www.youtube.com/watch?v=";

const videoGrid = document.querySelector(".video-grid");
const button = document.querySelector(".btn");
const searchbar = document.querySelector(".search");
const loadingContainer = document.querySelector(".loading-container");
const loadingGif = document.getElementById("loadingGif");
const loadingText = document.getElementById("loadingText");
const loadingSound = document.getElementById("loadingSound");

let allVidoesData = [];
/**
 * Sets loading state
 *
 *
 **/
function setLoading(isLoading, message = "") {
  loadingContainer.style.display = isLoading ? "flex" : "none";
  loadingContainer.style.justifyContent = isLoading ? "center" : "none";
  videoGrid.style.display = isLoading ? "none" : "grid";
  loadingText.textContent = message;
}

/**
 * Fetches videos data from youtube api
 * @returns {Promise<Array|Error>}
 *
 **/
async function getVideos() {
  setLoading(true);
  try {
    const videoAPI = await fetch(YOUTUBE_API_URL);
    const videoAPIresponse = await videoAPI.json();
    const videosListDetails = videoAPIresponse?.data?.data;
    setLoading(false);

    return videosListDetails || [];
  } catch (error) {
    setLoading(false, "Failed to load videos.");
    videoGrid.innerHTML = "<p>Failed to load videos.</p>";

    return error;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  allVidoesData = await getVideos();
  allVidoesData.forEach(({ items }) => {
    const card = createVideoCard(items);
    videoGrid.appendChild(card);
  });
});

/**
 * handle search input
 * @params {Event} - event object
 *
 *
 **/
searchbar.addEventListener("input", (e) => {
  const userSearched = e.target.value;

  videoGrid.textContent = "";
  const filteredVideos = allVidoesData.filter((video) =>
    video.items.snippet.title.toLowerCase().includes(userSearched)
  );
  if (filteredVideos.length === 0) {
    const noResultsMessage = document.createElement("div");
    noResultsMessage.textContent = `No videos found matching "${userSearched}".`;
    noResultsMessage.classList.add("no-results");
    videoGrid.appendChild(noResultsMessage);
  } else {
    filteredVideos.forEach(({ items }) => {
      const card = createVideoCard(items);
      videoGrid.appendChild(card);
    });
  }
});

/**
 * Create a video card
 * @params {object} videoItem - single video item object from API repsonse
 * @returns {HTMLDivElement} - video card element
 *
 **/
function createVideoCard(items) {
  const { id, snippet } = items;
  const card = document.createElement("div");
  card.setAttribute("class", "videoCard");

  //card image
  const img = document.createElement("img");
  img.src = snippet?.thumbnails?.medium?.url || "";
  img.setAttribute("loading", "lazy");
  img.setAttribute("class", "thumbnail");
  card.appendChild(img);

  //card link
  const videoLink = document.createElement("a");
  videoLink.href = `${VIDEO_LINK_URL}${id}`;
  videoLink.target = "_blank";
  videoLink.appendChild(img);

  //title
  const videoTitle = document.createElement("p");
  videoTitle.setAttribute("class", "videoTitle");
  videoTitle.textContent = snippet.title;

  //author
  const videoAuthor = document.createElement("p");
  videoAuthor.setAttribute("class", "videoAuthor");
  videoAuthor.textContent = snippet.channelTitle;

  card.appendChild(videoLink);
  card.appendChild(videoTitle);
  card.appendChild(videoAuthor);

  return card;
}

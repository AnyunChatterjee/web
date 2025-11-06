function sortVideos(data, sortBy) {
  return [...data].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a["Video Title"] || '').localeCompare(b["Video Title"] || '');
      case 'title-desc':
        return (b["Video Title"] || '').localeCompare(a["Video Title"] || '');
      case 'year':
        return (parseInt(a["Year"]) || 0) - (parseInt(b["Year"]) || 0);
      case 'year-desc':
        return (parseInt(b["Year"]) || 0) - (parseInt(a["Year"]) || 0);
      case 'duration':
        return (parseFloat(a["Seconds"]) || 0) - (parseFloat(b["Seconds"]) || 0);
      case 'duration-desc':
        return (parseFloat(b["Seconds"]) || 0) - (parseFloat(a["Seconds"]) || 0);
      case 'views':
        return (parseFloat(a["Views"]) || 0) - (parseFloat(b["Views"]) || 0);
      case 'views-desc':
        return (parseFloat(b["Views"]) || 0) - (parseFloat(a["Views"]) || 0);
      default:
        return 0;
    }
  });
}

function setupSorting() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', () => {
    const filtered = applyFilters(window.videoData);
    renderVideos(filtered);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("index.json")
    .then((res) => res.json())
    .then((data) => {
      window.videoData = data; // Store globally for filtering
      renderVideos(data);
      setupFilters(data);
      setupSorting();
    })
    .catch((err) => console.error("Failed to load index.json", err));
});



function updateVideoCount(count, total) {
  const countElement = document.getElementById("video-count");
  if (countElement) {
    if (count === total) {
      countElement.textContent = `${count} videos`;
    } else {
      countElement.textContent = `${count} of ${total} videos`;
    }
  }
}

function renderVideos(data) {
  const container = document.getElementById("video-list");
  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "<p class='text-muted'>No results found.</p>";
    updateVideoCount(0, window.videoData.length);
    return;
  }

  updateVideoCount(data.length, window.videoData.length);

  data.forEach((entry) => {
    const title = entry["Video Title"] || entry.filename || "Untitled";
    const state = entry["State"] || "Unknown state";
    const year = entry["Year"] || "Unknown year";
    const department = entry["Department"] || "Unknown department";
    const seconds = entry["Seconds"] ? Math.round(parseFloat(entry["Seconds"])) : null;
    const length = seconds ? `${seconds}s` : "?";
    const views = entry["Views"] ? Math.round(parseFloat(entry["Views"])).toLocaleString() : "?";
    const filename = entry["filename"] || "";

    const card = document.createElement("div");
    card.className = "mb-3 p-2 border-bottom";

    const titleLink = document.createElement("a");
    titleLink.href = `video_files/${filename}.mp4`;
    titleLink.textContent = title;
    titleLink.className = "fw-bold d-block";
    titleLink.target = "_blank";

    const meta = document.createElement("div");
    meta.className = "text-muted small";
    meta.textContent = `${state} · ${year} · ${department} · ${length} · ${views} views`;

    card.appendChild(titleLink);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function setupFilters(data) {
  populateFilter("state-filter", getUnique(data, "State"));
  populateFilter("year-filter", getUnique(data, "Year").sort().reverse());
  populateFilter("dept-filter", getUnique(data, "Department").sort());

  const filterIds = [
    "state-filter",
    "year-filter",
    "length-filter",
    "views-filter",
    "dept-filter"
  ];
  
  // Setup reset filters button
  const resetButton = document.getElementById("reset-filters");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      filterIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      const sortSelect = document.getElementById("sort-select");
      if (sortSelect) sortSelect.value = "title";
      renderVideos(sortVideos(window.videoData, "title"));
      updateVideoCount(window.videoData.length, window.videoData.length);
    });
  }

  filterIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", () => {
        const filtered = applyFilters(window.videoData);
        renderVideos(filtered);
      });
    }
  });
}

function getUnique(data, key) {
  return [...new Set(data.map((e) => e[key]).filter(Boolean))];
}

function populateFilter(id, values) {
  const select = document.getElementById(id);
  if (!select) return;
  values.forEach((val) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = val;
    select.appendChild(opt);
  });
}

function applyFilters(data) {
  const state = document.getElementById("state-filter").value;
  const year = document.getElementById("year-filter").value;
  const length = document.getElementById("length-filter").value;
  const views = document.getElementById("views-filter").value;
  const dept = document.getElementById("dept-filter").value;
  const sortBy = document.getElementById("sort-select").value;

  let filtered = data.filter((entry) => {
    if (state && entry["State"] !== state) return false;
    if (year && entry["Year"] !== year) return false;
    if (dept && entry["Department"] !== dept) return false;

    const sec = parseFloat(entry["Seconds"] || 0);
    if (length === "short" && sec >= 30) return false;
    if (length === "medium" && (sec < 30 || sec > 90)) return false;
    if (length === "long" && sec <= 90) return false;

    const v = parseFloat(entry["Views"] || 0);
    if (views === "low" && v >= 500) return false;
    if (views === "med" && (v < 500 || v > 5000)) return false;
    if (views === "high" && v <= 5000) return false;

    return true;
  });

  return sortVideos(filtered, sortBy);
}

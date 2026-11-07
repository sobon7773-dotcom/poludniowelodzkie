
// ==========================================
// POŁUDNIOWE ŁÓDZKIE – ETS2 MAP PROJECT
// ==========================================

// Hasło demonstracyjne – zmień przed publikacją.
// Panel po stronie przeglądarki nie jest bezpiecznym
// systemem administracyjnym do publicznego używania.
const ADMIN_PASSWORD = "PL2026";

// ==========================================
// MENU MOBILNE
// ==========================================

function toggleMenu() {
    document.querySelector("nav").classList.toggle("active");
}

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector("nav").classList.remove("active");
    });
});

// ==========================================
// MAPA
// ==========================================

const map = L.map("map").setView([51.12, 19.38], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
}).addTo(map);

const locations = [
    {
        name: "Radomsko",
        type: "Gmina miejska",
        coords: [51.067, 19.444],
        color: "#bd1018"
    },
    {
        name: "Lgota Wielka",
        type: "Gmina wiejska",
        coords: [51.15, 19.33],
        color: "#ffca05"
    },
    {
        name: "Dobryszyce",
        type: "Gmina wiejska",
        coords: [51.12, 19.43],
        color: "#ffca05"
    },
    {
        name: "Sulmierzyce",
        type: "Gmina wiejska",
        coords: [51.18, 19.19],
        color: "#ffca05"
    }
];

locations.forEach(location => {
    const marker = L.circleMarker(location.coords, {
        radius: 9,
        color: location.color,
        fillColor: location.color,
        fillOpacity: 0.9,
        weight: 2
    }).addTo(map);

    marker.bindPopup(`
        <strong>${location.name}</strong><br>
        ${location.type}<br>
        <small>Obszar projektu Południowe Łódzkie</small>
    `);
});

// ==========================================
// AKTUALNOŚCI
// ==========================================

const defaultNews = [
    {
        title: "Rozpoczęcie projektu",
        text: "Projekt Południowe Łódzkie jest w trakcie tworzenia. Pracujemy nad odwzorowaniem lokalnego regionu.",
        date: "07.11.2026"
    }
];

function getNews() {
    const saved = localStorage.getItem("pl_news");
    return saved ? JSON.parse(saved) : defaultNews;
}

function renderNews() {
    const container = document.getElementById("news-list");
    container.innerHTML = "";

    const news = getNews();

    if (!news.length) {
        container.innerHTML = "<p>Brak aktualności.</p>";
        return;
    }

    news.forEach(item => {
        const card = document.createElement("article");
        card.className = "news-card";

        const date = document.createElement("small");
        date.textContent = item.date;

        const title = document.createElement("h3");
        title.textContent = item.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = item.text;

        card.append(date, title, paragraph);
        container.appendChild(card);
    });
}

function addNews() {
    const title = document.getElementById("news-title").value.trim();
    const text = document.getElementById("news-text").value.trim();

    if (!title || !text) {
        alert("Uzupełnij tytuł i treść aktualności!");
        return;
    }

    const news = getNews();

    news.unshift({
        title,
        text,
        date: new Date().toLocaleDateString("pl-PL")
    });

    localStorage.setItem("pl_news", JSON.stringify(news));

    document.getElementById("news-title").value = "";
    document.getElementById("news-text").value = "";

    renderNews();
    renderAdminNews();

    alert("Aktualność została dodana!");
}

// ==========================================
// PANEL ADMINISTRATORA
// ==========================================

function openAdmin() {
    document.getElementById("admin-modal").classList.add("show");
}

function closeAdmin() {
    document.getElementById("admin-modal").classList.remove("show");
}

function loginAdmin() {
    const password = document.getElementById("admin-password").value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById("admin-login").hidden = true;
        document.getElementById("admin-content").hidden = false;

        document.getElementById("zip-url").value =
            localStorage.getItem("pl_download_url") || "";

        renderAdminNews();
    } else {
        document.getElementById("login-error").textContent =
            "Nieprawidłowe hasło!";
    }
}

function logoutAdmin() {
    document.getElementById("admin-login").hidden = false;
    document.getElementById("admin-content").hidden = true;
    document.getElementById("admin-password").value = "";
    document.getElementById("login-error").textContent = "";
}

function renderAdminNews() {
    const container = document.getElementById("admin-news-list");
    container.innerHTML = "";

    getNews().forEach((item, index) => {
        const element = document.createElement("div");
        element.className = "news-card";

        const title = document.createElement("strong");
        title.textContent = item.title;

        const button = document.createElement("button");
        button.className = "delete-btn";
        button.textContent = "Usuń aktualność";
        button.onclick = () => deleteNews(index);

        element.append(title, document.createElement("br"), button);
        container.appendChild(element);
    });
}

function deleteNews(index) {
    if (!confirm("Czy na pewno usunąć tę aktualność?")) return;

    const news = getNews();
    news.splice(index, 1);

    localStorage.setItem("pl_news", JSON.stringify(news));

    renderNews();
    renderAdminNews();
}

// ==========================================
// POBIERANIE MAPY
// ==========================================

function saveDownload() {
    const url = document.getElementById("zip-url").value.trim();

    if (url && !/^https?:\/\/|^\/|^\.{1,2}\//i.test(url)) {
        alert("Podaj poprawny adres URL lub ścieżkę do pliku.");
        return;
    }

    localStorage.setItem("pl_download_url", url);
    updateDownload();

    alert("Ustawienia pobierania zapisane!");
}

function updateDownload() {
    const url = localStorage.getItem("pl_download_url");
    const button = document.getElementById("download-button");
    const status = document.getElementById("download-status");

    if (url) {
        button.href = url;
        button.classList.remove("disabled");
        button.textContent = "POBIERZ MAPĘ ↓";
        button.target = "_blank";
        button.rel = "noopener noreferrer";
        status.textContent = "Plik mapy jest dostępny do pobrania.";
    } else {
        button.href = "#";
        button.classList.add("disabled");
        button.textContent = "POBIERANIE WKRÓTCE";
        button.removeAttribute("target");
        status.textContent = "Projekt jest obecnie w trakcie tworzenia.";
    }
}

// ==========================================
// URUCHOMIENIE
// ==========================================

renderNews();
updateDownload();

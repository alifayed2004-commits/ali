/* ---------- Config Data ---------- */
const VIDEOS = [
    { src: "video1.mp4.mp4", title: "فيديو 1" },
    { src: "video2.mp4", title: "فيديو 2" },
    { src: "video3.mp4", title: "فيديو 3" }
];

const PHOTOS = [
    { src: "love1.jpeg.jpeg", title: "صورة 1" },
    { src: "", title: "صورة 2" },
    { src: "img3.jpg", title: "صورة 3" }
];

const LOVE_LETTER = `يا حبيب قلبي،

أولاً: عاوز أقولك إنك أجمل حاجة حصلتلي في حياتي.

كل يوم بصحى من النوم، أول حاجة بفكر فيها هي أنتِ.

بتخليني أضحك من غير سبب،
وبتخليني أحس إني أقوى شخص في الدنيا.

مش عارف أتخيل يوم واحد من غيرك.

أنتِ نصي التاني، وأحلى نص.

بحبك أكتر من أي حاجة في الدنيا.

❤️ Forever Yours ❤️`;

const START_DATE = new Date("2024-11-22T00:00:00");

/* ---------- State ---------- */
let currentVideoIndex = 0;
let currentPhotoIndex = 0;
let typingInterval = null;
let counterInterval = null;
let envelopeOpened = false;

/* ---------- DOM Elements ---------- */
const passwordInput = document.getElementById("password-input");
const passwordBtn = document.getElementById("password-btn");
const passwordError = document.getElementById("password-error");

const videoEl = document.getElementById("memory-video");
const videoSource = videoEl.querySelector("source");
const videoTitle = document.getElementById("video-title");
const videoPrev = document.getElementById("video-prev");
const videoNext = document.getElementById("video-next");

const photoEl = document.getElementById("gallery-img");
const photoTitle = document.getElementById("photo-title");
const photoPrev = document.getElementById("photo-prev");
const photoNext = document.getElementById("photo-next");

const typingText = document.getElementById("typing-text");

const envelope = document.getElementById("envelope");
const envelopeHint = document.getElementById("envelope-hint");

const restartBtn = document.getElementById("restart-btn");

/* ---------- Password Screen ---------- */
passwordBtn.addEventListener("click", checkPassword);
passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
});

function checkPassword() {
    const val = passwordInput.value.trim().toLowerCase();
    if (val === "love") {
        passwordError.textContent = "";
        goToScreen("screen-welcome");
    } else {
        passwordError.textContent = "باسورد غلط يا حب! جرب تاني ❤️";
        passwordInput.classList.add("shake");
        setTimeout(() => passwordInput.classList.remove("shake"), 500);
    }
}

/* ---------- Navigation ---------- */
function goToScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active");
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add("active");
        onScreenEnter(screenId);
    }
}

function onScreenEnter(screenId) {
    // Hide all next buttons first
    document.querySelectorAll(".next-btn").forEach(btn => btn.classList.add("hidden"));

    // Show next button after 3 seconds for the current screen
    const activeScreen = document.getElementById(screenId);
    const nextBtn = activeScreen?.querySelector(".next-btn");
    if (nextBtn) {
        setTimeout(() => {
            nextBtn.classList.remove("hidden");
        }, 3000);
    }

    // Screen-specific logic
    switch (screenId) {
        case "screen-letter":
            startTypingAnimation();
            break;
        case "screen-videos":
            loadVideo(0);
            break;
        case "screen-gallery":
            loadPhoto(0);
            break;
        case "screen-counter":
            startCounter();
            break;
        case "screen-envelope":
            resetEnvelope();
            break;
        case "screen-final":
            createStars();
            break;
    }
}

// Attach click handlers to all next buttons
function initNextButtons() {
    document.querySelectorAll(".next-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            if (target) goToScreen(target);
        });
    });
}

/* ---------- Typing Animation ---------- */
function startTypingAnimation() {
    typingText.innerHTML = '<span class="typing-cursor"></span>';
    let i = 0;
    if (typingInterval) clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        if (i < LOVE_LETTER.length) {
            typingText.innerHTML = LOVE_LETTER.substring(0, i + 1) + '<span class="typing-cursor"></span>';
            i++;
        } else {
            clearInterval(typingInterval);
            typingText.innerHTML = LOVE_LETTER;
        }
    }, 50);
}

/* ---------- Video Gallery ---------- */
function loadVideo(index) {
    currentVideoIndex = index;
    if (currentVideoIndex < 0) currentVideoIndex = VIDEOS.length - 1;
    if (currentVideoIndex >= VIDEOS.length) currentVideoIndex = 0;

    const video = VIDEOS[currentVideoIndex];
    videoSource.src = video.src;
    videoEl.load();
    videoTitle.textContent = video.title;
}

videoPrev.addEventListener("click", () => loadVideo(currentVideoIndex - 1));
videoNext.addEventListener("click", () => loadVideo(currentVideoIndex + 1));

/* ---------- Photo Gallery ---------- */
function loadPhoto(index) {
    let newIndex = index;
    if (newIndex < 0) newIndex = PHOTOS.length - 1;
    if (newIndex >= PHOTOS.length) newIndex = 0;

    const photo = PHOTOS[newIndex];
    currentPhotoIndex = newIndex;

    photoEl.style.opacity = "0";
    setTimeout(() => {
        photoEl.src = photo.src;
        photoTitle.textContent = photo.title;
        photoEl.style.opacity = "1";
    }, 300);
}

photoPrev.addEventListener("click", () => loadPhoto(currentPhotoIndex - 1));
photoNext.addEventListener("click", () => loadPhoto(currentPhotoIndex + 1));

/* ---------- Love Counter ---------- */
function startCounter() {
    updateCounter();
    if (counterInterval) clearInterval(counterInterval);
    counterInterval = setInterval(updateCounter, 1000);
}

function updateCounter() {
    const now = new Date();
    const diff = now - START_DATE;
    const nextAnniversary = getNextAnniversary(START_DATE, now);
    const annDiff = nextAnniversary - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const annDays = Math.floor(annDiff / (1000 * 60 * 60 * 24));
    const annHours = Math.floor((annDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const annMinutes = Math.floor((annDiff % (1000 * 60 * 60)) / (1000 * 60));
    const annSeconds = Math.floor((annDiff % (1000 * 60)) / 1000);

    setCounterVal("days", days);
    setCounterVal("hours", hours);
    setCounterVal("minutes", minutes);
    setCounterVal("seconds", seconds);

    setCounterVal("ann-days", annDays);
    setCounterVal("ann-hours", annHours);
    setCounterVal("ann-minutes", annMinutes);
    setCounterVal("ann-seconds", annSeconds);
}

function setCounterVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function getNextAnniversary(start, now) {
    let next = new Date(start);
    next.setFullYear(now.getFullYear());
    if (next <= now) {
        next.setFullYear(now.getFullYear() + 1);
    }
    return next;
}

/* ---------- Envelope ---------- */
function resetEnvelope() {
    envelopeOpened = false;
    envelope.classList.remove("opened");
    envelopeHint.textContent = "اضغط على الظرف لفتحه";
    envelopeHint.style.display = "block";
}

envelope.addEventListener("click", () => {
    if (!envelopeOpened) {
        envelopeOpened = true;
        envelope.classList.add("opened");
        envelopeHint.style.display = "none";
    }
});

/* ---------- Stars Background ---------- */
function createStars() {
    const container = document.getElementById("stars-container");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 80; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        star.style.animationDuration = (1.5 + Math.random() * 2) + "s";
        const size = 1 + Math.random() * 2;
        star.style.width = size + "px";
        star.style.height = size + "px";
        container.appendChild(star);
    }
}

/* ---------- Floating Hearts ---------- */
function createFloatingHearts() {
    const container = document.getElementById("hearts-container");
    if (!container) return;
    const hearts = ["❤️", "💖", "💕", "💗", "💓", "💝"];
    setInterval(() => {
        const heart = document.createElement("div");
        heart.className = "heart-particle";
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "%";
        heart.style.fontSize = (14 + Math.random() * 22) + "px";
        heart.style.animationDuration = (4 + Math.random() * 6) + "s";
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }, 800);
}

/* ---------- Restart ---------- */
restartBtn.addEventListener("click", () => {
    if (counterInterval) clearInterval(counterInterval);
    if (typingInterval) clearInterval(typingInterval);
    passwordInput.value = "";
    passwordError.textContent = "";
    envelopeOpened = false;
    envelope.classList.remove("opened");
    goToScreen("screen-welcome");
});

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    initNextButtons();
    createFloatingHearts();

    const welcomeNext = document.querySelector("#screen-welcome .next-btn");
    if (welcomeNext) {
        setTimeout(() => welcomeNext.classList.remove("hidden"), 3000);
    }
});

/* =========================
   MOBILE MENU
========================= */

const menuBtn =
document.getElementById("menuBtn");

const mobileMenu =
document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

});


mobileMenu
.querySelectorAll("a")
.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

    });

});



/* =========================
   SCROLL PROGRESS
========================= */

const progress =
document.getElementById("progress");

window.addEventListener("scroll", () => {

    const max =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const value =
        max > 0 ? window.scrollY / max : 0;

    progress.style.transform =
        `scaleX(${value})`;

}, {
    passive: true
});



/* =========================
   REVEAL ANIMATION
========================= */

const revealObserver =
new IntersectionObserver(
(entries, observer) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        }

    });

},
{
    threshold: .12
});


document
.querySelectorAll(".reveal")
.forEach(element => {

    revealObserver.observe(element);

});



/* =========================
   ACTIVE NAV
========================= */

const sections =
document.querySelectorAll(
"main section[id]"
);

const navLinks =
document.querySelectorAll(
".navlinks a"
);


const navObserver =
new IntersectionObserver(
entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting)
            return;

        navLinks.forEach(link =>
            link.classList.remove("active")
        );

        const link =
            document.querySelector(
                `.navlinks a[href="#${entry.target.id}"]`
            );

        if (link)
            link.classList.add("active");

    });

},
{
    rootMargin:
        "-35% 0px -55% 0px"
});


sections.forEach(section =>
    navObserver.observe(section)
);



/* =========================
   PARALLAX
========================= */

const blobs =
document.querySelectorAll(".blob");

window.addEventListener("scroll", () => {

    const y =
        window.scrollY;

    blobs.forEach((blob, index) => {

        blob.style.transform =
            `translate3d(
                ${Math.sin(y * .002 + index) * 14}px,
                ${y * (index ? -.035 : .02)}px,
                0
            )`;

    });

}, {
    passive: true
});



/* =========================
   MUSIC
========================= */

const musicPlayer =
document.getElementById("musicPlayer");

const bgAudio =
document.getElementById("bgAudio");

const musicBtn =
document.getElementById("musicBtn");

const prevMusic =
document.getElementById("prevMusic");

const nextMusic =
document.getElementById("nextMusic");

const musicClose =
document.getElementById("musicClose");

const musicTitle =
document.getElementById("musicTitle");

const musicProgress =
document.getElementById("musicProgress");

const musicTracks = [
    "Chub1na.ge ჩუბინა.mp3",
    "houseoftherisingsun.mp3",
    "jvke_golden_hour.mp3",
    "River Flows In You  Loveable (MobilesRingtones.com).mp3",
    "violin.mp3"
];

let playing = false;
let userPaused = false;
let currentTrack = "";

function chooseRandomTrack() {

    const availableTracks =
        musicTracks.filter(track => track !== currentTrack);

    currentTrack =
        availableTracks[Math.floor(Math.random() * availableTracks.length)];

    bgAudio.src = `audio/${encodeURIComponent(currentTrack)}`;
    musicTitle.textContent = currentTrack;
    bgAudio.load();

}

function updateMusicUi() {

    playing = !bgAudio.paused;

    musicPlayer.classList.toggle(
        "playing",
        playing
    );

    musicBtn.textContent =
        playing ? "Ⅱ" : "▶";

}


function updateMusicProgress() {

    const value =
        bgAudio.duration
            ? bgAudio.currentTime / bgAudio.duration * 100
            : 0;

    musicProgress.style.width =
        `${value}%`;

}


function startMusic() {

    return bgAudio.play()
        .then(() => {

            updateMusicUi();

            musicSubtitle.textContent =
                "Rijo's portfolio · ambient";

            return true;

        })
        .catch(() => {

            updateMusicUi();

            musicSubtitle.textContent =
                "Press play to start music";

            return false;

        });

}


function stopMusic() {

    userPaused = true;

    bgAudio.pause();

    updateMusicUi();

}



/* TOGGLE */

function toggleMusic() {

    if (playing) {

        stopMusic();

    } else {

        userPaused = false;

        startMusic();

    }

}



/* NEXT / PREVIOUS */

function changeTrack(direction) {

    chooseRandomTrack();
    userPaused = false;

    if (direction < 0)
        bgAudio.currentTime = 0;

    startMusic();

}



/* CLICK BANNER */

musicPlayer.addEventListener(
    "click",
    event => {

        if (
            event.target.closest(
                ".music-control,.music-close"
            )
        )
            return;


        toggleMusic();

    }
);



/* PLAY BUTTON */

musicBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleMusic();

    }
);



/* PREVIOUS */

prevMusic.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        changeTrack(-1);

    }
);



/* NEXT */

nextMusic.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        changeTrack(1);

    }
);



/* COLLAPSE */

musicClose.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        musicPlayer.classList.toggle(
            "collapsed"
        );

        musicClose.setAttribute(
            "aria-expanded",
            String(!musicPlayer.classList.contains("collapsed"))
        );

    }
);


const terminal =
document.querySelector(".terminal");

if (
    terminal &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(pointer: fine)").matches
) {
    terminal.addEventListener("pointermove", event => {

        const bounds =
            terminal.getBoundingClientRect();

        const x =
            (event.clientX - bounds.left) / bounds.width - .5;

        const y =
            (event.clientY - bounds.top) / bounds.height - .5;

        terminal.style.transform =
            `perspective(900px) rotateY(${x * 8}deg) rotateX(${y * -6}deg)`;

    });

    terminal.addEventListener("pointerleave", () => {
        terminal.style.transform = "";
    });
}



const interactionEvents = [
    "click",
    "touchstart",
    "keydown"
];


function removeMusicUnlockListeners() {

    interactionEvents.forEach(event => {

        window.removeEventListener(
            event,
            unlockMusic
        );

    });

}


function unlockMusic() {

    if (playing) {
        removeMusicUnlockListeners();
        return;
    }

    if (userPaused)
        return;

    startMusic()
        .then(started => {

            if (started)
                removeMusicUnlockListeners();

        });

}


interactionEvents.forEach(event => {

    window.addEventListener(
        event,
        unlockMusic,
        { passive: true }
    );

});


bgAudio.addEventListener(
    "play",
    updateMusicUi
);

bgAudio.addEventListener(
    "pause",
    updateMusicUi
);

bgAudio.addEventListener(
    "timeupdate",
    updateMusicProgress
);

bgAudio.addEventListener(
    "ended",
    () => {

        chooseRandomTrack();
        startMusic();

    }
);

bgAudio.addEventListener(
    "error",
    () => {

        musicSubtitle.textContent =
            "Audio could not be loaded";

        updateMusicUi();

    }
);

bgAudio.addEventListener(
    "loadeddata",
    () => {

        if (!playing && !userPaused)
            startMusic();

    }
);

window.addEventListener(
    "pageshow",
    () => {

        if (!playing && !userPaused)
            startMusic();

    }
);

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState === "visible" &&
            !playing &&
            !userPaused
        )
            startMusic();

    }
);

const musicSubtitle =
document.querySelector(".music-subtitle");

chooseRandomTrack();
startMusic();

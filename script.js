document.addEventListener("DOMContentLoaded", () => {
    // --- Rotating Text Logic --- //
    const words = ["HELLO WORLD", "WE ARE HERE"];
    let currentIndex = 0;
    const mainWordEl = document.getElementById("main-word");

    function rotateWord() {
        currentIndex = (currentIndex + 1) % words.length;
        const nextWord = words[currentIndex];

        // Trigger reflow to restart CSS animation
        mainWordEl.classList.remove("word-transition");
        void mainWordEl.offsetWidth; // Reflow
        mainWordEl.classList.add("word-transition");

        // Delay exact text change slightly to sync with blur animation
        setTimeout(() => {
            mainWordEl.textContent = nextWord;
            mainWordEl.setAttribute("data-text", nextWord);
        }, 100);
    }

    // Change word every 3 seconds
    setInterval(rotateWord, 3000);

    // --- Clock Logic --- //
    const sysHour = document.getElementById("sys-hour");
    const sysMin = document.getElementById("sys-min");
    const sysSec = document.getElementById("sys-sec");
    const sysDay = document.getElementById("sys-day");
    const sysMonth = document.getElementById("sys-month");

    function updateTime() {
        const now = new Date();
        if (sysHour) sysHour.textContent = String(now.getHours()).padStart(2, '0');
        if (sysMin) sysMin.textContent = String(now.getMinutes()).padStart(2, '0');
        if (sysSec) sysSec.textContent = String(now.getSeconds()).padStart(2, '0');
        if (sysDay) sysDay.textContent = String(now.getDate()).padStart(2, '0');
        if (sysMonth) sysMonth.textContent = String(now.getMonth() + 1).padStart(2, '0');
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- Data Stream Logic --- //
    const streamReadout = document.getElementById("stream-readout");
    const miniBars = document.querySelectorAll(".mb");

    // Fast update for hacker data stream feeling
    setInterval(() => {
        if (streamReadout) {
            // Generate random hex representing some imaginary data
            const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
            streamReadout.textContent = `0x${hex}`;
        }

        if (miniBars.length > 0) {
            miniBars.forEach(bar => {
                const height = Math.floor(Math.random() * 100) + 5;
                bar.style.height = `${height}%`;
                // flash bright purple sometimes
                if (Math.random() > 0.8) {
                    bar.style.background = "var(--accent)";
                } else {
                    bar.style.background = "var(--accent-dim)";
                }
            });
        }
    }, 120);

    // --- Diagnostic Panel Fake Updates --- //
    const memUsage = document.getElementById("mem-usage");
    setInterval(() => {
        const fakeMem = (Math.random() * 8 + 30).toFixed(1);
        if (memUsage) memUsage.textContent = `${fakeMem}MB`;
    }, 1500);

    const netPing = document.getElementById("net-ping");
    setInterval(() => {
        const fakePing = Math.floor(Math.random() * 15 + 8);
        if (netPing) netPing.textContent = `${fakePing}ms`;
    }, 2500);

    // --- Social Links Hover Sound Effect Placeholder --- //
    // If you add UI sounds later, you can bind them here
    const icons = document.querySelectorAll('.social-icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            // Placeholder: Could play a subtle hover tick here
            icon.style.transform = "translateY(-5px) scale(1.1)";
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = "";
        });
    });

    // --- Discord Popup Logic --- //
    const discordIcon = document.querySelector('.fa-discord').closest('a');
    const discordModal = document.getElementById('discord-modal');
    const closeDiscord = document.getElementById('close-discord');

    if (discordIcon && discordModal) {
        discordIcon.addEventListener('click', (e) => {
            e.preventDefault();
            discordModal.classList.remove('hidden');
            setTimeout(() => discordModal.classList.add('active'), 50);

            // Re-trigger glitch animation
            const glitchText = discordModal.querySelector('.glitch');
            if (glitchText) {
                glitchText.style.animation = 'none';
                void glitchText.offsetWidth; // trigger reflow
                glitchText.style.animation = null;
            }
        });
    }

    if (closeDiscord && discordModal) {
        closeDiscord.addEventListener('click', () => {
            discordModal.classList.remove('active');
            setTimeout(() => {
                discordModal.classList.add('hidden');
            }, 400); // match CSS transition duration
        });
    }

    // --- Dynamic Modal System --- //
    const detailBtns = document.querySelectorAll('.detail-btn');
    const modalOverlay = document.getElementById('details-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalGallery = document.getElementById('modal-gallery');

    // Actual image data from the user's assets folder
    const projectImages = {
        msn: [
            "assets/msn/msn1.png",
            "assets/msn/msn2.png",
            "assets/msn/msn3.png",
            "assets/msn/msn4.png",
            "assets/msn/msn5.png"
        ],
        celestial: [
            "assets/celestial/ss1.png",
            "assets/celestial/ss2.png"
        ],
        cs2: []
    };

    const projectNames = {
        msn: "MSN_REVIVE_DATA",
        celestial: "CELESTIAL_ROBLOX_LOGS",
        cs2: "_not_done_"
    };

    detailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const images = projectImages[projectKey] || [];

            // Set Title
            const pName = projectNames[projectKey] || "UNKNOWN_DATA";
            modalTitle.textContent = pName;
            modalTitle.setAttribute("data-text", pName);

            // Clear old images
            modalGallery.innerHTML = '';

            // Inject new images
            images.forEach((src, index) => {
                const container = document.createElement('div');
                container.className = 'gallery-img-container';
                // Staggered animation delay based on index
                container.style.animationDelay = `${index * 0.15}s`;

                const img = document.createElement('img');
                img.src = src;
                img.className = 'gallery-img';

                container.appendChild(img);
                modalGallery.appendChild(container);

                // Click to view fullscreen
                container.addEventListener('click', () => {
                    const viewer = document.getElementById('image-viewer');
                    const viewerImg = document.getElementById('viewer-img');
                    if (viewer && viewerImg) {
                        viewerImg.src = src;
                        viewer.classList.remove('hidden');
                        setTimeout(() => viewer.classList.add('active'), 50);
                    }
                });
            });

            // Show modal
            modalOverlay.classList.remove('hidden');
            // Small timeout to allow display:block to apply before animating opacity
            setTimeout(() => {
                modalOverlay.classList.add('active');
                // Trigger reveal animations on images
                const addedContainers = modalGallery.querySelectorAll('.gallery-img-container');
                addedContainers.forEach(c => c.classList.add('reveal'));
            }, 50);
        });
    });

    closeModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 400); // match CSS transition duration
    });

    // --- Image Viewer Close Logic --- //
    const viewerOverlay = document.getElementById('image-viewer');
    const closeViewer = document.getElementById('close-viewer');

    if (closeViewer && viewerOverlay) {
        closeViewer.addEventListener('click', () => {
            viewerOverlay.classList.remove('active');
            setTimeout(() => {
                viewerOverlay.classList.add('hidden');
                document.getElementById('viewer-img').src = ''; // reset source
            }, 300);
        });
    }
});

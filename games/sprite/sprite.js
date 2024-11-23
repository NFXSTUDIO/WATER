    // Variables
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const folder = 'Penguins/TenderBud';
const fichier = 'Penguins/animationData.json';
let x_offset = 0, y_offset = 0, animation_played = false, animation_after_id = null;
let w = [], h = [], x = [], y = [], imgPaths = [], currentAnimation = 'idleSpin';

const audio = document.getElementById('myAudio');

    // Fonction pour démarrer l'audio automatiquement
function playAudio() {
    audio.play();
}

// Fetch JSON data
async function fetchJsonData() {
    const response = await fetch(fichier);
    const data = await response.json();
    return data['TenderBud'][currentAnimation];
}

// Extract animation data
function extractAnimationData(animData) {
    w = animData.map(frame => frame.w);
    h = animData.map(frame => frame.h);
    x = animData.map(frame => frame.x);
    y = animData.map(frame => frame.y);
}

// Load images
function loadImages() {
    imgPaths = [];
    for (let i = 0; i < w.length; i++) {
        const img = new Image();
        img.src = `${folder}/${currentAnimation}/${i}.png`;
        imgPaths.push(img);
    }
}

// Display image on canvas
function showImage(index) {
    const img = imgPaths[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x[index] + x_offset, y[index] + y_offset, w[index], h[index]);
}

// Animation loop
function animate(index = 0) {
    if (!animation_played) return;

    showImage(index);
    const nextIndex = (index + 1) % imgPaths.length;
    animation_after_id = setTimeout(() => animate(nextIndex), 1000 / 15); // 15 fps
}

// Stop current animation
function stopAnimation() {
    if (animation_after_id) {
        clearTimeout(animation_after_id);
        animation_after_id = null;
    }
    animation_played = false;
}

// Handle keydown events for movement
function moveUp() {
    if (y[0] + y_offset > 0) y_offset -= 10;
    playAnimation('walk_N');
}

function moveDown() {
    if (y[0] + y_offset < 800 - h[0]) y_offset += 10;
    playAnimation('walk_S');
}

function moveLeft() {
    if (x[0] + x_offset > 0) x_offset -= 10;
    playAnimation('walk_W');
}

function moveRight() {
    if (x[0] + x_offset < 800 - w[0]) x_offset += 10;
    playAnimation('walk_E');
}

function idle() {
    if (!animation_played) playAnimation('idleSpin');
}

// Play animation based on the type
async function playAnimation(animType) {
    if (animation_played && currentAnimation === animType) return; // Avoid restarting the same animation

    stopAnimation();
    currentAnimation = animType;

    const animData = await fetchJsonData();
    extractAnimationData(animData);
    loadImages();

    animation_played = true;
    animate();
}

// Move sprite to mouse position
function moveToMouse(event) {
    x_offset = event.offsetX - x[0];
    y_offset = event.offsetY - y[0];
    playAnimation('idleSpin');
}

// Event listeners
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'z': moveUp(); break;
        case 's': moveDown(); break;
        case 'q': moveLeft(); break;
        case 'd': moveRight(); break;
        case 'e': idle(); break;
    }
});

window.addEventListener('keyup', stopAnimation);
canvas.addEventListener('click', moveToMouse);

// Initialize the animation
fetchJsonData().then(animData => {
    extractAnimationData(animData);
    loadImages();
    playAnimation('idleSpin');
});
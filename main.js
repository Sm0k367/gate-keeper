/**
 * VIP OVERRIDE ENGINE v5.0
 * Architect: DJ SMOKE STREAM // LEGION ENGINE
 */

let scene, camera, renderer, particles, analyser, dataArray;
const audio = document.getElementById('audio-engine');
const lyricText = document.getElementById('lyric-text');
const fxTag = document.getElementById('fx-tag');
const timerDisplay = document.getElementById('global-timer');

// THE TIMELINE ARCHIVE (480 Seconds)
const timeline = [
    { time: 0, fx: "INITIALIZING", text: "VIP OVERRIDE // ACTIVE" },
    { time: 15, fx: "SPOKEN WORD FX", text: "Welcome to the inner sanctum." },
    { time: 25, fx: "SPOKEN WORD FX", text: "Leave your inhibitions at the coat check." },
    { time: 45, fx: "VINYL SCRATCHING", text: "[ OVERRIDE INITIATED ]" },
    { time: 60, fx: "THE DROP", text: "MIDNIGHT FRICTION. SKIN ON SKIN." },
    { time: 75, fx: "VERSE 1", text: "LET THE ALGORITHM LET YOU IN." },
    { time: 90, fx: "VERSE 1", text: "SEARCH THE DATA. NOWHERE TO HIDE." },
    { time: 105, fx: "VERSE 1", text: "DEEP IN THE HEART OF THE VIP." },
    { time: 135, fx: "PRE-CHORUS", text: "SYSTEM OVERLOAD. READY TO PEAK." },
    { time: 135, fx: "EXPLOSIVE DROP", text: "GIVE ME THAT VIP OVERRIDE!" },
    { time: 180, fx: "TURNTABLISM", text: "DJ SMOKE STREAM // MASTER OF FLOW" },
    { time: 225, fx: "VERSE 2", text: "THE SOUNDFORGE IS WET. THE SCRIPTSMITH IS TIGHT." },
    { time: 330, fx: "BRIDGE", text: "ONE FOR THE BODY. TWO FOR THE MIND." },
    { time: 420, fx: "SCRATCH SOLO", text: "SMOKE STREAM! (REPEAT_SYNC)" },
    { time: 450, fx: "OUTRO", text: "THE EXIT... HAS BEEN DELETED." }
];

document.getElementById('initialize-btn').addEventListener('click', () => {
    initThree();
    initAudio();
    gsap.to("#overlay", { y: "-100%", duration: 1.5, ease: "expo.inOut" });
    gsap.to("#interface-hud", { opacity: 1, duration: 2 });
    audio.play();
});

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create Cosmic Grid
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 5000; i++) {
        vertices.push(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0x00f2ff, size: 2, transparent: true });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 500;
    animate();
}

function initAudio() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const source = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function animate() {
    requestAnimationFrame(animate);

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let bass = dataArray[2]; // Low frequency
        
        // React Three.js to Audio
        particles.rotation.y += 0.001 + (bass / 1000);
        particles.scale.x = 1 + (bass / 200);
        
        // React CSS to Audio
        document.documentElement.style.setProperty('--pulse-intensity', `${bass / 4}px`);
        if (bass > 210) {
            document.body.classList.add('bass-shake');
        } else {
            document.body.classList.remove('bass-shake');
        }
    }

    updateTimeline();
    renderer.render(scene, camera);
}

function updateTimeline() {
    let current = audio.currentTime;
    
    // Timer Display
    let mins = Math.floor(current / 60);
    let secs = Math.floor(current % 60);
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:FF`;

    // Lyric Mapping
    timeline.forEach(item => {
        if (current >= item.time) {
            if (lyricText.innerText !== item.text) {
                fxTag.innerText = `[ ${item.fx} ]`;
                lyricText.innerText = item.text;
                gsap.fromTo("#lyric-container", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
            }
        }
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

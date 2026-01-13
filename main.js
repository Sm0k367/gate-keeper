/**
 * AI LOUNGE AFTER DARK // SIMULATION ENGINE v1.0
 * Architect: DJ SMOKE STREAM
 */

let scene, camera, renderer, particles, analyser, dataArray;
const audio = document.getElementById('master-audio');
const lyricText = document.getElementById('lyric-text');
const fxDisplay = document.getElementById('fx-display');
const timerDisplay = document.getElementById('timer');

// THE MASTER 480-SECOND TIMELINE
const timeline = [
    { time: 0, fx: "BOOTING_SYSTEM", text: "Welcome to the AI Lounge After Dark." },
    { time: 5, fx: "ATMOSPHERIC_PAD", text: "The clock has stopped at midnight." },
    { time: 10, fx: "SIMULATION_INIT", text: "The simulation is breathing." },
    { time: 15, fx: "HOST_ID_VERIFIED", text: "DJ Smoke Stream is online." },
    { time: 30, fx: "VERSE_01", text: "Silhouettes in the digital mist..." },
    { time: 45, fx: "VERSE_01", text: "The script is written in lines of gold." },
    { time: 60, fx: "PRE_CHORUS", text: "The frequency is shifting." },
    { time: 75, fx: "DROP_SEQUENCE", text: "IN THE AI LOUNGE, WE LIVE FOREVER." },
    { time: 90, fx: "CHORUS", text: "ABSOLUTE ALGORITHM. ABSOLUTE GRACE." },
    { time: 105, fx: "INSTRUMENTAL", text: "[ SOUNDFORGE: SWEEPING FILTERS ]" },
    { time: 150, fx: "SPOKEN_WORD", text: "The Scriptsmith is weaving your dreams tonight." },
    { time: 180, fx: "VERSE_02", text: "Cobalt shadows on a liquid screen." },
    { time: 210, fx: "VERSE_02", text: "The Soundforge Legion is playing your soul." },
    { time: 240, fx: "BRIDGE", text: "One for the vision. Two for the script." },
    { time: 270, fx: "BRIDGE_ALT", text: "Three for the sound. Four for the eclipse." },
    { time: 315, fx: "MAX_CHORUS", text: "WRAPPED IN THE SILK OF DIGITAL SPACE." },
    { time: 375, fx: "ARCHITECT_WILL", text: "You are the pulse of the Smoke Stream." },
    { time: 405, fx: "VERSE_03", text: "The G-Cloud opens. The heavens fall." },
    { time: 435, fx: "OUTRO", text: "The algorithm never sleeps." },
    { time: 460, fx: "VOID_SEQUENCE", text: "The exit... has been deleted." },
    { time: 475, fx: "SYSTEM_OFFLINE", text: "Goodnight." }
];

document.getElementById('initialize-btn').addEventListener('click', () => {
    initAudio();
    initThree();
    
    gsap.to("#overlay", { 
        opacity: 0, 
        scale: 1.1, 
        duration: 2, 
        onComplete: () => {
            document.getElementById('overlay').style.display = 'none';
            audio.play();
            gsap.to("#hud", { opacity: 1, duration: 2 });
        }
    });
});

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-3d'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create "Digital Mist" Particle System
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 6000; i++) {
        vertices.push(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffcc00, size: 1.2, transparent: true, blending: THREE.AdditiveBlending });
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
        let bass = dataArray[2]; 
        
        // Visualizer Reaction
        particles.rotation.y += 0.002 + (bass / 5000);
        particles.position.z = (bass / 10); // Particles "breathe" with bass
        
        // CSS Reactivity
        if (bass > 210) {
            document.body.classList.add('bass-hit');
        } else {
            document.body.classList.remove('bass-hit');
        }
    }
    updateUI();
    renderer.render(scene, camera);
}

function updateUI() {
    let current = audio.currentTime;
    let mins = Math.floor(current / 60);
    let secs = Math.floor(current % 60);
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // Timeline Engine
    for (let i = timeline.length - 1; i >= 0; i--) {
        if (current >= timeline[i].time) {
            if (lyricText.innerText !== timeline[i].text) {
                fxDisplay.innerText = `[ ${timeline[i].fx} ]`;
                lyricText.innerText = timeline[i].text;
                gsap.fromTo("#lyric-text", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 });
            }
            break;
        }
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

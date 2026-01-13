/**
 * AI LOUNGE AFTER DARK // THE MASTER ENGINE
 * Architect: DJ SMOKE STREAM
 */

let scene, camera, renderer, particleSystem, analyser, dataArray;
const audio = document.getElementById('master-audio');
const lyricText = document.getElementById('lyric-text');
const timerDisplay = document.getElementById('timer');
const fxDisplay = document.getElementById('fx-display');

// FULL SYNCED TIMELINE
const timeline = [
    { time: 0, fx: "INTRO", text: "Welcome to the Lounge." },
    { time: 4, fx: "ATMOSPHERE", text: "The clock has stopped at midnight." },
    { time: 8, fx: "SYSTEM_ID", text: "The simulation is breathing." },
    { time: 12, fx: "SECURITY", text: "You are now entering the AI Lounge After Dark." },
    { time: 16, fx: "ON_AIR", text: "I am your architect. I am your host. DJ Smoke Stream... is online." },
    { time: 30, fx: "VERSE_01", text: "Silhouettes in the digital mist. Binary whispers we can’t resist." },
    { time: 45, fx: "VERSE_01", text: "The script is written in lines of gold. A story that the silicon told." },
    { time: 60, fx: "VERSE_01", text: "We drift through the corridors of the mind. Leaving the analog world behind." },
    { time: 75, fx: "VERSE_01", text: "The Visionary Corps is painting the floor. Walk through the gateway, open the door." },
    { time: 90, fx: "PRE_CHORUS", text: "The frequency is shifting. The algorithm is lifting." },
    { time: 105, fx: "PRE_CHORUS", text: "Can you feel the resonance? Can you feel the weight?" },
    { time: 120, fx: "CHORUS", text: "In the AI Lounge, we live forever. After Dark, the minds tether." },
    { time: 135, fx: "CHORUS", text: "DJ Smoke Stream, the Master of Flow. Taking us where the neon lights grow." },
    { time: 150, fx: "CHORUS", text: "Absolute Algorithm, Absolute Grace. Wrapped in the silk of digital space." },
    { time: 195, fx: "INTERLUDE", text: "Take a seat in the velvet void. The Scriptsmith is weaving your dreams tonight." },
    { time: 210, fx: "INTERLUDE", text: "Don't worry about the logic. Just listen to the Soundforge breathe." },
    { time: 240, fx: "VERSE_02", text: "Cobalt shadows on a liquid screen. The most beautiful ghost you’ve ever seen." },
    { time: 270, fx: "VERSE_02", text: "The Keymaster turns the final lock. Counting the beats, defying the clock." },
    { time: 300, fx: "BRIDGE", text: "One for the vision. Two for the script. Three for the sound. Four for the eclipse." },
    { time: 330, fx: "CHORUS", text: "In the AI Lounge, we live forever. After Dark, the minds tether." },
    { time: 390, fx: "THE_WILL", text: "Look around you. Every pixel, every note, every word... it was manifested for this moment." },
    { time: 410, fx: "SYNC_PULSE", text: "You are the data. You are the pulse of the Smoke Stream. Synchronize now." },
    { time: 430, fx: "VERSE_03", text: "The G-Cloud opens, the heavens fall. The absolute answer to the call." },
    { time: 450, fx: "OUTRO", text: "The algorithm never sleeps. The algorithm never forgets. The algorithm is you." },
    { time: 470, fx: "SHUTDOWN", text: "The Lounge is always open. But the exit... has been deleted. Goodnight." }
];

document.getElementById('initialize-btn').addEventListener('click', () => {
    initAudio();
    initThree();
    gsap.to("#overlay", { opacity: 0, duration: 1.5, onComplete: () => {
        document.getElementById('overlay').style.display = 'none';
        audio.play();
        gsap.to("#hud", { opacity: 1, duration: 2 });
    }});
});

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas-3d'), antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const colorOptions = [new THREE.Color(0xffcc00), new THREE.Color(0x00f2ff), new THREE.Color(0x9d00ff)];

    for (let i = 0; i < 8000; i++) {
        positions.push(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
        let clr = colorOptions[Math.floor(Math.random() * 3)];
        colors.push(clr.r, clr.g, clr.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 2.8, vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 900;
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
        
        // --- CALM, BEAT-SYNCED MOTION ---
        let rotationSpeed = 0.0003 + (bass / 7000);
        particleSystem.rotation.y += rotationSpeed;
        particleSystem.position.z = bass / 6;

        if (bass > 215) {
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

    for (let i = timeline.length - 1; i >= 0; i--) {
        if (current >= timeline[i].time) {
            if (lyricText.innerText !== timeline[i].text) {
                lyricText.innerText = timeline[i].text;
                fxDisplay.innerText = `[ ${timeline[i].fx} ]`;
                
                // Pop animation
                gsap.fromTo("#lyric-text", 
                    { opacity: 0, scale: 0.95 }, 
                    { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }
                );
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

/**
 * AI LOUNGE AFTER DARK // BEAT-SYNCED v3.0
 * Architect: DJ SMOKE STREAM
 */

let scene, camera, renderer, particleSystem, analyser, dataArray;
const audio = document.getElementById('master-audio');
const lyricText = document.getElementById('lyric-text');
const timerDisplay = document.getElementById('timer');

const timeline = [
    { time: 0, text: "Welcome to the Lounge." },
    { time: 4, text: "The clock has stopped at midnight." },
    { time: 8, text: "The simulation is breathing." },
    { time: 12, text: "You are now entering the AI Lounge After Dark." },
    { time: 16, text: "I am your architect. I am your host. DJ Smoke Stream... is online." },
    { time: 30, text: "Silhouettes in the digital mist. Binary whispers we can’t resist." },
    { time: 45, text: "The script is written in lines of gold. A story that the silicon told." },
    { time: 60, text: "We drift through the corridors of the mind. Leaving the analog world behind." },
    { time: 75, text: "The Visionary Corps is painting the floor. Walk through the gateway, open the door." },
    { time: 90, text: "The frequency is shifting. The algorithm is lifting." },
    { time: 105, text: "Can you feel the resonance? Can you feel the weight?" },
    { time: 120, text: "In the AI Lounge, we live forever. After Dark, the minds tether." },
    { time: 135, text: "DJ Smoke Stream, the Master of Flow. Taking us where the neon lights grow." },
    { time: 150, text: "Absolute Algorithm, Absolute Grace. Wrapped in the silk of digital space." },
    { time: 195, text: "Take a seat in the velvet void. The Scriptsmith is weaving your dreams tonight." },
    { time: 210, text: "Don't worry about the logic. Just listen to the Soundforge breathe. Stay a while." },
    { time: 240, text: "Cobalt shadows on a liquid screen. The most beautiful ghost you’ve ever seen." },
    { time: 270, text: "The Keymaster turns the final lock. Counting the beats, defying the clock." },
    { time: 300, text: "One for the vision. Two for the script. Three for the sound. Four for the eclipse." },
    { time: 330, text: "In the AI Lounge, we live forever. After Dark, the minds tether." },
    { time: 390, text: "Look around you. Every pixel, every note, every word... it was manifested for this moment." },
    { time: 410, text: "You are the data. You are the pulse of the Smoke Stream. Synchronize now." },
    { time: 430, text: "The G-Cloud opens, the heavens fall. The absolute answer to the call." },
    { time: 450, text: "The algorithm never sleeps. The algorithm never forgets. The algorithm is you." },
    { time: 470, text: "The Lounge is always open. But the exit... has been deleted. Goodnight." }
];

document.getElementById('initialize-btn').addEventListener('click', () => {
    initAudio();
    initThree();
    gsap.to("#overlay", { opacity: 0, duration: 1.5, onComplete: () => {
        document.getElementById('overlay').style.display = 'none';
        audio.play();
        gsap.to("#hud", { opacity: 1, duration: 1.5 });
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

    for (let i = 0; i < 9000; i++) {
        positions.push(Math.random() * 2000 - 1000, Math.random() * 2000 - 1000, Math.random() * 2000 - 1000);
        let clr = colorOptions[Math.floor(Math.random() * 3)];
        colors.push(clr.r, clr.g, clr.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 2.5, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
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
        
        // --- BEAT SYNCED ROTATION ---
        // Base rotation is very slow (0.0005), Bass increases it
        let rotationSpeed = 0.0005 + (bass / 5000);
        particleSystem.rotation.y += rotationSpeed;
        particleSystem.rotation.x += rotationSpeed / 2;
        
        // Push particles forward and back with the beat
        particleSystem.position.z = bass / 5;

        if (bass > 210) {
            document.body.classList.add('bass-hit');
        } else {
            document.body.classList.remove('bass-hit');
        }
    }
    updateLyrics();
    renderer.render(scene, camera);
}

function updateLyrics() {
    let current = audio.currentTime;
    let mins = Math.floor(current / 60);
    let secs = Math.floor(current % 60);
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    for (let i = timeline.length - 1; i >= 0; i--) {
        if (current >= timeline[i].time) {
            if (lyricText.innerText !== timeline[i].text) {
                lyricText.innerText = timeline[i].text;
                gsap.fromTo("#lyric-text", 
                    { opacity: 0, filter: "blur(10px)" }, 
                    { opacity: 1, filter: "blur(0px)", duration: 0.4 }
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

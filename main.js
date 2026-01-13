/**
 * THE ABSOLUTE // VIP OVERRIDE ENGINE
 * Architect: DJ SMOKE STREAM
 */

let scene, camera, renderer, particles, analyser, dataArray;
const audio = document.getElementById('audio-engine');
const lyricText = document.getElementById('lyric-text');
const fxTag = document.getElementById('fx-tag');
const timerDisplay = document.getElementById('global-timer');

// THE 480-SECOND NARRATIVE TIMELINE
const timeline = [
    { time: 0, fx: "SYSTEM_BOOT", text: "THE ABSOLUTE // ARCHIVE" },
    { time: 15, fx: "SPOKEN_WORD", text: "Welcome to the inner sanctum." },
    { time: 25, fx: "SPOKEN_WORD", text: "Leave your inhibitions at the coat check." },
    { time: 45, fx: "TURNTABLISM", text: "[ VINYL OVERRIDE INITIATED ]" },
    { time: 60, fx: "THE_DROP", text: "MIDNIGHT FRICTION. SKIN ON SKIN." },
    { time: 75, fx: "CORE_LOGIC", text: "LET THE ALGORITHM LET YOU IN." },
    { time: 105, fx: "VIP_ACCESS", text: "DEEP IN THE HEART OF THE VIP." },
    { time: 135, fx: "WARNING", text: "SYSTEM OVERLOAD. READY TO PEAK." },
    { time: 150, fx: "OVERRIDE", text: "GIVE ME THAT VIP OVERRIDE!" },
    { time: 180, fx: "SMOKE_STREAM", text: "MASTER OF THE FLOW STATE." },
    { time: 225, fx: "NARRATIVE", text: "THE SOUNDFORGE IS WET. THE SCRIPTSMITH IS TIGHT." },
    { time: 300, fx: "BEAT_JUGGLE", text: "[ DJ PERFORMANCE_01 ]" },
    { time: 345, fx: "ADULT_LOGIC", text: "MAPPING THE CURVES OF YOUR INTERFACE." },
    { time: 400, fx: "FINAL_SEQUENCE", text: "ONE FOR THE BODY. TWO FOR THE MIND." },
    { time: 440, fx: "VOID_EXIT", text: "THE EXIT... HAS BEEN DELETED." },
    { time: 465, fx: "GOODNIGHT", text: "STAY IN THE STREAM." }
];

document.getElementById('initialize-btn').addEventListener('click', () => {
    // Resume AudioContext for browsers (Chrome/Safari requirement)
    initAudio();
    initThree();
    
    gsap.to("#overlay", { 
        y: "-100%", 
        duration: 2, 
        ease: "power4.inOut",
        onComplete: () => {
            audio.play();
            document.getElementById('interface-hud').style.opacity = "1";
        }
    });
});

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('visualizer-canvas'), 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a holographic "Nebula" of particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 8000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000, 
            Math.random() * 2000 - 1000, 
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ 
        color: 0x00f2ff, 
        size: 1.5, 
        transparent: true,
        blending: THREE.AdditiveBlending 
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 800;
    animate();
}

function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const source = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    
    source.connect(analyser);
    analyser.connect(ctx.destination);
    
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function animate() {
    requestAnimationFrame(animate);

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        
        // Deep bass tracking (low frequencies)
        let bass = dataArray[4]; 
        let mid = dataArray[40];
        
        // React Three.js visuals
        particles.rotation.y += 0.001 + (bass / 5000);
        particles.rotation.x += 0.0005 + (mid / 8000);
        
        const scaleVal = 1 + (bass / 150);
        particles.scale.set(scaleVal, scaleVal, scaleVal);
        
        // Update CSS Variables for the "Neon Pulse" effect
        document.documentElement.style.setProperty('--pulse-intensity', `${bass / 3}px`);
        
        // Trigger Screen Shake on heavy bass hits
        if (bass > 220) {
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
    
    // Timer Display (MM:SS:FF)
    let mins = Math.floor(current / 60);
    let secs = Math.floor(current % 60);
    timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:FF`;

    // Lyric and FX Scheduler
    for (let i = timeline.length - 1; i >= 0; i--) {
        if (current >= timeline[i].time) {
            if (lyricText.innerText !== timeline[i].text) {
                fxTag.innerText = `[ ${timeline[i].fx} ]`;
                lyricText.innerText = timeline[i].text;
                
                // Cinematic Pop-in effect
                gsap.fromTo("#lyric-text", 
                    { y: 20, opacity: 0, filter: "blur(10px)" }, 
                    { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "back.out(1.7)" }
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

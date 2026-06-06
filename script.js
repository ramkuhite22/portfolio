const consoleState = {
    guess: {
        active: false,
        secretNumber: null,
        attempts: 0
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            renderProjects(data.projects);
            renderExperience(data.experience);
            initThreeJS();
            initAnimations();
            initLightbox();
            initInstallCopy();
            initCoreTicker();
            initContactForm();
            initRouting();
        })
        .catch(error => console.error('Error loading portfolio data:', error));
});

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.harness-card, .cert-card');
        if (card && !e.target.closest('.bento-action-btn')) {
            const img = card.querySelector('img');
            if (img) {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            }
        }
    });

    closeBtn.onclick = () => lightbox.style.display = 'none';
    lightbox.onclick = (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    };
}

function initInstallCopy() {
    const copyBtn = document.querySelector('.copy-install-btn');
    if (!copyBtn) return;
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('npx ram-kuhite-portfolio');
        copyBtn.className = 'bi bi-check2 text-primary';
        setTimeout(() => {
            copyBtn.className = 'bi bi-clipboard cursor-pointer copy-install-btn';
        }, 2000);
    });
}

function initCoreTicker() {
    const ticker = document.getElementById('ticker-text');
    if (!ticker) return;
    const messages = [
        "SYSTEM STATUS: ONLINE | B.COM COMPUTER APPLICATION (FINAL YEAR)",
        "LOCATION: UMRED, NAGPUR, MAHARASHTRA | R.B. COLLEGE, RTMNU",
        "FOCUS: WEB DEVELOPMENT, MSME WORKFLOWS & PUBLIC-SERVICE TECH",
        "LANGUAGES: ENGLISH, HINDI, MARATHI | FIELD SURVEY VERIFIED"
    ];
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % messages.length;
        ticker.style.opacity = 0;
        setTimeout(() => {
            ticker.textContent = messages[idx];
            ticker.style.opacity = 1;
        }, 400);
    }, 5000);
}

function renderProfile(profile) {
    document.querySelectorAll('.profile-name').forEach(el => el.textContent = profile.name.toUpperCase());
    document.getElementById('hero-badge-title').textContent = profile.title;
    document.getElementById('hero-bio-text').textContent = profile.bio;
    document.querySelector('.profile-image-main').src = profile.profileImage;
    document.querySelector('.footer-phone').textContent = `${profile.location} | ${profile.email}`;
    document.querySelectorAll('.contact-email').forEach(el => el.href = `mailto:${profile.email}`);
}

function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = projects.map(project => `
        <div class="glass-panel harness-card animate-on-scroll ${project.bentoClass || ''}">
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="absolute top-4 right-4 z-10" style="position: absolute; top: 16px; right: 16px; z-index: 10;">
                    <span class="glass-panel px-3 py-1 rounded-full text-xs font-bold text-white bg-dark border-primary" style="padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: bold; color: white; background: #011627; border: 1px solid var(--primary);"><i class="bi bi-check2-circle text-primary mr-1" style="color: var(--primary);"></i> Project</span>
                </div>
            </div>
            <div class="harness-icon"><i class="bi ${project.icon}"></i></div>
            <h3 style="font-size: 1.6rem; font-weight: 800;">${project.title}</h3>
            <p style="color: var(--text-dim); margin-top: 8px;">${project.description}</p>
            <div class="tags-container" style="margin-top: auto; padding-top: 20px; display: flex; gap: 8px; flex-wrap: wrap;">
                ${project.tags.map(tag => `
                    <span>${tag}</span>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderExperience(experience) {
    const container = document.getElementById('experience-list');
    if (!container) return;

    container.innerHTML = experience.map(exp => `
        <div class="glass-panel animate-on-scroll p-8 rounded-3xl" style="border-left: 4px solid ${exp.color}; border-radius: 24px; padding: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <h4 style="font-size: 1.4rem; font-weight: 700; color: white;">${exp.role}</h4>
                <span style="color: ${exp.color}; font-family: 'Courier New', monospace; font-weight: 800; font-size: 0.9rem; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 100px;">${exp.period}</span>
            </div>
            <div style="color: var(--primary); font-weight: 600; margin-bottom: 16px; font-size: 1rem;">${exp.company}</div>
            <p style="color: var(--text-dim); font-size: 1.05rem;">${exp.description}</p>
        </div>
    `).join('');
}

function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        anchors: true,
        allowNestedScroll: true,
        autoToggle: true,
        stopInertiaOnNavigate: true
    });

    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

function initAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    initLenis();

    gsap.from(".hero-title", { opacity: 0, y: 50, duration: 1.5, ease: "power4.out" });
    gsap.from(".hero-bio", { opacity: 0, y: 30, duration: 1.5, delay: 0.3, ease: "power4.out" });
    gsap.from(".terminal-install-badge", { opacity: 0, scale: 0.9, duration: 1.5, delay: 0.5, ease: "power4.out" });

    gsap.to(".hero-container", {
        backgroundPositionY: "50%",
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-container",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.from(".animate-on-scroll", {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 1,
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%"
        }
    });

    initTerminal();
}

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const typingStatus = document.getElementById('typing-status');
    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim().toLowerCase();
            handleCommand(command, output);
            input.value = '';
        }
    });

    document.querySelectorAll('.command-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const cmd = badge.getAttribute('data-cmd');
            if (typingStatus) typingStatus.style.display = 'inline-block';
            input.disabled = true;
            input.value = '';
            
            let i = 0;
            const interval = setInterval(() => {
                input.value += cmd.charAt(i);
                i++;
                if (i > cmd.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        if (typingStatus) typingStatus.style.display = 'none';
                        input.disabled = false;
                        handleCommand(cmd, output);
                        input.value = '';
                        input.focus();
                    }, 400);
                }
            }, 80);
        });
    });
}

function handleCommand(command, output) {
    const line = document.createElement('div');
    line.innerHTML = `<span style="color: var(--accent);">ram@portfolio-shell:~$</span> ${command}`;
    output.appendChild(line);

    const response = document.createElement('div');
    response.style.marginBottom = '16px';
    response.style.marginTop = '4px';

    switch (command) {
        case 'help':
            response.innerHTML = `Available Practical Commands: 
                <br>- <span style="color: var(--primary); font-weight: bold;">about</span>: Display personal background & education
                <br>- <span style="color: var(--accent); font-weight: bold;">skills</span>: List technical & professional competencies
                <br>- <span style="color: var(--cyan); font-weight: bold;">finscheme</span>: Check FinScheme government scheme discovery platform
                <br>- <span style="color: var(--cyan); font-weight: bold;">sahukaar</span>: Check Chota Sahukaar digital ledger concept
                <br>- <span style="color: var(--cyan); font-weight: bold;">weather</span>: Run Real-Time Weather App simulation
                <br>- <span style="color: var(--cyan); font-weight: bold;">guess</span>: Launch Number Guessing Game (C++ Intern Project)
                <br>- <span style="color: var(--cyan); font-weight: bold;">watch</span>: Run Stopwatch Chronometer application
                <br>- <span style="color: var(--cyan); font-weight: bold;">ttt</span>: Launch Tic-Tac-Toe Game (Biometric Port)
                <br>- <span style="color: var(--cyan); font-weight: bold;">ngo</span>: Display Gramin Vikas Manch NGO community work
                <br>- <span style="color: var(--cyan); font-weight: bold;">calc [x] [op] [y]</span>: Multi-tool Arithmetic Engine (e.g., calc 50 * 20)
                <br>- <span style="color: var(--cyan); font-weight: bold;">convert [inr] [usd|eur|jpy]</span>: Currency Converter Engine
                <br>- <span style="color: var(--cyan); font-weight: bold;">shape [circle|square|triangle] [val1]</span>: Geometry Engine
                <br>- <span style="color: var(--cyan); font-weight: bold;">clear</span>: Reset console buffer`;
            break;
        case 'about':
            response.innerHTML = `⚡ [ABOUT RAM KUHITE]: Final-year B.Com in Computer Application student at R.B. College, RTMNU. 
                <br>[LOCATION]: Umred, Nagpur, Maharashtra, India.
                <br>[PHILOSOPHY]: Focused on solving actual user problems instead of only building tutorial projects. Bridging technical front-end learning with real-world business and community understanding.`;
            break;
        case 'skills':
            response.innerHTML = `⚡ [TECHNICAL SKILLS]: HTML, CSS, JavaScript, C Programming, C++, JSON, Front-End Development, Basic Data Analysis, API Integration, Business Workflow Understanding.
                <br>⚡ [PROFESSIONAL SKILLS]: Problem Solving, Adaptability, Communication, Teamwork, Research, Field Survey Work, Analytical Thinking.`;
            break;
        case 'finscheme':
            response.innerHTML = `⚡ [FINSCHEME PLATFORM]: A government scheme discovery platform built for Indian users. 
                <br>[FEATURES]: Filters welfare schemes based on user eligibility inputs such as age, income, category, and location.
                <br>[TECH STACK]: HTML, CSS, JavaScript, JSON.`;
            break;
        case 'sahukaar':
            response.innerHTML = `⚡ [CHOTA SAHUKAAR]: A digital ledger management concept designed for small shopkeepers. 
                <br>[FOCUS]: MSME utility, simple workflow, local business usability. Replaces manual notebooks with clean digital udhaar and payment tracking.`;
            break;
        case 'weather':
            response.innerHTML = `⚡ Fetching Real-Time Weather API data... 
                <br>Location: Umred, Nagpur, Maharashtra 
                <br>Condition: Sunny & Clear (Optimal Field Survey Weather) 
                <br>Temp: 34°C | Humidity: 40%`;
            break;
        case 'ngo':
            response.innerHTML = `⚡ [GRAMIN VIKAS MANCH NGO]: Active community volunteer and field surveyor. 
                <br>[ACTIVITIES]: Waste management survey work under Swachh Maharashtra Abhiyan 2.0, educational survey activities, participation in 'Raste Ki Pathshala' initiative, interaction with migrant labor students, medicinal plant plantation drives.`;
            break;
        case 'guess':
            consoleState.guess.secretNumber = Math.floor(Math.random() * 100) + 1;
            consoleState.guess.attempts = 0;
            consoleState.guess.active = true;
            response.innerHTML = `⚡ Number Guessing Game Initialized (C++ Intern Project logic)... 
                <br>I am thinking of a number between 1 and 100. 
                <br>Type <span style="color: var(--accent);">guess [number]</span> to test your logic.`;
            break;
        case 'watch':
            response.innerHTML = `⚡ Stopwatch Chronometer Active: 
                <br><span style="font-size: 2.2rem; color: var(--accent); font-weight: bold;">00:00:00:00</span> 
                <br>Type <span style="color: var(--accent);">watch start|stop|reset</span> to control the timer controls.`;
            break;
        case 'ttt':
            triggerBiometricHandshake(() => {
                const termOutput = document.getElementById('terminal-output');
                const tttSuccess = document.createElement('div');
                tttSuccess.style.marginBottom = '16px';
                tttSuccess.style.marginTop = '4px';
                tttSuccess.innerHTML = `⚡ [BIOMETRIC HANDSHAKE: SUCCESS] <br><span style="color: var(--primary); font-weight: bold;">Tic-Tac-Toe Game Engine unlocked. DOM manipulation matrix active.</span>`;
                termOutput.appendChild(tttSuccess);
                termOutput.scrollTop = termOutput.scrollHeight;
            });
            return;
        case 'clear':
            output.innerHTML = `<div>⚡ Welcome to the Ram Kuhite Interactive Console v2.0</div><div class="text-dim mb-4">Explore practical digital systems, MSME workflows, and developer skills. Type <span class="text-accent font-bold">help</span> or click a badge above to execute.</div>`;
            return;
        default:
            if (command.startsWith('guess ')) {
                const parts = command.split(' ');
                const guessVal = parseInt(parts[1], 10);
                
                if (isNaN(guessVal) || guessVal < 1 || guessVal > 100) {
                    response.innerHTML = `⚡ Invalid input. Please guess a number between 1 and 100. <br>Usage: <span style="color: var(--accent);">guess [1-100]</span>`;
                } else {
                    if (!consoleState.guess.active || consoleState.guess.secretNumber === null) {
                        consoleState.guess.secretNumber = Math.floor(Math.random() * 100) + 1;
                        consoleState.guess.attempts = 0;
                        consoleState.guess.active = true;
                        response.innerHTML = `⚡ Guess registered, but no game was active. Initialized a new secret number!<br>`;
                    }
                    consoleState.guess.attempts++;
                    const attempts = consoleState.guess.attempts;
                    const secret = consoleState.guess.secretNumber;
                    
                    if (guessVal === secret) {
                        response.innerHTML += `⚡ [VICTORY] Match detected! Secret number was: <span style="color: var(--primary); font-weight: bold;">${secret}</span> in <span style="color: var(--accent); font-weight: bold;">${attempts}</span> attempts. Logic matrix solved.`;
                        consoleState.guess.active = false;
                        consoleState.guess.secretNumber = null;
                    } else if (guessVal < secret) {
                        response.innerHTML += `⚡ Analyzing logic matrix... <br>Input: ${guessVal} <br>Result: <span style="color: var(--accent); font-weight: bold;">Higher!</span> (Try again)`;
                    } else {
                        response.innerHTML += `⚡ Analyzing logic matrix... <br>Input: ${guessVal} <br>Result: <span style="color: var(--accent); font-weight: bold;">Lower!</span> (Try again)`;
                    }
                }
            } else if (command.startsWith('calc ')) {
                const parts = command.split(' ');
                const n1 = parseFloat(parts[1]);
                const op = parts[2];
                const n2 = parseFloat(parts[3]);
                let res;
                if (op === '+') res = n1 + n2;
                else if (op === '-') res = n1 - n2;
                else if (op === '*') res = n1 * n2;
                else if (op === '/') res = n1 / n2;
                else res = 'Invalid op';
                response.innerHTML = `⚡ Arithmetic Engine Result: <span style="color: var(--accent); font-weight: bold;">${res}</span>`;
            } else if (command.startsWith('convert ')) {
                const parts = command.split(' ');
                const amount = parseFloat(parts[1]);
                const curr = parts[2].toUpperCase();
                let res, sym;
                if (curr === 'USD') { res = (amount * 0.012).toFixed(2); sym = '$'; }
                else if (curr === 'EUR') { res = (amount * 0.011).toFixed(2); sym = '€'; }
                else if (curr === 'JPY') { res = (amount * 1.70).toFixed(2); sym = '¥'; }
                else { res = 'Invalid currency'; sym = ''; }
                response.innerHTML = `⚡ Currency Converter Engine: <span style="color: var(--accent); font-weight: bold;">${sym}${res} ${curr}</span>`;
            } else if (command.startsWith('shape ')) {
                const parts = command.split(' ');
                const type = parts[1];
                const v1 = parseFloat(parts[2]);
                const v2 = parseFloat(parts[3] || 0);
                let res;
                if (type === 'circle') res = `Area: ${(3.14 * v1 * v1).toFixed(2)}, Circ: ${(2 * 3.14 * v1).toFixed(2)}`;
                else if (type === 'square') res = `Area: ${v1 * v1}, Peri: ${4 * v1}`;
                else if (type === 'triangle') res = `Area: ${0.5 * v1 * v2}`;
                else res = 'Invalid shape';
                response.innerHTML = `⚡ Geometry Engine [${type}]: <span style="color: var(--accent); font-weight: bold;">${res}</span>`;
            } else {
                response.innerHTML = `⚡ Command not recognized: <span style="color: #ef4444;">${command}</span>. Type <span style="color: var(--accent); font-weight: bold;">help</span> for assistance.`;
            }
    }
    output.appendChild(response);
    output.scrollTop = output.scrollHeight;
}

function triggerBiometricHandshake(onSuccess) {
    const modal = document.getElementById('biometric-modal');
    const progress = document.getElementById('biometric-progress');
    const status = document.getElementById('biometric-status');
    if (!modal || !progress || !status) return;

    modal.style.display = 'flex';
    progress.style.width = '0%';
    status.textContent = 'Initializing acoustic array and visual sensors...';

    setTimeout(() => {
        progress.style.width = '35%';
        status.textContent = 'Scanning Hardware ID & Zero-Trust Encryption keys...';
    }, 800);

    setTimeout(() => {
        progress.style.width = '75%';
        status.textContent = 'Verifying Facial Biometrics & Developer Handshake...';
    }, 1800);

    setTimeout(() => {
        progress.style.width = '100%';
        status.textContent = 'Handshake Verified. Access Granted.';
        setTimeout(() => {
            modal.style.display = 'none';
            if (onSuccess) onSuccess();
        }, 600);
    }, 2800);
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Thank you for reaching out! Your message has been sent successfully.');
                form.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Oops! There was a problem submitting your form. Please check your internet connection.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x011627, 0.015);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sections = Array.from(document.querySelectorAll('section'));
    const spatialMap = {};
    const lookAtTarget = new THREE.Vector3(0, 0, 0);
    
    const matPrimary = new THREE.MeshPhysicalMaterial({ 
        color: 0x10b981, emissive: 0x054a33, roughness: 0.2, metalness: 0.8, clearcoat: 1.0, transmission: 0.5, ior: 1.5 
    });
    const matAccent = new THREE.MeshPhysicalMaterial({ 
        color: 0xf59e0b, emissive: 0x6b4403, roughness: 0.2, metalness: 0.8, clearcoat: 1.0, transmission: 0.5, ior: 1.5 
    });
    const matCyan = new THREE.MeshPhysicalMaterial({ 
        color: 0x06b6d4, emissive: 0x024a57, roughness: 0.2, metalness: 0.8, clearcoat: 1.0, transmission: 0.5, ior: 1.5 
    });

    const materials = [matPrimary, matAccent, matCyan];

    function createGlowingMesh(geom, colorHex) {
        const group = new THREE.Group();
        const core = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: colorHex }));
        const glow = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({
            color: colorHex, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        glow.scale.setScalar(1.2);
        group.add(core); group.add(glow);
        return group;
    }

    const glassMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, metalness: 0.2, roughness: 0.1, transmission: 0.9, ior: 1.5, clearcoat: 1.0, transparent: true, opacity: 1 
    });

    sections.forEach((sec, index) => {
        const angle = index * (Math.PI / 3.5);
        const radius = 35;
        const xPos = Math.cos(angle) * radius;
        const yPos = (Math.random() - 0.5) * 15;
        const zPos = -index * 55;
        
        spatialMap[sec.id] = { x: xPos, y: yPos, z: zPos };

        let nodeGroup = new THREE.Group();

        if (sec.id === 'home') {
            nodeGroup.add(new THREE.Mesh(new THREE.IcosahedronGeometry(7, 2), glassMat));
            nodeGroup.add(createGlowingMesh(new THREE.IcosahedronGeometry(3.5, 0), 0x10b981));
            const ring = new THREE.Mesh(new THREE.TorusGeometry(9, 0.1, 16, 100), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
            ring.rotation.x = Math.PI / 2;
            nodeGroup.add(ring);
        } else if (sec.id === 'about') {
            nodeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 12, 32, 1, true), glassMat));
            for(let i=0; i<3; i++) {
                const layer = createGlowingMesh(new THREE.CylinderGeometry(4, 4, 1, 32), 0xf59e0b);
                layer.position.y = (i - 1) * 3;
                nodeGroup.add(layer);
            }
        } else if (sec.id === 'skills') {
            for(let i=0; i<20; i++) {
                const y = (i - 10) * 0.7;
                const a = i * 0.5;
                const x1 = Math.cos(a) * 3, z1 = Math.sin(a) * 3;
                const x2 = Math.cos(a + Math.PI) * 3, z2 = Math.sin(a + Math.PI) * 3;
                const s1 = createGlowingMesh(new THREE.SphereGeometry(0.5, 16, 16), 0x10b981);
                s1.position.set(x1, y, z1); nodeGroup.add(s1);
                const s2 = createGlowingMesh(new THREE.SphereGeometry(0.5, 16, 16), 0x06b6d4);
                s2.position.set(x2, y, z2); nodeGroup.add(s2);
                const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2)]);
                nodeGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })));
            }
            nodeGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32, 1, true), glassMat));
        } else if (sec.id === 'projects') {
            for(let i=0; i<3; i++) {
                const plane = new THREE.Mesh(new THREE.BoxGeometry(8, 0.5, 6), glassMat);
                plane.position.set((i - 1) * 2, (i - 1) * 4, 0);
                plane.rotation.x = Math.PI / 6;
                nodeGroup.add(plane);
                const node = createGlowingMesh(new THREE.BoxGeometry(2, 1, 2), 0xf59e0b);
                node.position.set(plane.position.x, plane.position.y + 0.5, plane.position.z);
                node.rotation.x = plane.rotation.x;
                nodeGroup.add(node);
            }
        } else if (sec.id === 'experience') {
            const t1 = createGlowingMesh(new THREE.TorusGeometry(4, 0.5, 16, 100), 0x10b981);
            const t2 = createGlowingMesh(new THREE.TorusGeometry(4, 0.5, 16, 100), 0x06b6d4);
            t2.rotation.x = Math.PI / 2; t2.position.x = 4;
            nodeGroup.add(t1); nodeGroup.add(t2);
            nodeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(9, 32, 32), glassMat));
        } else if (sec.id === 'terminal') {
            const arrowShape = new THREE.Shape();
            arrowShape.moveTo(0, 3); arrowShape.lineTo(3, 0); arrowShape.lineTo(0, -3);
            arrowShape.lineTo(-1, -2); arrowShape.lineTo(1, 0); arrowShape.lineTo(-1, 2);
            const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, { depth: 1, bevelEnabled: false });
            arrowGeo.center();
            const arrowMesh = createGlowingMesh(arrowGeo, 0x10b981);
            arrowMesh.position.x = -2;
            const lineShape = new THREE.Shape();
            lineShape.moveTo(0, 0); lineShape.lineTo(3, 0); lineShape.lineTo(3, 1); lineShape.lineTo(0, 1);
            const lineGeo = new THREE.ExtrudeGeometry(lineShape, { depth: 1, bevelEnabled: false });
            lineGeo.center();
            const lineMesh = createGlowingMesh(lineGeo, 0x10b981);
            lineMesh.position.set(2, -1.5, 0);
            nodeGroup.add(arrowMesh); nodeGroup.add(lineMesh);
            const screen = new THREE.Mesh(new THREE.BoxGeometry(12, 8, 0.5), glassMat);
            screen.position.z = -1.5;
            nodeGroup.add(screen);
        } else if (sec.id === 'certifications') {
            const starShape = new THREE.Shape();
            for(let i=0; i<=10; i++) {
                const a = i * Math.PI / 5;
                const r = (i % 2 === 0) ? 4 : 2;
                if (i === 0) starShape.moveTo(Math.sin(a) * r, Math.cos(a) * r);
                else starShape.lineTo(Math.sin(a) * r, Math.cos(a) * r);
            }
            const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 1, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.2 });
            starGeo.center();
            nodeGroup.add(createGlowingMesh(starGeo, 0xf59e0b));
            nodeGroup.add(new THREE.Mesh(new THREE.TorusGeometry(6, 0.5, 16, 100), glassMat));
        } else if (sec.id === 'activities') {
            const phi = Math.PI * (3 - Math.sqrt(5));
            for(let i=0; i<20; i++) {
                const y = 1 - (i / 19) * 2;
                const r = Math.sqrt(1 - y * y);
                const theta = phi * i;
                const x = Math.cos(theta) * r * 6, z = Math.sin(theta) * r * 6, sy = y * 6;
                const node = createGlowingMesh(new THREE.SphereGeometry(0.8, 16, 16), 0x06b6d4);
                node.position.set(x, sy, z); nodeGroup.add(node);
                const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, sy, z), new THREE.Vector3(0,0,0)]);
                nodeGroup.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));
            }
            nodeGroup.add(createGlowingMesh(new THREE.IcosahedronGeometry(2.5, 0), 0x10b981));
        } else {
            const dish = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3), glassMat);
            dish.rotation.x = -Math.PI / 2; nodeGroup.add(dish);
            const antenna = createGlowingMesh(new THREE.CylinderGeometry(0.2, 0.2, 5), 0x10b981);
            antenna.position.z = 2.5; antenna.rotation.x = Math.PI / 2; nodeGroup.add(antenna);
            const tip = createGlowingMesh(new THREE.SphereGeometry(0.8), 0xf59e0b);
            tip.position.z = 5; nodeGroup.add(tip);
        }

        nodeGroup.position.set(xPos, yPos, zPos);
        
        nodeGroup.userData.rotSpeed = {
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.015
        };
        
        scene.add(nodeGroup);

        if (window.ScrollTrigger) {
            ScrollTrigger.create({
                trigger: sec,
                start: "top center",
                end: "bottom center",
                onEnter: () => flyToNode(sec.id),
                onEnterBack: () => flyToNode(sec.id)
            });
        }
    });

    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 300;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    camera.position.set(0, 0, 30);

    function flyToNode(id) {
        const node = spatialMap[id];
        if (!node) return;
        
        const camX = node.x + (node.x > 0 ? 15 : -15);
        const camY = node.y + 5;
        const camZ = node.z + 25;
        
        if (window.gsap) {
            gsap.to(camera.position, {
                x: camX, y: camY, z: camZ,
                duration: 2.5,
                ease: 'power3.inOut'
            });
            
            gsap.to(lookAtTarget, {
                x: node.x, y: node.y, z: node.z,
                duration: 2.5,
                ease: 'power3.inOut'
            });
        }
    }

    if (sections.length > 0) flyToNode(sections[0].id);

    function animate() {
        requestAnimationFrame(animate);
        
        scene.children.forEach(child => {
            if (child.userData.rotSpeed) {
                child.rotation.x += child.userData.rotSpeed.x;
                child.rotation.y += child.userData.rotSpeed.y;
                child.rotation.z += child.userData.rotSpeed.z;
            }
        });

        particlesMesh.rotation.y += 0.0003;
        particlesMesh.rotation.x += 0.0001;

        camera.lookAt(lookAtTarget);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initRouting() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main > section');

    const titles = {
        'home': 'Ram Kuhite | Practical Digital Systems Portfolio',
        'about': 'About Me | Ram Kuhite',
        'skills': 'Skills & Competencies | Ram Kuhite',
        'projects': 'Digital Systems & Projects | Ram Kuhite',
        'experience': 'Internships & NGO Journey | Ram Kuhite',
        'terminal': 'Interactive Shell Console | Ram Kuhite',
        'certifications': 'Professional Certifications | Ram Kuhite',
        'activities': 'Activities & Interests | Ram Kuhite',
        'contact': 'Get In Touch | Ram Kuhite'
    };

    function updateActiveLink(hash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update SEO Title
        if (titles[hash]) {
            document.title = titles[hash];
        }
    }

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
    };

    let isScrollingFromClick = false;

    const observer = new IntersectionObserver((entries) => {
        if (isScrollingFromClick) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                updateActiveLink(id);
                history.replaceState(null, null, `#${id}`);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Handle clicks on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            
            if (target && window.lenis) {
                isScrollingFromClick = true;
                updateActiveLink(targetId);
                history.pushState(null, null, href);
                
                window.lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    onComplete: () => {
                        isScrollingFromClick = false;
                    }
                });
            }
        });
    });

    // Handle initial load with deep link hash
    if (window.location.hash) {
        const initialHash = window.location.hash.substring(1);
        const target = document.getElementById(initialHash);
        if (target) {
            setTimeout(() => {
                if (window.lenis) {
                    window.lenis.scrollTo(target, {
                        offset: -100,
                        duration: 1.5,
                        immediate: true
                    });
                    updateActiveLink(initialHash);
                }
            }, 500);
        }
    } else {
        updateActiveLink('home');
    }
}

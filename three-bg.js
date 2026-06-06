import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createPill, createSyringe, createHeart, createCell } from './medical-models.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.FogExp2(0x000000, 0.015); // Add depth/fog for 3D navigation

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.setClearColor(0x050505, 1);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100vw';
renderer.domElement.style.height = '100vh';
renderer.domElement.style.zIndex = '-1';
renderer.domElement.style.pointerEvents = 'none';

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // Disable zoom to not mess up page coordinates
controls.enablePan = false;
controls.target.set(0, 0, 0);

// Post-processing
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
renderPass.clearAlpha = 0;
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.2);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

// Colors
const PURPLE = new THREE.Color(0x8a2be2);
const CYAN = new THREE.Color(0x00f2fe);
const SILVER = new THREE.Color(0xc0c0c8);

// === SECTION 1: HOME (DNA & Cross) ===
const homeGroup = new THREE.Group();
homeGroup.position.set(0, 0, 0);
scene.add(homeGroup);

// Materials for DNA
const frostedGlassPurple = new THREE.MeshPhysicalMaterial({ color: 0xc8b8e8, roughness: 0.15, transmission: 0.85, ior: 1.45, transparent: true, opacity: 0.7 });
const frostedGlassCyan = new THREE.MeshPhysicalMaterial({ color: 0xb8e8f0, roughness: 0.15, transmission: 0.85, ior: 1.45, transparent: true, opacity: 0.7 });
const metallicSilver = new THREE.MeshPhysicalMaterial({ color: SILVER, metalness: 0.95, roughness: 0.15 });

// DNA DOUBLE HELIX
const dnaGroup = new THREE.Group();
const helixHeight = 6, helixRadius = 1.6, helixTurns = 2.5, strandSegments = 200, rungCount = 28;

function createHelixStrand(phaseOffset) {
  const points = [];
  for (let i = 0; i <= strandSegments; i++) {
    const t = i / strandSegments;
    points.push(new THREE.Vector3(Math.cos(t * Math.PI * 2 * helixTurns + phaseOffset) * helixRadius, (t - 0.5) * helixHeight, Math.sin(t * Math.PI * 2 * helixTurns + phaseOffset) * helixRadius));
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), strandSegments, 0.08, 8, false), metallicSilver);
}
dnaGroup.add(createHelixStrand(0));
dnaGroup.add(createHelixStrand(Math.PI));
homeGroup.add(dnaGroup);

// Central Glow Core
const core = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(PURPLE).lerp(CYAN, 0.5), transparent: true, opacity: 0.2 }));
homeGroup.add(core);


// === SECTION 2: ABOUT US (Heart) ===
const aboutGroup = new THREE.Group();
aboutGroup.position.set(40, 0, -20);
const heart = createHeart(0xff0844);
heart.scale.setScalar(0.2); // Adjust scale
aboutGroup.add(heart);
scene.add(aboutGroup);

// === SECTION 3: DOCTORS/SERVICES (Syringe & Pill) ===
const doctorsGroup = new THREE.Group();
doctorsGroup.position.set(-40, 0, -20);

const syringe = createSyringe(0x00f2fe);
syringe.position.set(-2, 0, 0);
syringe.rotation.z = Math.PI / 4;

const pill = createPill(0xffffff, 0x8a2be2);
pill.position.set(2, 0, 0);
pill.rotation.z = -Math.PI / 6;

doctorsGroup.add(syringe, pill);
scene.add(doctorsGroup);

// === SECTION 4: APPOINTMENT (Virus/Cell) ===
const appointmentGroup = new THREE.Group();
appointmentGroup.position.set(0, 0, -40);
const cell = createCell(0x00f2fe, 0x8a2be2);
cell.scale.setScalar(2.5);
appointmentGroup.add(cell);
scene.add(appointmentGroup);


// === LIGHTING & PARTICLES ===
scene.add(new THREE.AmbientLight(0x222233, 0.5));

const purpleLight = new THREE.PointLight(PURPLE, 8, 30);
purpleLight.position.set(-2, 2, 2);
homeGroup.add(purpleLight);

const cyanLight = new THREE.PointLight(CYAN, 8, 30);
cyanLight.position.set(2, -2, 2);
homeGroup.add(cyanLight);

// Add local lights to other groups so they glow when camera reaches them
aboutGroup.add(new THREE.PointLight(0xff0844, 5, 20));
doctorsGroup.add(new THREE.PointLight(CYAN, 5, 20));
appointmentGroup.add(new THREE.PointLight(PURPLE, 5, 20));

// Particles
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(300 * 3);
for (let i = 0; i < 300; i++) {
  pPos[i*3] = (Math.random() - 0.5) * 100;
  pPos[i*3+1] = (Math.random() - 0.5) * 50;
  pPos[i*3+2] = (Math.random() - 0.5) * 100;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ color: 0xb8e8f0, size: 0.1, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(pGeo, pMat);
scene.add(particles);


// === CAMERA NAVIGATION SYSTEM ===
const pagePositions = {
    home: { cam: new THREE.Vector3(0, 2, 12), target: new THREE.Vector3(0, 0, 0) },
    about: { cam: new THREE.Vector3(40, 2, -10), target: new THREE.Vector3(40, 0, -20) },
    doctors: { cam: new THREE.Vector3(-40, 2, -10), target: new THREE.Vector3(-40, 0, -20) },
    appointment: { cam: new THREE.Vector3(0, 2, -28), target: new THREE.Vector3(0, 0, -40) },
    contact: { cam: new THREE.Vector3(20, 20, 20), target: new THREE.Vector3(0, 0, -20) } // Cinematic top view
};

window.addEventListener('pageChange', (e) => {
    const page = e.detail.page;
    if (pagePositions[page] && window.gsap) {
        const pos = pagePositions[page];
        
        // Animate Camera Position
        window.gsap.to(camera.position, {
            x: pos.cam.x, y: pos.cam.y, z: pos.cam.z,
            duration: 2.5, ease: 'power3.inOut'
        });
        
        // Animate OrbitControls Target
        window.gsap.to(controls.target, {
            x: pos.target.x, y: pos.target.y, z: pos.target.z,
            duration: 2.5, ease: 'power3.inOut'
        });
    }
});


// === ANIMATION LOOP ===
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  // Gentle rotations for all models
  homeGroup.rotation.y = elapsed * 0.2;
  aboutGroup.rotation.y = elapsed * 0.3;
  aboutGroup.position.y = Math.sin(elapsed) * 1; // Hover effect
  
  doctorsGroup.children.forEach((child, i) => {
      child.rotation.x = elapsed * (i===0? 0.4:0.2);
      child.position.y = Math.sin(elapsed + i) * 0.5;
  });

  appointmentGroup.rotation.x = elapsed * 0.1;
  appointmentGroup.rotation.y = elapsed * 0.2;

  // Particle drift
  particles.rotation.y = elapsed * 0.02;

  controls.update();
  composer.render();
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

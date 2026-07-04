import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { removeClouds } from './src/api/cloudRemovalClient.js';

// --- CITY DATABASE ---
const cities = [
    // --- EAST INDIA ---
    { name: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639 },
    { name: "Patna", country: "India", lat: 25.5941, lon: 85.1376 },
    { name: "Ranchi", country: "India", lat: 23.3441, lon: 85.3096 },
    { name: "Bhubaneswar", country: "India", lat: 20.2961, lon: 85.8245 },
    { name: "Cuttack", country: "India", lat: 20.4625, lon: 85.8830 },
    { name: "Puri", country: "India", lat: 19.8135, lon: 85.8312 },

    // --- NORTH-EAST INDIA (NER) ---
    { name: "Guwahati", country: "India", lat: 26.1158, lon: 91.7086 },
    { name: "Shillong", country: "India", lat: 25.5788, lon: 91.8933 },
    { name: "Imphal", country: "India", lat: 24.8170, lon: 93.9368 },
    { name: "Kohima", country: "India", lat: 25.6751, lon: 94.1086 },
    { name: "Aizawl", country: "India", lat: 23.7271, lon: 92.7176 },
    { name: "Agartala", country: "India", lat: 23.8315, lon: 91.2868 },
    { name: "Gangtok", country: "India", lat: 27.3389, lon: 88.6065 },
    { name: "Itanagar", country: "India", lat: 27.0844, lon: 93.6053 },
    { name: "Dibrugarh", country: "India", lat: 27.4728, lon: 94.9120 },
    { name: "Jorhat", country: "India", lat: 26.7509, lon: 94.2037 },
    { name: "Silchar", country: "India", lat: 24.8333, lon: 92.7789 },

    // --- NORTH INDIA ---
    { name: "Delhi", country: "India", lat: 28.7041, lon: 77.1025 },
    { name: "Srinagar", country: "India", lat: 34.0837, lon: 74.7973 },
    { name: "Jammu", country: "India", lat: 32.7266, lon: 74.8570 },
    { name: "Leh", country: "India", lat: 34.1526, lon: 77.5771 },
    { name: "Shimla", country: "India", lat: 31.1048, lon: 77.1734 },
    { name: "Dehradun", country: "India", lat: 30.3165, lon: 78.0322 },
    { name: "Chandigarh", country: "India", lat: 30.7333, lon: 76.7794 },
    { name: "Lucknow", country: "India", lat: 26.8467, lon: 80.9462 },
    { name: "Kanpur", country: "India", lat: 26.4499, lon: 80.3319 },
    { name: "Varanasi", country: "India", lat: 25.3176, lon: 82.9739 },
    { name: "Amritsar", country: "India", lat: 31.6340, lon: 74.8723 },
    { name: "Ludhiana", country: "India", lat: 30.9010, lon: 75.8573 },

    // --- WEST INDIA ---
    { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 },
    { name: "Ahmedabad", country: "India", lat: 23.0225, lon: 72.5714 },
    { name: "Gandhinagar", country: "India", lat: 23.2156, lon: 72.6369 },
    { name: "Jaipur", country: "India", lat: 26.9124, lon: 75.7873 },
    { name: "Jodhpur", country: "India", lat: 26.2389, lon: 73.0243 },
    { name: "Udaipur", country: "India", lat: 24.5854, lon: 73.7125 },
    { name: "Panaji", country: "India", lat: 15.4909, lon: 73.8278 },
    { name: "Pune", country: "India", lat: 18.5204, lon: 73.8567 },
    { name: "Nagpur", country: "India", lat: 21.1458, lon: 79.0882 },

    // --- CENTRAL INDIA ---
    { name: "Bhopal", country: "India", lat: 23.2599, lon: 77.4126 },
    { name: "Indore", country: "India", lat: 22.7196, lon: 75.8577 },
    { name: "Raipur", country: "India", lat: 21.2514, lon: 81.6296 },

    // --- SOUTH INDIA ---
    { name: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946 },
    { name: "Chennai", country: "India", lat: 13.0827, lon: 80.2707 },
    { name: "Hyderabad", country: "India", lat: 17.3850, lon: 78.4867 },
    { name: "Visakhapatnam", country: "India", lat: 17.6868, lon: 83.2185 },
    { name: "Vijayawada", country: "India", lat: 16.5062, lon: 80.6480 },
    { name: "Thiruvananthapuram", country: "India", lat: 8.5241, lon: 76.9366 },
    { name: "Kochi", country: "India", lat: 9.9312, lon: 76.2673 },
    { name: "Coimbatore", country: "India", lat: 11.0168, lon: 76.9558 },
    { name: "Madurai", country: "India", lat: 9.9252, lon: 78.1198 },
    { name: "Mysore", country: "India", lat: 12.2958, lon: 76.6394 },
    { name: "Puducherry", country: "India", lat: 11.9416, lon: 79.8083 },
    { name: "Port Blair", country: "India", lat: 11.6234, lon: 92.7265 },
    { name: "Kavaratti", country: "India", lat: 10.5669, lon: 72.6417 },

    // --- MAJOR INTERNATIONAL HUBS ---
    { name: "New York", country: "United States", lat: 40.7128, lon: -74.0060 },
    { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
    { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 }
];

// (Removed focusRegions configuration since focus button was removed)

// --- APP STATE VARIABLES ---
let scene, camera, renderer, controls;
let earthGroup, earthMesh, cloudMesh, atmosphereMesh;
let holographicEarthMesh, holographicNodes;
let sunLight;

let starParticles;
let sentinel1, sentinel2;
let orbitLine1, orbitLine2;
let beaconMesh = null;

// Space elements
let moonMesh, marsMesh;
let moonAngle = 0;

// Orbital variables
let sat1Angle = 0;
let sat2Angle = Math.PI / 3; // Offset start angle
let orbitSpeedMultiplier = 1.0;
let earthSpinMultiplier = 0.0;

// Camera control animation
let isAnimatingCamera = false;
let cameraTargetPos = new THREE.Vector3();
let cameraAnimProgress = 0;
let activeCity = null; // Active search target
let leafletMap = null; // Leaflet map instance
let beforeOverlay = null;
let afterOverlay = null;

// Bizarre Mode variables
let isBizarreMode = false;
let bizarreTransitionVal = 0; // 0 = Normal, 1 = Bizarre

// Momentum Spin
let randomSpinVelocity = 0;

// Constants
const EARTH_RADIUS = 100;
const SATELLITE_SCALE = 1.0;

// Texture Assets
const TEXTURE_PATHS = {
    day: './assets/earth-day.jpg',
    normal: './assets/earth-normal.jpg',
    specular: './assets/earth-specular.jpg',
    clouds: './assets/earth-clouds.png',
    moon: './assets/moon.jpg',
    lights: './assets/earth-lights.png'
};

// --- INITIALIZE THREE.JS SCENE ---
function init() {
    // 1. Scene setup
    scene = new THREE.Scene();

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 180, 380);

    // 3. Renderer setup
    const canvas = document.getElementById('globe-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 4. Orbit Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 140;
    controls.maxDistance = 600;
    controls.enablePan = false;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(250, 80, 200);
    scene.add(sunLight);

    // Add stars background
    createStarfield();

    // Load Earth textures & start building mesh
    loadTextures(buildEarthScene);

    // Bind event listeners
    window.addEventListener('resize', onWindowResize);
    setupUIEventListeners();
}

// --- CREATE BEAUTIFUL PROCEDURAL STARFIELD ---
function createStarfield() {
    const starCount = 12000; // Increased star count for a richer, denser celestial space background
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Distribute stars on a shell far away
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const radius = 600 + Math.random() * 400; // Far stars

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Subtle color variations (cool blue, warm white, pure white)
        const rand = Math.random();
        if (rand > 0.8) {
            colors[i * 3] = 0.75;      // R
            colors[i * 3 + 1] = 0.85;  // G
            colors[i * 3 + 2] = 1.0;   // B (Cool blue)
        } else if (rand > 0.6) {
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.95;
            colors[i * 3 + 2] = 0.85;  // Warm yellow-white
        } else {
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 1.0;   // Pure white
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular points texture
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const starTex = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
        size: 3.5,
        map: starTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    starParticles = new THREE.Points(geometry, material);
    scene.add(starParticles);
}

// --- PROCEDURAL TEXTURE GENERATOR (FALLBACK) ---
function generateFallbackTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (type === 'day') {
        // Deep Space Blue ocean
        ctx.fillStyle = '#060714';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle global latitude/longitude grid line markings
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 36; i++) {
            const x = (canvas.width / 36) * i;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let i = 0; i <= 18; i++) {
            const y = (canvas.height / 18) * i;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Draw stylized continents
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;

        // Fallback continental outline approximations (procedural drawing)
        const continents = [
            // North America
            [[300, 150], [500, 100], [700, 200], [800, 300], [700, 450], [600, 420], [540, 500], [500, 480], [500, 380], [380, 350], [300, 280]],
            // South America
            [[540, 500], [580, 520], [680, 600], [620, 780], [580, 880], [540, 880], [520, 700], [500, 580]],
            // Africa
            [[960, 420], [1080, 400], [1160, 450], [1220, 550], [1160, 680], [1120, 780], [1080, 780], [1020, 650], [920, 520], [920, 450]],
            // Eurasia
            [[850, 100], [1150, 80], [1450, 120], [1700, 200], [1720, 350], [1600, 500], [1500, 520], [1380, 450], [1280, 520], [1200, 400], [980, 380], [880, 320], [840, 200]],
            // Australia
            [[1540, 650], [1680, 650], [1720, 720], [1660, 800], [1560, 780]],
            // Greenland
            [[640, 60], [750, 80], [700, 150], [600, 120]]
        ];

        continents.forEach(poly => {
            ctx.beginPath();
            ctx.moveTo(poly[0][0], poly[0][1]);
            for (let i = 1; i < poly.length; i++) {
                ctx.lineTo(poly[i][0], poly[i][1]);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
    } else if (type === 'normal') {
        // Flat normal map vector (pointing outward: 128,128,255)
        ctx.fillStyle = '#8080ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (type === 'specular') {
        // Oceans specular, land non-reflective
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#000000'; // continents block reflection
        const continents = [
            [[300, 150], [500, 100], [700, 200], [800, 300], [700, 450], [600, 420], [540, 500], [500, 480], [500, 380], [380, 350], [300, 280]],
            [[540, 500], [580, 520], [680, 600], [620, 780], [580, 880], [540, 880], [520, 700], [500, 580]],
            [[960, 420], [1080, 400], [1160, 450], [1220, 550], [1160, 680], [1120, 780], [1080, 780], [1020, 650], [920, 520], [920, 450]],
            [[850, 100], [1150, 80], [1450, 120], [1700, 200], [1720, 350], [1600, 500], [1500, 520], [1380, 450], [1280, 520], [1200, 400], [980, 380], [880, 320], [840, 200]],
            [[1540, 650], [1680, 650], [1720, 720], [1660, 800], [1560, 780]],
            [[640, 60], [750, 80], [700, 150], [600, 120]]
        ];
        continents.forEach(poly => {
            ctx.beginPath();
            ctx.moveTo(poly[0][0], poly[0][1]);
            for (let i = 1; i < poly.length; i++) {
                ctx.lineTo(poly[i][0], poly[i][1]);
            }
            ctx.closePath();
            ctx.fill();
        });
    } else if (type === 'clouds') {
        // Draw soft procedurally painted atmospheric cloud bands
        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 15; i++) {
            const cy = 200 + Math.random() * 600;
            const ch = 40 + Math.random() * 80;
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, cy, canvas.width / 2, ch, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (type === 'moon') {
        // Fallback cratered grey texture for Moon
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#475569';
        // Draw craters
        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 10 + Math.random() * 20, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (type === 'lights') {
        // Fallback night lights: black with small yellow dots representing cities
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fef08a';
        for (let i = 0; i < 400; i++) {
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

// --- LOADER WITH FALLBACK MECHANISM ---
function loadTextures(callback) {
    const loadingStatus = document.getElementById('loading-status');
    const loadingProgress = document.getElementById('loading-progress');
    const textures = {};
    const keys = Object.keys(TEXTURE_PATHS);
    let loadedCount = 0;
    const totalCount = keys.length;
    let fallbackTriggered = {};

    keys.forEach(key => {
        fallbackTriggered[key] = false;
    });

    const triggerFallback = (key) => {
        if (fallbackTriggered[key]) return;
        fallbackTriggered[key] = true;
        
        console.warn(`Timeout/Error on ${key} map. Initializing local procedural synthesizer.`);
        textures[key] = generateFallbackTexture(key);
        loadedCount++;
        
        const progress = (loadedCount / totalCount) * 100;
        loadingProgress.style.width = `${progress}%`;
        
        if (loadedCount === totalCount) {
            callback(textures);
        }
    };

    keys.forEach(key => {
        loadingStatus.innerText = `Establishing connection for Earth ${key} texture...`;
        
        // Set a timeout of 3.0 seconds for each texture
        const timeoutId = setTimeout(() => {
            triggerFallback(key);
        }, 3000);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = TEXTURE_PATHS[key];
        
        img.onload = () => {
            clearTimeout(timeoutId);
            if (fallbackTriggered[key]) return;
            
            const tex = new THREE.Texture();
            tex.image = img;
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.needsUpdate = true;
            textures[key] = tex;
            loadedCount++;
            
            const progress = (loadedCount / totalCount) * 100;
            loadingProgress.style.width = `${progress}%`;
            
            if (loadedCount === totalCount) {
                callback(textures);
            }
        };
        
        img.onerror = () => {
            clearTimeout(timeoutId);
            triggerFallback(key);
        };
    });
}

// --- ATMOSPHERE GLOW SHADER CODES ---
const atmosphereVertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const atmosphereFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform vec3 glowColor;
    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);
        float intensity = pow(0.6 - dot(normal, viewDir), 3.0);
        gl_FragColor = vec4(glowColor, 1.0) * intensity;
    }
`;

// --- COSMIC BACKGROUND NEBULA GENERATOR ---
function generateNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Deep space base
    ctx.fillStyle = '#020206';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Radial gradients representing soft nebulas
    let grad1 = ctx.createRadialGradient(300, 300, 50, 400, 400, 300);
    grad1.addColorStop(0, 'rgba(124, 58, 237, 0.15)'); // Purple
    grad1.addColorStop(0.5, 'rgba(219, 39, 119, 0.05)'); // Pink
    grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    let grad2 = ctx.createRadialGradient(700, 600, 100, 600, 500, 400);
    grad2.addColorStop(0, 'rgba(37, 99, 235, 0.18)'); // Blue
    grad2.addColorStop(0.6, 'rgba(79, 70, 229, 0.06)'); // Indigo
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let grad3 = ctx.createRadialGradient(200, 800, 50, 300, 700, 250);
    grad3.addColorStop(0, 'rgba(13, 148, 136, 0.12)'); // Teal
    grad3.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad3;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// --- ASSEMBLE EARTH AND SCENE COMPONENTS ---
function buildEarthScene(textures) {
    const loadingStatus = document.getElementById('loading-status');
    loadingStatus.innerText = `Assembling 3D planetary mesh...`;

    // Enable maximum anisotropic filtering for sharp texture rendering when zoomed in
    if (renderer) {
        const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        if (textures.day) textures.day.anisotropy = maxAnisotropy;
        if (textures.normal) textures.normal.anisotropy = maxAnisotropy;
        if (textures.specular) textures.specular.anisotropy = maxAnisotropy;
        if (textures.clouds) textures.clouds.anisotropy = maxAnisotropy;
        if (textures.lights) textures.lights.anisotropy = maxAnisotropy;
    }

    // Earth group handles rotation
    earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 1. High Quality Earth sphere
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
        map: textures.day,
        normalMap: textures.normal,
        normalScale: new THREE.Vector2(1.1, 1.1),
        specularMap: textures.specular,
        specular: new THREE.Color(0x2a2a2a),
        shininess: 25,
        emissiveMap: textures.lights,
        emissive: new THREE.Color(0xffda73),
        emissiveIntensity: 0.8
    });
    
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 2. Translucent Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS + 0.8, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
        map: textures.clouds,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
    });
    cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // 4. Hologram / Bizarre Mode Earth Mesh
    const wireframeGeo = new THREE.SphereGeometry(EARTH_RADIUS, 32, 32);
    const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        wireframe: true,
        transparent: true,
        opacity: 0, // Hidden by default
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    holographicEarthMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    earthGroup.add(holographicEarthMesh);

    // Nodes at vertices of the wireframe for data effect
    const nodeMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 2.2,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    holographicNodes = new THREE.Points(wireframeGeo, nodeMat);
    earthGroup.add(holographicNodes);

    // --- CONSTRUCT THE MOON ---
    const moonGeo = new THREE.SphereGeometry(12, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({
        map: textures.moon,
        roughness: 0.9,
        shininess: 5
    });
    moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);

    // --- CONSTRUCT DISTANT PLANET (MARS) ---
    const marsGeo = new THREE.SphereGeometry(15, 32, 32);
    const marsCanvas = document.createElement('canvas');
    marsCanvas.width = 512;
    marsCanvas.height = 256;
    const marsCtx = marsCanvas.getContext('2d');
    marsCtx.fillStyle = '#9c4c36'; // rust base
    marsCtx.fillRect(0, 0, marsCanvas.width, marsCanvas.height);
    // Dark banding
    marsCtx.fillStyle = '#7a3b2b';
    for (let i = 0; i < 6; i++) {
        marsCtx.fillRect(0, 40 + i * 35, marsCanvas.width, 15 + Math.random() * 15);
    }
    // Polar ice cap
    marsCtx.fillStyle = '#f8fafc';
    marsCtx.beginPath();
    marsCtx.arc(marsCanvas.width/2, 5, 20, 0, Math.PI, false);
    marsCtx.fill();

    const marsTex = new THREE.CanvasTexture(marsCanvas);
    const marsMat = new THREE.MeshPhongMaterial({
        map: marsTex,
        roughness: 0.85,
        shininess: 0
    });
    marsMesh = new THREE.Mesh(marsGeo, marsMat);
    marsMesh.position.set(-450, 60, -350); // Position Mars far in the distance
    scene.add(marsMesh);

    // 5. Build Sentinel Satellites
    buildSatellites();

    // Fade out loading screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = 0;
        setTimeout(() => loader.style.display = 'none', 800);
    }, 500);

    // Start render loop
    animate();
}

// --- CONSTRUCT SATELLITE 3D MODELS PROCEDURALLY ---
function buildSatellites() {
    // --- SENTINEL-1 MODEL (Synthetic Aperture Radar) ---
    sentinel1 = new THREE.Group();
    
    // Main gold metallic bus body
    const bodyGeo1 = new THREE.BoxGeometry(4, 2, 2);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 });
    const bus1 = new THREE.Mesh(bodyGeo1, goldMat);
    sentinel1.add(bus1);

    // C-SAR radar antenna board (long planar panel)
    const sarGeo = new THREE.BoxGeometry(10, 0.8, 0.25);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5, roughness: 0.5 });
    const sarAntenna = new THREE.Mesh(sarGeo, antennaMat);
    sarAntenna.position.set(0, -1.3, 0); // Positioned underneath
    sentinel1.add(sarAntenna);

    // Solar Panel (extended on one side)
    const solarGeo1 = new THREE.BoxGeometry(8, 0.08, 1.8);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.8, roughness: 0.1 });
    const solarPanel1 = new THREE.Mesh(solarGeo1, solarMat);
    solarPanel1.position.set(6, 0, 0); // Extended along positive X axis
    sentinel1.add(solarPanel1);

    // Subtle details (thrusters, instruments)
    const thrusterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8);
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
    const thruster = new THREE.Mesh(thrusterGeo, darkMetalMat);
    thruster.position.set(-2, 0, 0);
    thruster.rotation.z = Math.PI / 2;
    sentinel1.add(thruster);

    // Glowing green marker dot (matching the user's photo!)
    const dotGeo1 = new THREE.SphereGeometry(2.5, 8, 8);
    const dotMat1 = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.9, depthWrite: false });
    const dot1 = new THREE.Mesh(dotGeo1, dotMat1);
    sentinel1.add(dot1);

    scene.add(sentinel1);

    // --- SENTINEL-2 MODEL (Multi-Spectral Optical Instrument) ---
    sentinel2 = new THREE.Group();

    // Octagonal prism silver bus body
    const bodyGeo2 = new THREE.CylinderGeometry(1.5, 1.5, 4.5, 8);
    const silverMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
    const bus2 = new THREE.Mesh(bodyGeo2, silverMat);
    bus2.rotation.x = Math.PI / 2;
    sentinel2.add(bus2);

    // Multi-spectral camera lens (cylindrical aperture pointing down)
    const lensGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 16);
    const blackGlassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });
    const cameraLens = new THREE.Mesh(lensGeo, blackGlassMat);
    cameraLens.position.set(0, -1.4, 0.5); // Underneath pointing towards planet
    cameraLens.rotation.x = 0;
    sentinel2.add(cameraLens);

    // Asymmetric Solar array (single panel extending sideways)
    const solarGeo2 = new THREE.BoxGeometry(7, 0.08, 1.6);
    const solarPanel2 = new THREE.Mesh(solarGeo2, solarMat);
    solarPanel2.position.set(-5, 0.5, 0); // Extended along negative X axis
    sentinel2.add(solarPanel2);

    // Glowing green marker dot (matching the user's photo!)
    const dotGeo2 = new THREE.SphereGeometry(2.5, 8, 8);
    const dotMat2 = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.9, depthWrite: false });
    const dot2 = new THREE.Mesh(dotGeo2, dotMat2);
    sentinel2.add(dot2);

    scene.add(sentinel2);

    // Apply scale multiplier
    sentinel1.scale.set(SATELLITE_SCALE, SATELLITE_SCALE, SATELLITE_SCALE);
    sentinel2.scale.set(SATELLITE_SCALE, SATELLITE_SCALE, SATELLITE_SCALE);

    // --- CREATE ORBIT PATH LINES ---
    const orbitPoints1 = [];
    const orbitPoints2 = [];
    const segments = 120;
    
    const radius1 = EARTH_RADIUS + 35; // Sentinel-1 Orbit Radius (relative)
    const radius2 = EARTH_RADIUS + 46; // Sentinel-2 Orbit Radius (relative)
    
    const inclination1 = (98.18 * Math.PI) / 180; // Sentinel 1 inclination
    const inclination2 = (98.57 * Math.PI) / 180; // Sentinel 2 inclination
    const raan2 = (120 * Math.PI) / 180;         // Orbit plane offset

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * 2 * Math.PI;
        
        // S1 Orbit Line point calculations
        const p1 = getOrbitPosition(theta, radius1, inclination1, 0);
        orbitPoints1.push(p1);

        // S2 Orbit Line point calculations
        const p2 = getOrbitPosition(theta, radius2, inclination2, raan2);
        orbitPoints2.push(p2);
    }

    const orbitGeo1 = new THREE.BufferGeometry().setFromPoints(orbitPoints1);
    const orbitGeo2 = new THREE.BufferGeometry().setFromPoints(orbitPoints2);

    // Glowing dotted orbit lines
    const orbitMat1 = new THREE.LineDashedMaterial({
        color: 0x60a5fa,
        dashSize: 3,
        gapSize: 2,
        transparent: true,
        opacity: 0.4
    });
    
    const orbitMat2 = new THREE.LineDashedMaterial({
        color: 0x34d399,
        dashSize: 3,
        gapSize: 2,
        transparent: true,
        opacity: 0.4
    });

    orbitLine1 = new THREE.Line(orbitGeo1, orbitMat1);
    orbitLine1.computeLineDistances(); // Required for dashed lines
    scene.add(orbitLine1);

    orbitLine2 = new THREE.Line(orbitGeo2, orbitMat2);
    orbitLine2.computeLineDistances();
    scene.add(orbitLine2);
}

// --- ORBIT POSITION CALCULATION MATH ---
function getOrbitPosition(angle, radius, inclination, raan) {
    // 1. Coordinates in the horizontal orbit plane
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = 0;

    // 2. Rotate by inclination (tilted from equator plane) around X-axis
    const y1 = y * Math.cos(inclination) - z * Math.sin(inclination);
    const z1 = y * Math.sin(inclination) + z * Math.cos(inclination);

    // 3. Rotate by RAAN (longitudinal orbit offset) around Y-axis
    const x2 = x * Math.cos(raan) + z1 * Math.sin(raan);
    const y2 = y1;
    const z2 = -x * Math.sin(raan) + z1 * Math.cos(raan);

    return new THREE.Vector3(x2, y2, z2);
}

// --- BEACON MAKER (Focus targeting) ---
function createBeacon(vector3) {
    if (beaconMesh) {
        scene.remove(beaconMesh);
    }

    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(vector3);

    // Small central spike pointing straight outward
    const spikeGeo = new THREE.ConeGeometry(0.8, 8, 8);
    const spikeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, depthWrite: false });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(0, 4, 0);
    beaconGroup.add(spike);

    // Ring laying flat on the earth surface
    const ringGeo = new THREE.RingGeometry(0.1, 4.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    beaconGroup.add(ring);

    // Align the beacon group to stand perpendicular to the sphere surface
    const origin = new THREE.Vector3(0, 0, 0);
    const upVector = new THREE.Vector3(0, 1, 0);
    const direction = vector3.clone().normalize();
    beaconGroup.quaternion.setFromUnitVectors(upVector, direction);

    scene.add(beaconGroup);
    beaconMesh = {
        group: beaconGroup,
        ring: ring,
        pulseVal: 0
    };
}

// --- CONVERT 3D SPATIAL VECTORS TO LATITUDE/LONGITUDE ---
function getGroundTelemetry(position, earthRotY) {
    const radius = position.length();
    
    // Normalize position coordinates
    const x = position.x;
    const y = position.y;
    const z = position.z;

    // Latitude calculation
    const latRad = Math.asin(y / radius);
    const lat = latRad * (180 / Math.PI);

    // Longitude calculation (Accounting for Earth's active rotation!)
    let lonRad = Math.atan2(-z, x);
    
    // Adjust longitude angle based on Earth's current Y axis rotation angle
    let adjustedLonRad = lonRad - earthRotY;
    
    // Normalize to range [-PI, PI]
    while (adjustedLonRad > Math.PI) adjustedLonRad -= 2 * Math.PI;
    while (adjustedLonRad < -Math.PI) adjustedLonRad += 2 * Math.PI;

    const lon = adjustedLonRad * (180 / Math.PI);

    return {
        lat: lat.toFixed(4),
        lon: lon.toFixed(4)
    };
}

// --- RENDER/ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    const delta = 0.016; // Approx 60fps delta

    // 1. Earth spinning rotation & Sun positioning
    const declinationRad = (23.39 * Math.PI) / 180; // Declination of June 24th
    if (sunLight) {
        sunLight.position.set(400 * Math.cos(declinationRad), 400 * Math.sin(declinationRad), 0);
    }

    let baseSpin = 0.005 * earthSpinMultiplier;
    if (randomSpinVelocity > 0.0005) {
        baseSpin += randomSpinVelocity;
        randomSpinVelocity *= 0.96; // Torque decay
    }
    
    if (earthGroup) {
        if (earthSpinMultiplier === 0) {
            // LIVE REAL-TIME MODE!
            const now = new Date();
            const fractionalHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
            // Snap Earth rotation Y so that subsolar longitude aligns with the Sun (positive Z)
            earthGroup.rotation.y = -(fractionalHours - 12) * (Math.PI / 12);
            
            if (cloudMesh) {
                // Clouds drift slowly over time
                cloudMesh.rotation.y = earthGroup.rotation.y + (Date.now() * 0.000002);
            }
        } else {
            // Interactive Spin Mode
            earthGroup.rotation.y += baseSpin;
            if (cloudMesh) {
                cloudMesh.rotation.y += baseSpin * 0.2;
            }
        }
    }

    // 1.5. Propagate Moon Orbit and Mars Rotation
    if (moonMesh) {
        moonAngle += 0.001 * orbitSpeedMultiplier;
        const moonRadius = 160;
        // Moon orbits in an inclined plane
        const inclination = (5.14 * Math.PI) / 180;
        moonMesh.position.set(
            moonRadius * Math.cos(moonAngle),
            moonRadius * Math.sin(moonAngle) * Math.sin(inclination),
            moonRadius * Math.sin(moonAngle) * Math.cos(inclination)
        );
        moonMesh.rotation.y += 0.003;
    }

    if (marsMesh) {
        marsMesh.rotation.y += 0.002;
    }

    // 2. Propagate Satellites along their orbits
    const orbitalIncrement = 0.003 * orbitSpeedMultiplier;
    sat1Angle += orbitalIncrement;
    sat2Angle += orbitalIncrement * 0.98; // S2 slightly slower due to higher altitude

    const radius1 = EARTH_RADIUS + 35;
    const radius2 = EARTH_RADIUS + 46;
    const inclination1 = (98.18 * Math.PI) / 180;
    const inclination2 = (98.57 * Math.PI) / 180;
    const raan2 = (120 * Math.PI) / 180;

    if (sentinel1) {
        const pos1 = getOrbitPosition(sat1Angle, radius1, inclination1, 0);
        sentinel1.position.copy(pos1);
        
        // Orient satellite to always point "radar surface" down towards earth
        sentinel1.lookAt(new THREE.Vector3(0, 0, 0));
        
        // Update Telemetry Panel texts
        const tel1 = getGroundTelemetry(pos1, earthGroup.rotation.y);
        document.getElementById('sat1-lat').innerText = `${Math.abs(tel1.lat).toFixed(4)}° ${tel1.lat >= 0 ? 'N' : 'S'}`;
        document.getElementById('sat1-lon').innerText = `${Math.abs(tel1.lon).toFixed(4)}° ${tel1.lon >= 0 ? 'E' : 'W'}`;
    }

    if (sentinel2) {
        const pos2 = getOrbitPosition(sat2Angle, radius2, inclination2, raan2);
        sentinel2.position.copy(pos2);
        
        // Orient to face camera aperture downward
        sentinel2.lookAt(new THREE.Vector3(0, 0, 0));
        
        const tel2 = getGroundTelemetry(pos2, earthGroup.rotation.y);
        document.getElementById('sat2-lat').innerText = `${Math.abs(tel2.lat).toFixed(4)}° ${tel2.lat >= 0 ? 'N' : 'S'}`;
        document.getElementById('sat2-lon').innerText = `${Math.abs(tel2.lon).toFixed(4)}° ${tel2.lon >= 0 ? 'E' : 'W'}`;
    }

    // 3. Smooth Camera Interpolation (Glide to Target)
    if (isAnimatingCamera) {
        camera.position.lerp(cameraTargetPos, 0.06);
        camera.lookAt(0, 0, 0);
        
        if (camera.position.distanceTo(cameraTargetPos) < 1.0) {
            isAnimatingCamera = false;
        }
    }

    // 4. Bizarre Mode Morph Transition (Shader & Wireframe fade)
    if (isBizarreMode) {
        bizarreTransitionVal = Math.min(bizarreTransitionVal + 0.05, 1);
    } else {
        bizarreTransitionVal = Math.max(bizarreTransitionVal - 0.05, 0);
    }

    if (earthMesh && holographicEarthMesh && holographicNodes) {
        // Fade normal earth mesh textures
        earthMesh.material.opacity = 1 - bizarreTransitionVal;
        earthMesh.material.transparent = (bizarreTransitionVal > 0);
        
        // Fade wireframe
        holographicEarthMesh.material.opacity = bizarreTransitionVal * 0.45;
        holographicNodes.material.opacity = bizarreTransitionVal * 0.85;
    }

    // 5. Pulsate Active Target Beacon Ring
    if (beaconMesh) {
        beaconMesh.pulseVal += 0.05;
        const scale = 1.0 + Math.sin(beaconMesh.pulseVal) * 0.35;
        beaconMesh.ring.scale.set(scale, scale, scale);
        beaconMesh.ring.material.opacity = 0.8 - (scale - 0.65) * 0.5;

        // Update day/night status dynamically based on current rotation
        if (activeCity) {
            const cityPos = latLonToVector3(activeCity.lat, activeCity.lon, EARTH_RADIUS);
            const declinationRad = (23.39 * Math.PI) / 180;
            const sunDir = new THREE.Vector3(Math.cos(declinationRad), Math.sin(declinationRad), 0).normalize();
            
            const earthRotY = earthGroup.rotation.y;
            const rotatedCityX = cityPos.x * Math.cos(earthRotY) - cityPos.z * Math.sin(earthRotY);
            const rotatedCityZ = cityPos.x * Math.sin(earthRotY) + cityPos.z * Math.cos(earthRotY);
            const worldCityPos = new THREE.Vector3(rotatedCityX, cityPos.y, rotatedCityZ);
            
            const cityDir = worldCityPos.clone().normalize();
            const dotVal = cityDir.dot(sunDir);
            const isDay = dotVal > 0;
            
            const hudIllum = document.getElementById('hud-illumination');
            if (hudIllum) {
                hudIllum.innerText = isDay ? 'DAY' : 'NIGHT';
                if (isDay) {
                    hudIllum.style.color = '#60a5fa'; // Cool blue for daylight
                } else {
                    hudIllum.style.color = '#fbbf24'; // Golden amber for night city lights
                }
            }
        }
    }

    // 6. Stars twinkle animations
    if (starParticles) {
        const starTime = Date.now() * 0.0005;
        starParticles.rotation.y = starTime * 0.02;
    }

    if (!isAnimatingCamera) {
        controls.update();
    }
    renderer.render(scene, camera);
}

// --- CONVERT COORDINATES TO 3D SURFACE VECTORS ---
function latLonToVector3(lat, lon, radius) {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
    
    // Compute X, Y, Z relative to standard Earth axes mapping
    const x = radius * Math.cos(latRad) * Math.cos(lonRad);
    const y = radius * Math.sin(latRad);
    const z = -radius * Math.cos(latRad) * Math.sin(lonRad);
    return new THREE.Vector3(x, y, z);
}

// --- CAMERA TARGET INTERPOLATOR ---
function flyToCoordinates(lat, lon, zoomDistance = 220) {
    // Reset Earth Spin to LIVE to stabilize the camera target
    earthSpinMultiplier = 0;
    const sliderEarth = document.getElementById('slider-earth-speed');
    const valEarth = document.getElementById('val-earth-speed');
    if (sliderEarth && valEarth) {
        sliderEarth.value = 0;
        valEarth.innerText = "LIVE";
    }

    // 1. Calculate static point in space relative to Earth's active rotation
    const baseCoords = latLonToVector3(lat, lon, zoomDistance);
    
    // Adjust by Earth's current rotation angle Y so the country aligns in front of screen!
    const earthRotY = earthGroup.rotation.y;
    const rotatedX = baseCoords.x * Math.cos(earthRotY) - baseCoords.z * Math.sin(earthRotY);
    const rotatedZ = baseCoords.x * Math.sin(earthRotY) + baseCoords.z * Math.cos(earthRotY);
    
    cameraTargetPos.set(rotatedX, baseCoords.y, rotatedZ);
    isAnimatingCamera = true;

    // Draw target marker beacon at the actual rotating surface point
    const surfaceCoords = latLonToVector3(lat, lon, EARTH_RADIUS + 0.1);
    
    // Add beacon to Earth group so it rotates WITH the continents!
    if (beaconMesh) {
        earthGroup.remove(beaconMesh.group);
    }
    
    const beaconGroup = new THREE.Group();
    beaconGroup.position.copy(surfaceCoords);

    // Spiky cone
    const spikeGeo = new THREE.ConeGeometry(0.8, 6, 8);
    const spikeMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, depthWrite: false });
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    spike.position.set(0, 3, 0);
    beaconGroup.add(spike);

    // Floating ring
    const ringGeo = new THREE.RingGeometry(0.1, 4.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    beaconGroup.add(ring);

    // Align standing vectors perpendicular to the globe mesh
    const upVector = new THREE.Vector3(0, 1, 0);
    const direction = surfaceCoords.clone().normalize();
    beaconGroup.quaternion.setFromUnitVectors(upVector, direction);

    earthGroup.add(beaconGroup); // Attached to group rotates automatically!
    beaconMesh = {
        group: beaconGroup,
        ring: ring,
        pulseVal: 0
    };
}

// --- BIND EVENT LISTENERS TO UI ELEMENTS ---
function setupUIEventListeners() {
    // 1. Bizarre Mode
    const btnBizarre = document.getElementById('btn-bizarre');
    btnBizarre.addEventListener('click', () => {
        isBizarreMode = !isBizarreMode;
        btnBizarre.classList.toggle('active');
        
        const labelText = btnBizarre.querySelector('span');
        if (isBizarreMode) {
            labelText.innerText = "Normal Mode";
            btnBizarre.style.borderColor = 'rgba(0, 255, 204, 0.6)';
            btnBizarre.style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.25)';
        } else {
            labelText.innerText = "Bizarre Mode";
            btnBizarre.style.borderColor = 'rgba(96, 165, 250, 0.35)'; // Glowing blue border
            btnBizarre.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4), 0 0 10px rgba(96, 165, 250, 0.1)';
        }
    });

    // (Removed Random Spin and Focus Region button listeners as requested)

    // 4. City Search Autocomplete box and Live HUD integration
    const searchInput = document.getElementById('country-search');
    const searchResults = document.getElementById('search-results');
    const satelliteHud = document.getElementById('satellite-hud');
    const hudName = document.getElementById('hud-target-name');
    const hudCoords = document.getElementById('hud-target-coords');
    const hudIllum = document.getElementById('hud-illumination');

    let searchTimeout = null;

    function createSearchItem(name, country, lat, lon) {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.innerText = `${name}, ${country}`;
        
        item.addEventListener('click', () => {
            const cityObj = { name, country, lat, lon };
            activeCity = cityObj;

            // 1. Zoom into the city coordinates (Distance 122 creates a tight satellite view!)
            flyToCoordinates(lat, lon, 122);
            searchInput.value = `${name}, ${country}`;
            searchResults.classList.add('hidden');

            // 2. Telemetry and live day/night check
            const cityPos = latLonToVector3(lat, lon, EARTH_RADIUS);
            const declinationRad = (23.39 * Math.PI) / 180;
            const sunDir = new THREE.Vector3(Math.cos(declinationRad), Math.sin(declinationRad), 0).normalize();
            
            const earthRotY = earthGroup.rotation.y;
            const rotatedCityX = cityPos.x * Math.cos(earthRotY) - cityPos.z * Math.sin(earthRotY);
            const rotatedCityZ = cityPos.x * Math.sin(earthRotY) + cityPos.z * Math.cos(earthRotY);
            const worldCityPos = new THREE.Vector3(rotatedCityX, cityPos.y, rotatedCityZ);
            
            const cityDir = worldCityPos.clone().normalize();
            const dotVal = cityDir.dot(sunDir);
            const isDay = dotVal > 0;

            // Update HUD panel texts
            hudName.innerText = `${name}, ${country}`;
            hudCoords.innerText = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
            hudIllum.innerText = isDay ? 'DAY' : 'NIGHT';
            
            if (isDay) {
                hudIllum.style.color = '#60a5fa'; // Cool blue for daylight
            } else {
                hudIllum.style.color = '#fbbf24'; // Golden amber for night city lights
            }

            // 3. Show HUD overlay
            satelliteHud.classList.remove('hidden');

            // Hide top-right telemetry panel to prevent box overlapping
            const telemetryPanel = document.querySelector('.panel-telemetry-right');
            if (telemetryPanel) {
                telemetryPanel.classList.add('hidden');
            }

            // Initialize or update interactive satellite map
            setTimeout(() => {
                const mapContainer = document.getElementById('hud-map');
                if (mapContainer) {
                    // Unhide container
                    mapContainer.classList.remove('hidden');

                    if (!leafletMap) {
                        leafletMap = L.map('hud-map', {
                            zoomControl: false,
                            attributionControl: false
                        }).setView([lat, lon], 14); // Zoom level 14 provides a highly detailed, clear satellite view

                        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                            maxZoom: 18
                        }).addTo(leafletMap);
                    } else {
                        leafletMap.setView([lat, lon], 14);
                    }
                    
                    // Trigger size update once container displays
                    leafletMap.invalidateSize();

                    // Smooth fade-in
                    setTimeout(() => {
                        mapContainer.classList.add('visible');
                    }, 50);
                }
            }, 1200); // Triggers once the 3D camera has zoomed close

            showTelemetryToast(`Satellite Uplink Active`, `Locked on target ${name} (${isDay ? 'Daylight scanning' : 'Night light telemetry'})`);
        });
        
        return item;
    }

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        searchResults.innerHTML = '';
        
        if (!val) {
            searchResults.classList.add('hidden');
            return;
        }

        // 1. Show local matches first (instant)
        const localMatches = cities.filter(c => 
            c.name.toLowerCase().includes(val.toLowerCase()) || 
            c.country.toLowerCase().includes(val.toLowerCase())
        );

        if (localMatches.length > 0) {
            searchResults.classList.remove('hidden');
            localMatches.forEach(c => {
                const item = createSearchItem(c.name, c.country, c.lat, c.lon);
                searchResults.appendChild(item);
            });
        }

        // 2. Fetch from Nominatim API for full database (debounced)
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`, {
                headers: {
                    'User-Agent': '3DEarthSentinelSimulator/1.0'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    searchResults.classList.remove('hidden');
                    data.forEach(place => {
                        const name = place.name || place.display_name.split(',')[0];
                        const country = place.address.country || 'Unknown';
                        const lat = parseFloat(place.lat);
                        const lon = parseFloat(place.lon);
                        
                        // Prevent adding duplicates of local matches
                        const exists = localMatches.some(lm => 
                            Math.abs(lm.lat - lat) < 0.02 && Math.abs(lm.lon - lon) < 0.02
                        );
                        if (!exists) {
                            const item = createSearchItem(name, country, lat, lon);
                            searchResults.appendChild(item);
                        }
                    });
                } else if (localMatches.length === 0) {
                    searchResults.innerHTML = '';
                    const noRes = document.createElement('div');
                    noRes.className = 'search-item';
                    noRes.innerText = 'No matches found';
                    searchResults.appendChild(noRes);
                    searchResults.classList.remove('hidden');
                }
            })
            .catch(err => {
                console.error("Geocoding API error:", err);
            });
        }, 500);
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // Exit Satellite HUD view and return to full Earth orbit view
    const btnExitHud = document.getElementById('btn-exit-hud');
    btnExitHud.addEventListener('click', () => {
        activeCity = null; // Clear active target
        
        // Fade out the fullscreen satellite map first
        const mapContainer = document.getElementById('hud-map');
        if (mapContainer) {
            mapContainer.classList.remove('visible');
            setTimeout(() => {
                mapContainer.classList.add('hidden');
                if (leafletMap) {
                    leafletMap.remove();
                    leafletMap = null;
                }
            }, 800); // Matches the 0.8s transition in style.css
        }

        satelliteHud.classList.add('hidden');
        searchInput.value = '';

        // Reset reconstruction upload section state
        if (btnUploadCloudy) {
            btnUploadCloudy.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Upload Cloudy LISS-IV Image`;
            btnUploadCloudy.style.borderColor = "rgba(244, 63, 94, 0.4)";
            btnUploadCloudy.style.color = "#f43f5e";
        }
        if (uploadStatus) {
            uploadStatus.classList.add('hidden');
        }
        
        // Remove beacon target marker
        if (beaconMesh) {
            earthGroup.remove(beaconMesh.group);
            beaconMesh = null;
        }

        // Clean up LISS-IV Leaflet overlays
        if (beforeOverlay) {
            if (leafletMap) leafletMap.removeLayer(beforeOverlay);
            beforeOverlay = null;
        }
        if (afterOverlay) {
            if (leafletMap) leafletMap.removeLayer(afterOverlay);
            afterOverlay = null;
        }

        // Reset cloud reconstruction UI states
        const cloudyUploadInput = document.getElementById('cloudy-upload');
        const uploadStatus = document.getElementById('upload-status');
        const uploadStatusText = document.getElementById('upload-status-text');
        if (cloudyUploadInput) cloudyUploadInput.value = '';
        if (uploadStatus) {
            uploadStatus.classList.add('hidden');
            uploadStatus.style.color = '#60a5fa'; // Reset to Blue
        }
        if (uploadStatusText) uploadStatusText.innerText = 'Processing LISS-IV scene...';

        // Reset inline notification box
        const hudNotification = document.getElementById('hud-notification');
        if (hudNotification) {
            hudNotification.classList.add('hidden');
            hudNotification.innerHTML = '';
        }

        // Restore top-right telemetry panel
        const telemetryPanel = document.querySelector('.panel-telemetry-right');
        if (telemetryPanel) {
            telemetryPanel.classList.remove('hidden');
        }

        // Cinematic zoom back out to the exact default starting orbit position (0, 180, 380)
        cameraTargetPos.set(0, 180, 380);
        isAnimatingCamera = true;
    });

    // 5. Speed sliders and checkboxes
    const sliderOrbit = document.getElementById('slider-orbit-speed');
    const valOrbit = document.getElementById('val-orbit-speed');
    sliderOrbit.addEventListener('input', (e) => {
        orbitSpeedMultiplier = parseFloat(e.target.value);
        valOrbit.innerText = `${orbitSpeedMultiplier.toFixed(1)}x`;
    });

    const sliderEarth = document.getElementById('slider-earth-speed');
    const valEarth = document.getElementById('val-earth-speed');
    sliderEarth.addEventListener('input', (e) => {
        earthSpinMultiplier = parseFloat(e.target.value);
        if (earthSpinMultiplier === 0) {
            valEarth.innerText = "LIVE";
        } else {
            valEarth.innerText = `${earthSpinMultiplier.toFixed(1)}x`;
        }
    });

    const chkOrbits = document.getElementById('chk-orbits');
    chkOrbits.addEventListener('change', (e) => {
        orbitLine1.visible = e.target.checked;
        orbitLine2.visible = e.target.checked;
    });

    const chkClouds = document.getElementById('chk-clouds');
    chkClouds.addEventListener('change', (e) => {
        cloudMesh.visible = e.target.checked;
    });

    // 6. Fullscreen toggle API
    const btnFullscreen = document.getElementById('btn-fullscreen');
    btnFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Handle screen layout scaling during fullscreen change
    document.addEventListener('fullscreenchange', () => {
        const label = btnFullscreen.querySelector('span');
        const icon = btnFullscreen.querySelector('i');
        if (document.fullscreenElement) {
            label.innerText = "Exit Full";
            icon.className = "fa-solid fa-compress";
        } else {
            label.innerText = "Fullscreen";
            icon.className = "fa-solid fa-expand";
        }
    });

    // 7. More Info Modal popups
    const btnInfo = document.getElementById('btn-info');
    const infoModal = document.getElementById('info-modal');
    const modalClose = document.getElementById('modal-close');

    btnInfo.addEventListener('click', () => {
        infoModal.classList.remove('hidden');
    });

    modalClose.addEventListener('click', () => {
        infoModal.classList.add('hidden');
    });

    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    });

    // 8. LISS-IV Cloud Cover Reconstruction Upload production workflow
    const btnUploadCloudy = document.getElementById('btn-upload-cloudy');
    const cloudyUploadInput = document.getElementById('cloudy-upload');
    const uploadStatus = document.getElementById('upload-status');
    const uploadStatusText = document.getElementById('upload-status-text');

    // Core function to process the cloudy image file (used by both file upload and test samples)
    async function processCloudyImage(file) {
        if (!leafletMap) {
            uploadStatus.classList.remove('hidden');
            uploadStatus.style.color = '#f43f5e';
            uploadStatusText.innerHTML = '<span style="font-weight: 800;"><i class="fa-solid fa-circle-exclamation"></i> Target Missing!</span><br>Please lock onto a target city first to open the satellite HUD.';
            return;
        }

        // Display "before" cloudy image on the map immediately
        const bounds = leafletMap.getBounds();
        if (beforeOverlay) leafletMap.removeLayer(beforeOverlay);
        if (afterOverlay) {
            leafletMap.removeLayer(afterOverlay);
            afterOverlay = null;
        }

        try {
            const beforeUrl = URL.createObjectURL(file);
            beforeOverlay = L.imageOverlay(beforeUrl, bounds).addTo(leafletMap);
        } catch (err) {
            console.error("Failed to render preview overlay:", err);
        }

        // Set up incremental status messages during inference
        const statusTimeouts = [];
        uploadStatus.classList.remove('hidden');
        uploadStatus.style.color = '#60a5fa'; // Reset to Blue
        uploadStatusText.innerText = "Initializing LISS-IV dataset ingestion...";

        statusTimeouts.push(setTimeout(() => {
            uploadStatusText.innerText = "Preprocessing: Segmenting cloud & shadow layers...";
        }, 1200));

        statusTimeouts.push(setTimeout(() => {
            uploadStatusText.innerText = "Reconstruction: Fusing Sentinel-1 SAR backscatter & temporal references...";
        }, 2400));

        statusTimeouts.push(setTimeout(() => {
            uploadStatusText.innerText = "Generative AI: Synthesizing surface pixels via U-Net GAN generator...";
        }, 3600));

        // Cold-start warning triggered if server response exceeds 5 seconds
        statusTimeouts.push(setTimeout(() => {
            uploadStatusText.innerHTML = '<span style="color: #fbbf24; font-weight: 800;"><i class="fa-solid fa-triangle-exclamation"></i> Cold Start Detected...</span><br>Waking up Hugging Face Space basic CPU container. This can take 20-30 seconds.';
        }, 5000));

        try {
            // Call prediction endpoint
            const resultUrl = await removeClouds(file);
            
            // Success: clear timeouts and overlays
            statusTimeouts.forEach(clearTimeout);
            
            afterOverlay = L.imageOverlay(resultUrl, bounds).addTo(leafletMap);
            if (beforeOverlay) {
                leafletMap.removeLayer(beforeOverlay);
                beforeOverlay = null;
            }

            uploadStatus.style.color = '#10b981'; // Success Green
            uploadStatusText.innerHTML = '<span style="font-weight: 800;"><i class="fa-solid fa-circle-check"></i> Surface Reconstructed!</span><br>Cloud-free LISS-IV optical scene generated successfully.';
            showTelemetryToast(`Reconstruction Complete`, `Generative AI has successfully removed the cloud cover and reconstructed the surface details.`);
        } catch (error) {
            // Error handling
            statusTimeouts.forEach(clearTimeout);
            if (beforeOverlay) {
                leafletMap.removeLayer(beforeOverlay);
                beforeOverlay = null;
            }
            uploadStatus.style.color = '#f43f5e'; // Error Red
            uploadStatusText.innerHTML = `<span style="font-weight: 800;"><i class="fa-solid fa-circle-exclamation"></i> Reconstruction Failed!</span><br>${error.message}`;
        }
    }

    // Helper to fetch local sample assets and convert them to File objects for processing
    async function triggerSamplePrediction(imageUrl, filename) {
        try {
            uploadStatus.classList.remove('hidden');
            uploadStatus.style.color = '#60a5fa'; // Blue
            uploadStatusText.innerText = "Downloading sample LISS-IV scene...";

            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            const blob = await response.blob();
            const file = new File([blob], filename, { type: "image/png" });

            await processCloudyImage(file);
        } catch (err) {
            console.error("Failed to load sample image:", err);
            uploadStatus.style.color = '#f43f5e'; // Error Red
            uploadStatusText.innerHTML = `<span style="font-weight: 800;"><i class="fa-solid fa-circle-exclamation"></i> Ingestion Failed!</span><br>Could not retrieve sample scene: ${err.message}`;
        }
    }

    if (btnUploadCloudy && cloudyUploadInput) {
        btnUploadCloudy.addEventListener('click', () => {
            cloudyUploadInput.click();
        });

        cloudyUploadInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Update upload button text to reflect loaded file
            btnUploadCloudy.innerHTML = `<i class="fa-solid fa-circle-check"></i> Loaded: ${file.name}`;
            btnUploadCloudy.style.borderColor = "rgba(244, 63, 94, 0.6)";
            btnUploadCloudy.style.color = "#f43f5e";

            // Extract file extension and validate format (PNG, JPG, TIF)
            const extension = file.name.split('.').pop().toLowerCase();
            const validExtensions = ['png', 'jpg', 'jpeg', 'tif', 'tiff'];
            
            if (!validExtensions.includes(extension)) {
                uploadStatus.classList.remove('hidden');
                uploadStatus.style.color = '#f43f5e'; // Error Red
                uploadStatusText.innerHTML = '<span style="font-weight: 800;"><i class="fa-solid fa-circle-exclamation"></i> Invalid File Format!</span><br>Compatible formats are PNG, JPG, and TIFF (.tif).';
                return;
            }

            await processCloudyImage(file);
        });
    }

    // Sample LISS-IV thumbnail selection & trigger
    const sampleContainers = document.querySelectorAll('.sample-img-container');
    const btnProcessSample = document.getElementById('btn-process-sample');
    let selectedSampleUrl = "./assets/test_liss4_1.png";
    let selectedSampleName = "test_liss4_1.png";

    // Set initial selection styling
    if (sampleContainers.length > 0) {
        sampleContainers[0].style.borderColor = "#f43f5e";
        sampleContainers[0].style.boxShadow = "0 0 8px rgba(244, 63, 94, 0.4)";
    }

    sampleContainers.forEach(container => {
        container.addEventListener('click', () => {
            const sampleIndex = container.getAttribute('data-sample');
            console.log(`[Reconstruction Engine] Thumbnail selected: Sample #${sampleIndex}`);

            // Reset borders of other samples
            sampleContainers.forEach(c => {
                c.style.borderColor = "rgba(255,255,255,0.15)";
                c.style.boxShadow = "none";
            });

            // Highlight selected
            container.style.borderColor = "#f43f5e";
            container.style.boxShadow = "0 0 8px rgba(244, 63, 94, 0.4)";

            selectedSampleUrl = `./assets/test_liss4_${sampleIndex}.png`;
            selectedSampleName = `test_liss4_${sampleIndex}.png`;

            // Update upload button text to reflect loaded test sample
            if (btnUploadCloudy) {
                btnUploadCloudy.innerHTML = `<i class="fa-solid fa-circle-check"></i> Loaded: test_liss4_${sampleIndex}.png`;
                btnUploadCloudy.style.borderColor = "rgba(56, 189, 248, 0.6)";
                btnUploadCloudy.style.color = "#38bdf8";
            }

            // Trigger a direct browser file download for the cloudy image sample!
            try {
                console.log(`[Reconstruction Engine] Initiating download for: ${selectedSampleName}`);
                fetch(selectedSampleUrl)
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
                        return res.blob();
                    })
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = selectedSampleName;
                        document.body.appendChild(link);
                        console.log(`[Reconstruction Engine] Click triggered on download link for: ${selectedSampleName}`);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => {
                            URL.revokeObjectURL(blobUrl);
                            console.log(`[Reconstruction Engine] Download completed successfully for: ${selectedSampleName}`);
                        }, 1000);
                    })
                    .catch(err => {
                        console.error("[Reconstruction Engine] Download failed:", err);
                    });
            } catch (downloadErr) {
                console.error("[Reconstruction Engine] Download execution error:", downloadErr);
            }

            // Auto-trigger prediction on click!
            triggerSamplePrediction(selectedSampleUrl, selectedSampleName);
        });
    });

    if (btnProcessSample) {
        btnProcessSample.addEventListener('click', () => {
            // Trigger a direct browser file download for the cloudy image sample!
            try {
                console.log(`[Reconstruction Engine] Process button: Initiating download for: ${selectedSampleName}`);
                fetch(selectedSampleUrl)
                    .then(res => {
                        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
                        return res.blob();
                    })
                    .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = selectedSampleName;
                        document.body.appendChild(link);
                        console.log(`[Reconstruction Engine] Process button: Click triggered on download link for: ${selectedSampleName}`);
                        link.click();
                        document.body.removeChild(link);
                        setTimeout(() => {
                            URL.revokeObjectURL(blobUrl);
                            console.log(`[Reconstruction Engine] Process button: Download completed successfully for: ${selectedSampleName}`);
                        }, 1000);
                    })
                    .catch(err => {
                        console.error("[Reconstruction Engine] Process button download failed:", err);
                    });
            } catch (downloadErr) {
                console.error("[Reconstruction Engine] Process button download execution error:", downloadErr);
            }

            triggerSamplePrediction(selectedSampleUrl, selectedSampleName);
        });
    }
}

// --- SATELLITE TOAST TO NOTIFY OF ACQUISITIONS (Inline Notification below upload) ---
function showTelemetryToast(title, subtitle) {
    const hudNotification = document.getElementById('hud-notification');
    if (hudNotification) {
        hudNotification.classList.remove('hidden');
        hudNotification.innerHTML = `
            <div style="font-weight: 800; font-size: 0.72rem; color: #f43f5e; letter-spacing: 0.5px; margin-bottom: 2px;">SYSTEM ALERT</div>
            <div style="font-weight: 600; font-size: 0.78rem; color: #ffffff; margin-bottom: 2px;">${title}</div>
            <div style="font-size: 0.7rem; color: #cbd5e1;">${subtitle}</div>
        `;
        
        // Auto dismiss after 8 seconds
        if (window.hudNotificationTimeout) {
            clearTimeout(window.hudNotificationTimeout);
        }
        window.hudNotificationTimeout = setTimeout(() => {
            hudNotification.classList.add('hidden');
        }, 8000);
    }
}

// --- WINDOW SIZE RESIZE EVENT HANDLING ---
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start simulation
init();

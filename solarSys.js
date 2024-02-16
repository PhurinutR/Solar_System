// Student Name: Phurinut Rungrojkitiyos

import * as THREE from "https://web.cs.manchester.ac.uk/three/three.js-master/build/three.module.js";
import { OrbitControls } from "https://web.cs.manchester.ac.uk/three/three.js-master/examples/jsm/controls/OrbitControls.js";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,
    window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.x = 0;
camera.position.y = 30;
camera.position.z = 500;
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1.0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add ligh sources
const light = new THREE.PointLight(0xffffff, 2, 1100);
light.position.set(0, 0, 0);
scene.add(light);

const amb = new THREE.AmbientLight(0x505050);
scene.add(amb);

// define earth's orbit curve
const curve = new THREE.EllipseCurve(
    0, 0,            // ax, aY
    350, 250,           // xRadius, yRadius
    0, 2 * Math.PI,  // aStartAngle, aEndAngle
    true,            // antiClockwise
    0                 // aRotation
);

// add earth orbit curve
var points = curve.getPoints(100);
var earthOrbitPoints = points;
var orbitGeometry = new THREE.BufferGeometry().setFromPoints(earthOrbitPoints);
var orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // set a suitable color
var orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
orbitLine.rotation.x = Math.PI / 2;
scene.add(orbitLine);

var controls;
var sunMesh;
var earthMesh;
var moonMesh;
var cloudMesh;
var earthSystem;
var backgroundMesh;

const loader = new THREE.TextureLoader();

init()

function init() {
    createSun();
    earthSystem = new THREE.Group()
    createEarth();
    createCloud();
    createMoon();
    scene.add(earthSystem);
    createBackground();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    animate();
}

function createSun() {
    var sunGeometry = new THREE.SphereGeometry(109, 400, 200);
    var texture = loader.load("/image_src/2k_sun.jpg");
    var sunMaterial = new THREE.MeshStandardMaterial(
        {
            emissive: 0xffd700,
            emissiveMap: texture,
            emissiveIntensity: 1,
            wireframe: false
        }
    );
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);
}

function createEarth() {
    var earthGeometry = new THREE.SphereGeometry(25, 50, 50);
    var texture = loader.load("/image_src/Earthmap1000x500.jpg");
    var earthMaterial = new THREE.MeshPhongMaterial(
        {
            map: texture
        }
    );
    earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(0, 0, 0);
    earthSystem.add(earthMesh);
}

function createCloud() {
    var cloudGeometry = new THREE.SphereGeometry(25.1, 50, 50);
    var texture = loader.load("/image_src/B3c7G.jpg");
    var cloudMaterial = new THREE.MeshPhongMaterial(
        {
            map: texture,
            transparent: true,
            opacity: 0.5
        }
    );
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.position.set(0, 0, 0);
    earthSystem.add(cloudMesh);
}

function createMoon() {
    var moonGeometry = new THREE.SphereGeometry(5, 40, 20);
    var texture = loader.load("/image_src/lroc_color_poles_1k.jpg");
    var moonMaterial = new THREE.MeshPhongMaterial(
        {
            map: texture
        }
    );
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    // moonMesh.position.set(50, 0, 0);
    earthSystem.add(moonMesh);
}

function createBackground() {
    var bGeometry = new THREE.SphereGeometry(5000, 40, 20);
    var texture = loader.load("/image_src/eso0932a.jpg");
    var bMaterial = new THREE.MeshPhongMaterial(
        {
            map: texture,
            side: THREE.DoubleSide
        }
    );
    backgroundMesh = new THREE.Mesh(bGeometry, bMaterial);
    scene.add(backgroundMesh);
}

function animate() {
    requestAnimationFrame(animate);

    var time = 0.00001 * performance.now();
    var t = (time % 1);
    var point = curve.getPoint(t);
    
    // earth-system movement
    earthSystem.position.x = point.x;
    earthSystem.position.z = point.y;

    // moon movement
    var speed = 100;
    var orbitRadius = 50;
    moonMesh.position.x = orbitRadius * Math.cos(time * speed);
    moonMesh.position.z = orbitRadius * Math.sin(time * speed);

    //planet rotation & cloud
    sunMesh.rotation.y += 0.01;
    earthMesh.rotation.y += 0.005;
    moonMesh.rotation.y += 0.01;
    cloudMesh.rotation.y += 0.003;

    renderer.render(scene, camera);
}
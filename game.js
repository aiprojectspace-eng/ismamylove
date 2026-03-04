// ====================
// BASIC 3D SETUP
// ====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
light.castShadow = true;
scene.add(light);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x55aa55 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

camera.position.set(0, 5, 12);

// ====================
// LOAD MODELS
// ====================

const loader = new THREE.GLTFLoader();

let hero = null;
let dragon = null;

// Hero
loader.load("./hero.glb", (glb) => {
  hero = glb.scene;
  hero.traverse(child => {
    if (child.isMesh) child.castShadow = true;
  });

  hero.scale.set(1.5, 1.5, 1.5);
  hero.position.set(0, 0, 0);

  scene.add(hero);
});

// Dragon
loader.load("./dragon.glb", (glb) => {
  dragon = glb.scene;
  dragon.traverse(child => {
    if (child.isMesh) child.castShadow = true;
  });

  dragon.scale.set(2, 2, 2);
  dragon.position.set(6, 0, 0);

  scene.add(dragon);
});

// Environment (optional)
loader.load("./environment.glb", (glb) => {
  let env = glb.scene;
  env.scale.set(5, 5, 5);
  scene.add(env);
});

// ====================
// MOBILE CONTROLS
// ====================

let moveX = 0;
let moveZ = 0;

const joystick = document.getElementById("joy");
const attackBtn = document.getElementById("attack");

// Joystick movement
joystick.addEventListener("touchmove", (e) => {
  let touch = e.touches[0];

  moveX = (touch.clientX - window.innerWidth / 2) * 0.001;
  moveZ = (touch.clientY - window.innerHeight / 2) * 0.001;
});

joystick.addEventListener("touchend", () => {
  moveX = 0;
  moveZ = 0;
});

// Attack
attackBtn.addEventListener("touchstart", () => {
  if (hero && dragon) {
    let dist = hero.position.distanceTo(dragon.position);

    if (dist < 4) {
      scene.remove(dragon);
      dragon = null;
      alert("🐉 Dragon Defeated!");
    }
  }
});

// ====================
// GAME LOOP
// ====================

function animate() {
  requestAnimationFrame(animate);

  if (hero) {
    hero.position.x += moveX;
    hero.position.z += moveZ;

    camera.position.x = hero.position.x;
    camera.position.z = hero.position.z + 12;
    camera.lookAt(hero.position);
  }

  renderer.render(scene, camera);
}

animate();

// Resize Fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

let camera, scene, renderer;

init();
render();

function init() {
  const container = document.querySelector("body");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
  camera.position.set(-1.8, 0.6, 2.7);

  scene = new THREE.Scene();

  new RGBELoader()
    .setPath("textures/")
    .load("quarry_01_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

      // model

      const loader = new GLTFLoader().setPath("models/");
      loader.load("wtf.glb", function (gltf) {
        scene.add(gltf.scene);

        render();
      });
    });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  var keyLight = new THREE.DirectionalLight(
    new THREE.Color("hsl(30, 100%, 75%)"),
    1.0
  );
  keyLight.position.set(-100, 0, 100);

  var fillLight = new THREE.DirectionalLight(
    new THREE.Color("hsl(240, 100%, 75%)"),
    0.75
  );
  fillLight.position.set(100, 0, 100);

  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();

  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}

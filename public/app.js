import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// Scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 500);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

// Snake setup
let snakeSegments = [];
let segmentSize = 2;
let segmentGeometry = new THREE.BoxGeometry(segmentSize, segmentSize, segmentSize);

// Material para el cuerpo de la serpiente
let bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    specular: 0x111111, // Especifica el color especular (resaltado) del material
    shininess: 30 // Controla la intensidad del brillo especular
});

// Material para la cabeza de la serpiente
let headMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Rojo para resaltar la cabeza
    specular: 0x111111,
    shininess: 30
});

// Material para la manzana
let appleMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Rojo para la manzana
    specular: 0x111111,
    shininess: 30
});

// Snake direction
let snakeDirection = 'RIGHT';

// Ajustar el tamaño del borde para que sea más grande que la ventana del juego
let borderSize = 60;
let borderGeometry = new THREE.BoxGeometry(borderSize * 2, borderSize * 2, 1);
let borderMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
let border = new THREE.Mesh(borderGeometry, borderMaterial);
scene.add(border);

// Añadir luz ambiente
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Añadir luz direccional para simular el sol
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Configurar sombras en el renderizador
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Suaviza las sombras

// Configurar sombras para la luz direccional
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;

// Función para detectar colisiones
function checkCollisions() {
    let head = snakeSegments[0];
    // Verificar si la cabeza de la serpiente está dentro del borde
    if (Math.abs(head.position.x) >= borderSize || Math.abs(head.position.y) >= borderSize) {
        // Colisión detectada, reiniciar juego o hacer lo que desees
        document.getElementById('resetButton').style.display = 'block';
    }
}

// Función para generar una manzana en una posición aleatoria
function createApple() {
    let apple = new THREE.Mesh(segmentGeometry, appleMaterial);
    let randomX = Math.floor(Math.random() * (borderSize * 2 - segmentSize * 2)) - borderSize + segmentSize;
    let randomY = Math.floor(Math.random() * (borderSize * 2 - segmentSize * 2)) - borderSize + segmentSize;
    apple.position.set(randomX, randomY, 0);
    scene.add(apple);
    return apple;
}

let apple = createApple();

// Función para detectar colisiones con la manzana
function checkAppleCollision() {
    let head = snakeSegments[0];
    if (head.position.distanceTo(apple.position) < segmentSize) {
        // Si la cabeza de la serpiente está cerca de la manzana, la serpiente come la manzana
        scene.remove(apple); // Eliminar la manzana
        apple = createApple(); // Generar una nueva manzana
        addSegment(); // Hacer crecer la serpiente
    }
}

// Función para reiniciar el juego
function resetGame() {
    // Puedes reiniciar la posición de la serpiente, restablecer el puntaje, etc.
    window.location.reload();
}

// Initial snake
for (let i = 0; i < 3; i++) {
    let segment = new THREE.Mesh(segmentGeometry, bodyMaterial); // Usar bodyMaterial para el cuerpo
    segment.position.x = -i * segmentSize;
    // Hacer que la serpiente proyecte sombras
    segment.castShadow = true;
    scene.add(segment);
    snakeSegments.push(segment);
}

function addSegment() {
    let tail = snakeSegments[snakeSegments.length - 1];
    let newSegment = new THREE.Mesh(segmentGeometry, bodyMaterial); // Usar bodyMaterial para el cuerpo
    newSegment.position.copy(tail.position);
    // Initially, just place the new segment on top of the tail
    scene.add(newSegment);
    snakeSegments.push(newSegment); // Add as new tail
}

function moveSnake() {
    let head = snakeSegments[0];
    let newHead = new THREE.Mesh(segmentGeometry, headMaterial); // Usar headMaterial para la cabeza
    newHead.position.copy(head.position);

    switch (snakeDirection) {
        case 'LEFT':
            newHead.position.x -= segmentSize;
            break;
        case 'RIGHT':
            newHead.position.x += segmentSize;
            break;
        case 'UP':
            newHead.position.y += segmentSize;
            break;
        case 'DOWN':
            newHead.position.y -= segmentSize;
            break;
    }

    snakeSegments.unshift(newHead); // Agregar nueva cabeza al principio
    scene.add(newHead);

    // Eliminar la cola
    let tail = snakeSegments.pop();
    scene.remove(tail);

    // Verificar colisiones después de cada movimiento
    checkCollisions();

    // Verificar colisiones con la manzana después de cada movimiento
    checkAppleCollision();
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowLeft':
            snakeDirection = 'LEFT';
            break;
        case 'ArrowRight':
            snakeDirection = 'RIGHT';
            break;
        case 'ArrowUp':
            snakeDirection = 'UP';
            break;
        case 'ArrowDown':
            snakeDirection = 'DOWN';
            break;
    }
}

document.addEventListener('keydown', changeDirection);

// Game loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

setInterval(moveSnake, 200);
animate();

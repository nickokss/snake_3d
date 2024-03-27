import * as THREE from 'three';

// Scene setup
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 50;

// Snake setup
let snakeSegments = [];
let segmentSize = 2;
let segmentGeometry = new THREE.BoxGeometry(segmentSize, segmentSize, segmentSize);
let segmentMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
let snakeDirection = 'RIGHT';

// Initial snake
for (let i = 0; i < 3; i++) {
    let segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
    segment.position.x = -i * segmentSize;
    scene.add(segment);
    snakeSegments.push(segment);
}

function addSegment() {
    let tail = snakeSegments[snakeSegments.length - 1];
    let newSegment = new THREE.Mesh(segmentGeometry, segmentMaterial);
    newSegment.position.copy(tail.position);
    // Initially, just place the new segment on top of the tail
    scene.add(newSegment);
    snakeSegments.push(newSegment); // Add as new tail
}

function moveSnake() {
    let head = snakeSegments[0];
    let newHead = new THREE.Mesh(segmentGeometry, segmentMaterial);
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

    snakeSegments.unshift(newHead); // Add new head at the beginning
    scene.add(newHead);

    // Remove the tail
    let tail = snakeSegments.pop();
    scene.remove(tail);
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

setInterval(moveSnake, 1000); // Move snake every second
animate();

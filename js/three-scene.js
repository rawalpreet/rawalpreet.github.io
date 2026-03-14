document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    
    // Position camera so the floor is visible at the bottom of the screen
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 40);
    camera.lookAt(0, -5, 0);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true, // Transparent to show CSS gradient
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    const backLighting = new THREE.DirectionalLight(0x2563eb, 0.6); // Blue accent
    backLighting.position.set(-20, 20, -20);
    scene.add(backLighting);

    // --- BACKGROUND PARTICLES ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 150;     // x
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 150; // y
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 150; // z
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0x2563eb,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- PROCEDURAL 3D WALKING DOG ---
    const dogMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.8, 
        metalness: 0.1 
    });
    const accentMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2563eb, 
        roughness: 0.4, 
        metalness: 0.2, 
        emissive: 0x1d4ed8, 
        emissiveIntensity: 0.2 
    });
    const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.9,
    });

    const robot = new THREE.Group(); // Keep variable name robot for easier code reuse but it's a dog now
    const initialY = -15; // "Ground" level for the dog

    // Body (longer)
    const bodyGeo = new THREE.BoxGeometry(2.5, 2.5, 5);
    const body = new THREE.Mesh(bodyGeo, dogMaterial);
    body.position.y = 3.5;
    robot.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(2, 2, 2.5);
    const head = new THREE.Mesh(headGeo, dogMaterial);
    head.position.set(0, 5, 3);
    robot.add(head);

    // Snout
    const snoutGeo = new THREE.BoxGeometry(1.2, 1, 1.5);
    const snout = new THREE.Mesh(snoutGeo, dogMaterial);
    snout.position.set(0, -0.2, 1.5);
    head.add(snout);

    // Nose
    const noseGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4);
    const nose = new THREE.Mesh(noseGeo, darkMaterial);
    nose.position.set(0, 0.3, 0.8);
    snout.add(nose);

    // Ears
    const earGeo = new THREE.BoxGeometry(0.4, 1.5, 1);
    const leftEar = new THREE.Mesh(earGeo, accentMaterial);
    leftEar.position.set(-1.1, 1, -0.5);
    leftEar.rotation.z = Math.PI / 8;
    head.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, accentMaterial);
    rightEar.position.set(1.1, 1, -0.5);
    rightEar.rotation.z = -Math.PI / 8;
    head.add(rightEar);

    // Tail
    const tailGeo = new THREE.BoxGeometry(0.5, 3, 0.5);
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 4.5, -2.5); // Attach to back of body
    
    const tail = new THREE.Mesh(tailGeo, accentMaterial);
    tail.position.y = 1.5; // Pivot from bottom
    tail.rotation.x = -Math.PI / 6; // Angle it slightly up and back by default
    tailGroup.add(tail);
    robot.add(tailGroup);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.8, 3, 0.8);
    
    // Front Left Leg
    const frontLeftLegGroup = new THREE.Group();
    frontLeftLegGroup.position.set(-0.9, 2.5, 2);
    const flLeg = new THREE.Mesh(legGeo, dogMaterial);
    flLeg.position.y = -1.5;
    frontLeftLegGroup.add(flLeg);
    robot.add(frontLeftLegGroup);

    // Front Right Leg
    const frontRightLegGroup = new THREE.Group();
    frontRightLegGroup.position.set(0.9, 2.5, 2);
    const frLeg = new THREE.Mesh(legGeo, dogMaterial);
    frLeg.position.y = -1.5;
    frontRightLegGroup.add(frLeg);
    robot.add(frontRightLegGroup);

    // Back Left Leg
    const backLeftLegGroup = new THREE.Group();
    backLeftLegGroup.position.set(-0.9, 2.5, -2);
    const blLeg = new THREE.Mesh(legGeo, dogMaterial);
    blLeg.position.y = -1.5;
    backLeftLegGroup.add(blLeg);
    robot.add(backLeftLegGroup);

    // Back Right Leg
    const backRightLegGroup = new THREE.Group();
    backRightLegGroup.position.set(0.9, 2.5, -2);
    const brLeg = new THREE.Mesh(legGeo, dogMaterial);
    brLeg.position.y = -1.5;
    backRightLegGroup.add(brLeg);
    robot.add(backRightLegGroup);

    scene.add(robot);

    // Start position
    robot.position.set(0, initialY, 0);

    // --- INVISIBLE FLOOR FOR RAYCASTING ---
    const floorGeo = new THREE.PlaneGeometry(300, 300);
    const floorMat = new THREE.MeshBasicMaterial({ visible: false }); // Invisible
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = initialY;
    scene.add(floor);

    // --- MOUSE TRACKING & INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetPosition = new THREE.Vector3(0, initialY, 20); // Initial Target
    let roamTarget = new THREE.Vector3(0, initialY, 20); // Where to roam to
    let speed = 0;
    let lastPosition = new THREE.Vector3().copy(robot.position);
    
    // State Management
    let isMouseActive = false;
    let mouseTimeout;

    const updateTargetPosition = (clientX, clientY) => {
        isMouseActive = true;
        
        // Reset timeout so it keeps following mouse as long as mouse is moving
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseActive = false;
            // Generate a new roam target near where it currently is immediately
            generateNewRoamTarget();
        }, 1500); // Wait 1.5 seconds after mouse stops moving to start roaming again

        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(floor);
        
        if (intersects.length > 0) {
            targetPosition.copy(intersects[0].point);
        }
    };

    // Track mouse movement anywhere on document
    document.addEventListener('mousemove', (event) => {
        updateTargetPosition(event.clientX, event.clientY);
    });

    // Track touch movement
    document.addEventListener('touchmove', (event) => {
        if(event.touches.length > 0) {
            updateTargetPosition(event.touches[0].clientX, event.touches[0].clientY);
        }
    }, { passive: true });

    // --- AUTONOMOUS ROAMING LOGIC ---
    const generateNewRoamTarget = () => {
        // Pick a random point on the floor within viewing range
        const rangeX = 80;
        const rangeZ = 50;
        
        roamTarget.x = (Math.random() - 0.5) * rangeX;
        roamTarget.y = initialY;
        roamTarget.z = Math.random() * rangeZ - (rangeZ/2) + 20; // Keep generally in front of camera
    };

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let walkPhase = 0;
    const followSpeed = 25; // Adjusted to be a walking speed towards cursor rather than lerp factor
    const roamSpeed = 8; // Restoring a more moderate roaming speed
    const stopDistance = 3.0; // Distance from cursor to stop and idle

    const animate = () => {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Very slow ambient background rotation
        particlesMesh.rotation.y = elapsedTime * 0.03;

        // Determine active target based on state
        const currentTarget = isMouseActive ? targetPosition : roamTarget;
        
        // Calculate distance from current robot pos to active target
        const distanceToTarget = robot.position.distanceTo(currentTarget);
        
        // --- ROBOT MOVEMENT LOGIC ---
        const moveSpeed = isMouseActive ? followSpeed : roamSpeed; 
        const turnRateMultiplier = isMouseActive ? 10 : 3;
        
        // Stop earlier if tracking mouse so it doesn't jitter right on top of the cursor
        const currentStopDistance = isMouseActive ? stopDistance : 0.5;

        if (distanceToTarget > currentStopDistance) {
            // Smoothly move towards target for BOTH roaming and mouse active
            const moveDir = new THREE.Vector3().subVectors(currentTarget, robot.position).normalize();
            robot.position.add(moveDir.multiplyScalar(moveSpeed * delta));
            
            // Keep on the floor
            robot.position.y = initialY;
            
            // Look towards the target direction
            const directionVector = new THREE.Vector3().subVectors(currentTarget, robot.position);
            const targetRotationY = Math.atan2(directionVector.x, directionVector.z);
            
            // Smoothly rotate shortest path
            let diff = targetRotationY - robot.rotation.y;
            while(diff < -Math.PI) diff += Math.PI * 2;
            while(diff > Math.PI) diff -= Math.PI * 2;
            
            robot.rotation.y += diff * turnRateMultiplier * delta;

            // Artificial speed calculation based on requested speed for animations
            speed = moveSpeed;

            // --- Walk Animation based on speed ---
            if (speed > 0.05) { 
                // Animate limbs 
                const animationMultiplier = isMouseActive ? 0.8 : 0.5; 
                walkPhase += speed * delta * animationMultiplier; 
                
                // Dog trotting pattern
                frontLeftLegGroup.rotation.x = Math.sin(walkPhase);
                backRightLegGroup.rotation.x = Math.sin(walkPhase);
                
                frontRightLegGroup.rotation.x = -Math.sin(walkPhase);
                backLeftLegGroup.rotation.x = -Math.sin(walkPhase);
                
                // Tail wagging while walking
                tailGroup.rotation.z = Math.sin(walkPhase * 2) * 0.3;

                // Step Bobbing
                robot.position.y = initialY + Math.abs(Math.sin(walkPhase)) * Math.min(speed * 0.05, 0.5);
            }
            
        } else {
            // Arrived at target
            if (!isMouseActive) {
                // Generate a new place to walk to if roaming
                generateNewRoamTarget();
            } else {
                // Mouse still active but we caught up to it: Idle state
                frontLeftLegGroup.rotation.x += (0 - frontLeftLegGroup.rotation.x) * 10 * delta;
                frontRightLegGroup.rotation.x += (0 - frontRightLegGroup.rotation.x) * 10 * delta;
                backLeftLegGroup.rotation.x += (0 - backLeftLegGroup.rotation.x) * 10 * delta;
                backRightLegGroup.rotation.x += (0 - backRightLegGroup.rotation.x) * 10 * delta;

                // Happy tail wag while idling
                tailGroup.rotation.z = Math.sin(elapsedTime * 6) * 0.4;

                // Slowly turn to face the camera when stopped
                let diff = 0 - robot.rotation.y;
                while(diff < -Math.PI) diff += Math.PI * 2;
                while(diff > Math.PI) diff -= Math.PI * 2;
                robot.rotation.y += diff * 2 * delta;

                robot.position.y = currentTarget.y + Math.sin(elapsedTime * 2) * 0.3; // Breathing float
            }
        }

        // Save last position for velocity calculation next frame
        lastPosition.copy(robot.position);

        renderer.render(scene, camera);
    };

    // Initial roam target setup
    generateNewRoamTarget();
    
    animate();
});

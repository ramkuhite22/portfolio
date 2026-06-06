import * as THREE from 'three';

/**
 * MEDICAL 3D MODELS LIBRARY
 * This file demonstrates how complex 3D models are built purely using code and mathematics.
 */

// 1. The Capsule / Pill (Combining Spheres and Cylinders)
export function createPill(color1 = 0xffffff, color2 = 0x00f2fe) {
    const group = new THREE.Group();
    
    // Top half (Half-Sphere)
    const topGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topMat = new THREE.MeshPhysicalMaterial({ color: color1, roughness: 0.2, clearcoat: 0.8 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = 0.5;
    
    // Bottom half (Half-Sphere)
    const bottomGeo = new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottomMat = new THREE.MeshPhysicalMaterial({ color: color2, roughness: 0.2, clearcoat: 0.8 });
    const bottom = new THREE.Mesh(bottomGeo, bottomMat);
    bottom.position.y = -0.5;
    
    // Middle Cylinder Top
    const midTopGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    const midTop = new THREE.Mesh(midTopGeo, topMat);
    midTop.position.y = 0.25;
    
    // Middle Cylinder Bottom
    const midBotGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
    const midBot = new THREE.Mesh(midBotGeo, bottomMat);
    midBot.position.y = -0.25;
    
    group.add(top, bottom, midTop, midBot);
    return group;
}

// 2. The Syringe (Layering Translucent and Solid Shapes)
export function createSyringe(fluidColor = 0x8a2be2) {
    const group = new THREE.Group();
    
    // Glass Body (Translucent Material)
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 
    });
    const body = new THREE.Mesh(bodyGeo, glassMat);
    
    // Glowing Fluid inside
    const fluidGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 32);
    const fluidMat = new THREE.MeshBasicMaterial({ color: fluidColor, transparent: true, opacity: 0.8 });
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.position.y = -0.3;
    
    // Plunger
    const plungerGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const solidMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const plunger = new THREE.Mesh(plungerGeo, solidMat);
    plunger.position.y = 1.2;
    
    const plungerTopGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const plungerTop = new THREE.Mesh(plungerTopGeo, solidMat);
    plungerTop.position.y = 1.95;
    
    // Needle Hub & Needle
    const hubGeo = new THREE.CylinderGeometry(0.4, 0.1, 0.4, 16);
    const hub = new THREE.Mesh(hubGeo, solidMat);
    hub.position.y = -1.2;
    
    const needleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const needleMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c8, metalness: 1, roughness: 0.1 });
    const needle = new THREE.Mesh(needleGeo, needleMat);
    needle.position.y = -1.9;
    
    group.add(body, fluid, plunger, plungerTop, hub, needle);
    return group;
}

// 3. Extruded Heart Shape (Using 2D Paths converted to 3D)
export function createHeart(color = 0xff0844) {
    const shape = new THREE.Shape();
    // Drawing a heart using bezier curves
    const x = 0, y = 0;
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const extrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    geometry.computeBoundingBox();
    const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(centerOffset, -10, -1);
    geometry.scale(0.1, -0.1, 0.1); 

    const material = new THREE.MeshPhysicalMaterial({ color: color, roughness: 0.2, clearcoat: 1.0 });
    return new THREE.Mesh(geometry, material);
}

// 4. Abstract Cell / Virus (Mathematical Distribution)
export function createCell(coreColor = 0x00f2fe, spikeColor = 0x8a2be2) {
    const group = new THREE.Group();
    
    const coreGeo = new THREE.SphereGeometry(1, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({ color: coreColor, transmission: 0.8, transparent: true, roughness: 0.2 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);
    
    // Spikes (Using Fibonacci sphere math for perfect even spacing across the 3D surface)
    const samples = 40;
    const spikeGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.5, 8);
    const spikeMat = new THREE.MeshBasicMaterial({ color: spikeColor });
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < samples; i++) {
        const y = 1 - (i / (samples - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i; 

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x, y, z);
        
        // Point spike outward away from center
        spike.lookAt(new THREE.Vector3(x * 2, y * 2, z * 2));
        spike.rotateX(Math.PI / 2);
        group.add(spike);
    }
    return group;
}

"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    // Renderer setup with alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse-driven 3D tilt
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Center Core - Holographic Icosahedron Wireframe
    const icoGeometry = new THREE.IcosahedronGeometry(4.2, 1);
    const icoMaterial = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.45,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    mainGroup.add(icosahedron);

    // 2. Inner Glowing Core Crystal
    const coreGeometry = new THREE.OctahedronGeometry(2.4, 0);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x6366f1,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const coreCrystal = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreCrystal);

    // 3. Floating Orbital Rings (Gimbal rings)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.04, 16, 100),
      ringMaterial
    );
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(7.4, 0.04, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    mainGroup.add(ring2);

    // 4. Floating 3D Star / Node Field (1,200 depth particles)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x6366f1);
    const colorB = new THREE.Color(0xa855f7);
    const colorC = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Distribute in a sphere radius
      const radius = 9 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const mixedColor =
        i % 3 === 0 ? colorA : i % 3 === 1 ? colorB : colorC;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightIndigo = new THREE.PointLight(0x6366f1, 3, 50);
    pointLightIndigo.position.set(10, 10, 10);
    scene.add(pointLightIndigo);

    const pointLightCyan = new THREE.PointLight(0x06b6d4, 2.5, 50);
    pointLightCyan.position.set(-10, -10, 10);
    scene.add(pointLightCyan);

    const pointLightPink = new THREE.PointLight(0xec4899, 2, 50);
    pointLightPink.position.set(0, 15, -10);
    scene.add(pointLightPink);

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      mainGroup.rotation.y = mouseX * 1.5 + elapsedTime * 0.12;
      mainGroup.rotation.x = mouseY * 1.5 + Math.sin(elapsedTime * 0.2) * 0.08;

      // Rotating 3D elements
      icosahedron.rotation.x = elapsedTime * 0.15;
      icosahedron.rotation.y = elapsedTime * 0.2;

      coreCrystal.rotation.x = -elapsedTime * 0.3;
      coreCrystal.rotation.y = -elapsedTime * 0.25;

      ring1.rotation.z = elapsedTime * 0.18;
      ring2.rotation.x = elapsedTime * 0.14;
      ring2.rotation.z = -elapsedTime * 0.2;

      // Subtle particle swirl
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

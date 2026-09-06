"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function BackgroundScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Floating Geometric Prisms
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.TetrahedronGeometry(1.8),
      new THREE.OctahedronGeometry(1.5),
      new THREE.IcosahedronGeometry(1.4),
      new THREE.TorusGeometry(1.5, 0.4, 8, 24),
    ];

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.3,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.4,
        metalness: 0.7,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
    ];

    const positions = [
      [-14, 8, -5],
      [15, -6, -8],
      [-12, -9, -3],
      [14, 10, -6],
      [-2, 14, -10],
      [3, -13, -7],
    ];

    positions.forEach((pos, idx) => {
      const geo = geometries[idx % geometries.length];
      const mat = materials[idx % materials.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      shapes.push(mesh);
    });

    // Ambient Lighting
    const light = new THREE.PointLight(0x818cf8, 2, 40);
    light.position.set(0, 0, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    let clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      shapes.forEach((mesh, idx) => {
        mesh.rotation.x = t * (0.15 + idx * 0.05);
        mesh.rotation.y = t * (0.12 + idx * 0.04);
        mesh.position.y += Math.sin(t * 1.5 + idx) * 0.005;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70 overflow-hidden"
      aria-hidden="true"
    />
  );
}

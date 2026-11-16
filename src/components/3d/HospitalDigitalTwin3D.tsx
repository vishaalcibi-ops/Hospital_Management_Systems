/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Enterprise 3D Hospital Digital Twin
 * Interactive Three.js multi-floor hospital architectural model with real-time room occupancy,
 * departmental hotspots, and critical bed telemetry.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { sound } from '../../services/audioService';
import { db } from '../../services/mockDatabase';
import {
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Building,
  Activity,
  AlertCircle,
  CheckCircle2,
  X,
  Flame,
  ShieldAlert
} from 'lucide-react';

interface HospitalDigitalTwinProps {
  onClose?: () => void;
  inline?: boolean;
}

interface FloorInfo {
  level: number;
  name: string;
  code: string;
  departments: string[];
  bedCount: number;
  color: number;
}

const FLOORS: FloorInfo[] = [
  {
    level: 4,
    name: 'Critical Care & ICUs',
    code: 'F4-ICU',
    departments: ['Cardiac ICU', 'Neuro ICU', 'Pediatric ICU (PICU)', 'Negative Pressure Isolation'],
    bedCount: 36,
    color: 0xef4444
  },
  {
    level: 3,
    name: 'Surgical Suites & Cath Lab',
    code: 'F3-SURG',
    departments: ['OT Suite 1-6', 'Hybrid Cath Lab', 'Endoscopy Suite', 'Central Sterile Supply (CSSD)'],
    bedCount: 24,
    color: 0x3b82f6
  },
  {
    level: 2,
    name: 'Inpatient Wards & Deluxe Rooms',
    code: 'F2-WARD',
    departments: ['General Medical Ward', 'Surgical Recovery', 'Executive Deluxe Suites', 'Postnatal Ward'],
    bedCount: 72,
    color: 0x10b981
  },
  {
    level: 1,
    name: 'Diagnostic Sciences & Pharmacy',
    code: 'F1-DIAG',
    departments: ['Clinical Pathology (NABL)', 'Radiology (3T MRI / 128-Slice CT)', 'Central Pharmacy', 'Daycare Chemotherapy'],
    bedCount: 20,
    color: 0x8b5cf6
  },
  {
    level: 0,
    name: 'Emergency Trauma & OPD Atrium',
    code: 'GF-ER',
    departments: ['24/7 Level-1 Trauma Centre', 'OPD Registration & Triage', 'Ambulance Bay', 'Blood Bank'],
    bedCount: 40,
    color: 0xf59e0b
  }
];

export const HospitalDigitalTwin3D: React.FC<HospitalDigitalTwinProps> = ({
  onClose,
  inline = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [bedsData, setBedsData] = useState(() => db.getBeds());

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const floorMeshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const unsub = db.subscribe(() => {
      setBedsData([...db.getBeds()]);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f5fa);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(22, 18, 26);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent dipping beneath floor
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.target.set(0, 4, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    fillLight.position.set(-20, 20, -20);
    scene.add(fillLight);

    // 6. Ground Base
    const groundGeo = new THREE.CylinderGeometry(20, 20, 0.4, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Campus Roads / Lawn
    const lawnGeo = new THREE.RingGeometry(13, 19.5, 64);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0xc7d2fe,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.y = 0.02;
    scene.add(lawn);

    // 7. Hospital Multi-Floor Tower Structure
    const floorMeshes: THREE.Mesh[] = [];
    FLOORS.forEach((floor) => {
      const floorGroup = new THREE.Group();

      // Main Slab
      const slabGeo = new THREE.BoxGeometry(14, 1.4, 10);
      const slabMat = new THREE.MeshStandardMaterial({
        color: floor.color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.castShadow = true;
      slab.receiveShadow = true;
      slab.position.y = floor.level * 2.2 + 0.9;
      slab.userData = { level: floor.level, info: floor };

      // Glass Perimeter
      const glassGeo = new THREE.BoxGeometry(14.2, 0.6, 10.2);
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.y = floor.level * 2.2 + 1.6;

      floorGroup.add(slab);
      floorGroup.add(glass);
      scene.add(floorGroup);
      floorMeshes.push(slab);
    });
    floorMeshesRef.current = floorMeshes;

    // 8. Helipad on Roof (Top of Floor 4)
    const roofLevel = 4 * 2.2 + 2.0;
    const helipadGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
    const helipadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.5
    });
    const helipad = new THREE.Mesh(helipadGeo, helipadMat);
    helipad.position.set(0, roofLevel, 0);
    scene.add(helipad);

    // Helipad 'H' ring
    const hRingGeo = new THREE.RingGeometry(2.6, 2.9, 32);
    const hRingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
    const hRing = new THREE.Mesh(hRingGeo, hRingMat);
    hRing.rotation.x = -Math.PI / 2;
    hRing.position.set(0, roofLevel + 0.12, 0);
    scene.add(hRing);

    // 9. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Floor Selection Zoom
  const handleSelectFloor = (level: number | null) => {
    sound.playClick();
    setSelectedFloor(level);
    if (!controlsRef.current || !cameraRef.current) return;

    if (level === null) {
      // Reset view
      controlsRef.current.target.set(0, 4, 0);
      cameraRef.current.position.set(22, 18, 26);
      floorMeshesRef.current.forEach(m => {
        (m.material as THREE.MeshStandardMaterial).opacity = 0.85;
      });
    } else {
      // Focus on floor
      const targetY = level * 2.2 + 0.9;
      controlsRef.current.target.set(0, targetY, 0);
      cameraRef.current.position.set(14, targetY + 6, 16);

      // Highlight target floor, dim others
      floorMeshesRef.current.forEach(m => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (m.userData.level === level) {
          mat.opacity = 1.0;
        } else {
          mat.opacity = 0.25;
        }
      });
    }
  };

  const currentFloorInfo = FLOORS.find(f => f.level === selectedFloor);

  return (
    <div className={`relative ${inline ? 'w-full h-[520px]' : 'fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4'}`}>
      <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col ${inline ? 'w-full h-full' : 'max-w-6xl w-full h-[85vh]'}`}>
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">MediCore 3D Hospital Digital Twin</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-500">Real-time spatial campus mapping, multi-level clinical zoning & bed occupancy sensors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectFloor(null)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset View
            </button>
            {onClose && (
              <button
                onClick={() => { sound.playClick(); onClose(); }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* 3D Viewport with Overlays */}
        <div className="relative flex-1 bg-slate-50 overflow-hidden">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Left Vertical Floor Switcher */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Floor Levels
            </span>
            {FLOORS.map((f) => (
              <button
                key={f.level}
                onClick={() => handleSelectFloor(f.level)}
                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedFloor === f.level
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="font-mono">{f.code}</span>
                <span className="text-[11px] font-normal opacity-80">{f.name.split('&')[0]}</span>
              </button>
            ))}
            <button
              onClick={() => handleSelectFloor(null)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border-t border-slate-200 ${
                selectedFloor === null ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Entire Campus View
            </button>
          </div>

          {/* Bottom Info Bar / Selected Floor Overview */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            {currentFloorInfo ? (
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {currentFloorInfo.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{currentFloorInfo.name}</h3>
                  <span className="text-xs text-slate-500">• {currentFloorInfo.bedCount} Inpatient / Monitor Beds</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {currentFloorInfo.departments.map((dept, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        sound.playClick();
                        setActiveDepartment(dept);
                      }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                        activeDepartment === dept
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-sm">MediCore Multi-Speciality Campus Complex</h3>
                <p className="text-xs text-slate-500">
                  Select a specific floor from the left panel to inspect spatial department zones, critical care beds, and air filtration status.
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Sanitization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

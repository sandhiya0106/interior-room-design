import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowLeft, Save, Maximize2, RotateCcw, Camera } from 'lucide-react';

export default function ThreeScene({ designData, onBack, onSave }) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(designData.theme === 'dark' ? 0x09090b : 0xf4f4f5);
    
    // CAMERA
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(12, 12, 12);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // LIGHTS
    const ambientIntensity = designData.lighting === 'natural' ? 0.7 : 0.5;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    let lightColor = 0xffffff;
    if (designData.lighting === 'warm') lightColor = 0xffe4b5;
    if (designData.lighting === 'cool') lightColor = 0xe0ffff;

    const mainLight = new THREE.DirectionalLight(lightColor, 1.2);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // ROOM CONSTRUCTION
    let roomSize = 12;
    if (designData.roomSize === 'small') roomSize = 8;
    if (designData.roomSize === 'large') roomSize = 18;
    
    const wallHeight = designData.roomSize === 'small' ? 5 : 7;

    // Floor
    let floorColor = 0x8b5a2b; // wood
    if (designData.flooring === 'tiles') floorColor = 0xd1d5db;
    if (designData.flooring === 'marble') floorColor = 0xf3f4f6;

    const floorGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: floorColor,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(roomSize, roomSize);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: designData.ceilingColor });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = wallHeight;
    scene.add(ceiling);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: designData.wallColor,
      roughness: 0.9
    });
    const accentWallMat = new THREE.MeshStandardMaterial({ 
      color: designData.accentWallColor,
      roughness: 0.9
    });

    // Back Wall (Accent Wall)
    const backWallGeo = new THREE.PlaneGeometry(roomSize, wallHeight);
    const backWall = new THREE.Mesh(backWallGeo, accentWallMat);
    backWall.position.z = -roomSize / 2;
    backWall.position.y = wallHeight / 2;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(roomSize, wallHeight);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.x = -roomSize / 2;
    leftWall.position.y = wallHeight / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Wall (Invisible by default for view, but we can add it)
    const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.x = roomSize / 2;
    rightWall.position.y = wallHeight / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Rug
    if (designData.hasRug) {
      const rugGeo = new THREE.PlaneGeometry(roomSize * 0.6, roomSize * 0.4);
      const rugMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 1 });
      const rug = new THREE.Mesh(rugGeo, rugMat);
      rug.rotation.x = -Math.PI / 2;
      rug.position.y = 0.01;
      scene.add(rug);
    }

    // Painting
    if (designData.hasPainting) {
      const paintGeo = new THREE.PlaneGeometry(3, 2);
      const paintMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
      const painting = new THREE.Mesh(paintGeo, paintMat);
      painting.position.set(0, wallHeight / 2 + 0.5, -roomSize / 2 + 0.05);
      scene.add(painting);
    }

    // Clock
    if (designData.hasClock) {
      const clockGroup = new THREE.Group();
      const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      face.rotation.x = Math.PI / 2;
      clockGroup.add(face);
      
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.05, 16, 100),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      clockGroup.add(rim);
      
      clockGroup.position.set(-roomSize / 2 + 0.1, wallHeight / 2 + 1.5, -2);
      clockGroup.rotation.y = Math.PI / 2;
      scene.add(clockGroup);
    }

    // Bookshelf
    if (designData.hasBookshelf) {
      const shelfGroup = new THREE.Group();
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2, 5, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x4b2c20 })
      );
      frame.position.y = 2.5;
      shelfGroup.add(frame);
      
      // Shelves
      for (let i = 1; i < 5; i++) {
        const shelf = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, 0.1, 0.7),
          new THREE.MeshStandardMaterial({ color: 0x3b1c10 })
        );
        shelf.position.y = i;
        shelfGroup.add(shelf);
      }
      
      shelfGroup.position.set(roomSize / 2 - 1.5, 0, -roomSize / 2 + 1);
      scene.add(shelfGroup);
    }

    // Plant
    if (designData.hasPlant) {
      const plantGroup = new THREE.Group();
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.3, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      pot.position.y = 0.4;
      plantGroup.add(pot);
      
      const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x166534 })
      );
      leaves.position.y = 1.2;
      plantGroup.add(leaves);
      
      plantGroup.position.set(-roomSize / 2 + 1.5, 0, -roomSize / 2 + 1.5);
      scene.add(plantGroup);
    }

    // Window & Curtains
    if (designData.windowPosition !== 'none') {
      const windowGroup = new THREE.Group();
      
      // Window Pane
      const windowPane = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 3),
        new THREE.MeshStandardMaterial({ 
          color: 0xbae6fd, 
          emissive: 0xbae6fd,
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.6
        })
      );
      
      const windowFrame = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 3.2, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      
      windowGroup.add(windowFrame);
      windowGroup.add(windowPane);
      
      if (designData.hasCurtains) {
        const curtainMat = new THREE.MeshStandardMaterial({ color: 0xfefce8, side: THREE.DoubleSide });
        const curtainL = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 4), curtainMat);
        curtainL.position.set(-1.8, 0, 0.1);
        const curtainR = curtainL.clone();
        curtainR.position.x = 1.8;
        windowGroup.add(curtainL);
        windowGroup.add(curtainR);
        
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.5), new THREE.MeshStandardMaterial({ color: 0x000000 }));
        rod.rotation.z = Math.PI / 2;
        rod.position.set(0, 2, 0.15);
        windowGroup.add(rod);
      }
      
      if (designData.windowPosition === 'left') {
        windowGroup.rotation.y = Math.PI / 2;
        windowGroup.position.set(-roomSize / 2 + 0.1, wallHeight / 2 + 1, 0);
      } else {
        windowGroup.position.set(0, wallHeight / 2 + 1, -roomSize / 2 + 0.1);
      }
      scene.add(windowGroup);
    }

    // FURNITURE GENERATION
    const posMap = { left: -4, center: 0, right: 4 };

    const createSofa = (x, z) => {
      const group = new THREE.Group();
      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.8, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x374151 })
      );
      base.position.y = 0.4;
      base.castShadow = true;
      group.add(base);
      
      // Backrest
      const back = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1.2, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x374151 })
      );
      back.position.set(0, 1, -0.7);
      back.castShadow = true;
      group.add(back);

      // Arms
      const armL = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.6, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x374151 })
      );
      armL.position.set(-1.8, 0.7, 0);
      armL.castShadow = true;
      group.add(armL);

      const armR = armL.clone();
      armR.position.x = 1.8;
      group.add(armR);

      group.position.set(x, 0, z);
      return group;
    };

    const createBed = (x, z) => {
      const group = new THREE.Group();
      // Frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.6, 5),
        new THREE.MeshStandardMaterial({ color: 0x4b2c20 })
      );
      frame.position.y = 0.3;
      frame.castShadow = true;
      group.add(frame);

      // Mattress
      const mattress = new THREE.Mesh(
        new THREE.BoxGeometry(3.3, 0.4, 4.8),
        new THREE.MeshStandardMaterial({ color: 0xffffff })
      );
      mattress.position.y = 0.7;
      group.add(mattress);

      // Headboard
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x4b2c20 })
      );
      head.position.set(0, 1, -2.4);
      head.castShadow = true;
      group.add(head);

      group.position.set(x, 0, z);
      return group;
    };

    const createTable = (x, z) => {
      const group = new THREE.Group();
      // Top
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.1, 2),
        new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
      );
      top.position.y = 1.5;
      top.castShadow = true;
      group.add(top);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x4b2c20 });
      const positions = [[1.4, 0.75, 0.9], [-1.4, 0.75, 0.9], [1.4, 0.75, -0.9], [-1.4, 0.75, -0.9]];
      positions.forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        group.add(leg);
      });

      group.position.set(x, 0, z);
      return group;
    };

    const createChair = (x, z) => {
      const group = new THREE.Group();
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.1, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1f2937 })
      );
      seat.position.y = 0.8;
      group.add(seat);

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x1f2937 })
      );
      back.position.set(0, 1.3, -0.35);
      group.add(back);

      const legGeo = new THREE.BoxGeometry(0.05, 0.8, 0.05);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
      [[0.35, 0.4, 0.35], [-0.35, 0.4, 0.35], [0.35, 0.4, -0.35], [-0.35, 0.4, -0.35]].forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        group.add(leg);
      });

      group.position.set(x, 0, z);
      return group;
    };

    // Add Furniture based on template and requirements
    if (designData.template === 'living') {
      scene.add(createSofa(posMap[designData.sofaPosition], -3));
      scene.add(createTable(0, 1));
    } else if (designData.template === 'bedroom') {
      scene.add(createBed(posMap[designData.bedPosition], -2));
      scene.add(createTable(posMap[designData.tablePosition], 3));
    } else if (designData.template === 'office') {
      scene.add(createTable(posMap[designData.tablePosition], -3));
      scene.add(createChair(posMap[designData.tablePosition], -1.5));
    } else if (designData.template === 'dining') {
      scene.add(createTable(0, 0));
      scene.add(createChair(-2, 0));
      scene.add(createChair(2, 0));
    }

    // ANIMATION
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    setLoading(false);

    // CLEANUP
    const currentMount = mountRef.current;
    return () => {
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [designData]);

  return (
    <div className="h-full w-full relative group">
      <div ref={mountRef} className="h-full w-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-emerald-500 font-bold tracking-widest animate-pulse">GENERATING 3D SPACE...</p>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute top-8 left-8 flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-black hover:bg-white/20 transition-all flex items-center gap-2 group/btn"
        >
          <ArrowLeft size={20} className="group-hover/btn:-translate-x-1 transition-transform" />
          <span  className="font-bold text-sm">EDIT REQUIREMENTS</span>
        </button>
      </div>

      <div className="absolute top-8 right-8 flex flex-col gap-4">
        <button 
          onClick={onSave}
          className="p-4 rounded-2xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-xl group/save"
        >
          <Save size={20} className="group-hover/save:scale-110 transition-transform" />
          <span className="font-bold text-sm">SAVE DESIGN</span>
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-6 rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-white flex items-center gap-8 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-lg bg-white/10"><RotateCcw size={16} /></div>
          <span className="text-[10px] font-bold text-zinc-400">ROTATE</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-lg bg-white/10"><Maximize2 size={16} /></div>
          <span className="text-[10px] font-bold text-zinc-400">ZOOM</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-lg bg-white/10"><Camera size={16} /></div>
          <span className="text-[10px] font-bold text-zinc-400">SCREENSHOT</span>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-white">
        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Active Design</div>
        <div className="text-xl font-bold tracking-tight uppercase">{designData.template} Room</div>
      </div>
    </div>
  );
}

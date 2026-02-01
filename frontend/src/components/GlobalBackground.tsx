import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

// Reusing ParticleCloud logic but adapted for global state
function ParticleCloud({ color, speed = 1 }: { color: string; speed?: number }) {
    const ref = useRef<any>(null);
    // @ts-ignore
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / (10 / speed);
            ref.current.rotation.y -= delta / (15 / speed);
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

function CameraController({ mode }: { mode: 'story' | 'dashboard' }) {
    useFrame((state, delta) => {
        const targetZ = mode === 'dashboard' ? 0.5 : 3;
        // Smooth damp for cinematic feel
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 1.5);

        // Optional: slight rotation or lookAt adjustment
        // state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, mode === 'dashboard' ? 0.1 : 0, delta);
    });
    return null;
}

interface GlobalBackgroundProps {
    mode: 'story' | 'dashboard';
    slideIndex: number;
}

export default function GlobalBackground({ mode, slideIndex }: GlobalBackgroundProps) {
    // Colors for Story Slides
    const storyColors = ["#f43f5e", "#06b6d4", "#10b981"]; // Rose, Cyan, Emerald
    const dashboardColor = "#0f172a"; // Slate-900 like

    const [currentColor, setCurrentColor] = useState(storyColors[0]);

    useEffect(() => {
        if (mode === 'dashboard') {
            // Keep the emerald or switch to a neutral dashboard color?
            // Actually, staying with emerald or a deep teal fits the theme.
            // Let's stick with the last Story color (Emerald) but maybe darker?
            // Or keep it dynamic. Let's stick to Emerald for now.
            setCurrentColor("#0d9488"); // Teal-600
        } else {
            setCurrentColor(storyColors[slideIndex] || storyColors[0]);
        }
    }, [mode, slideIndex]);

    return (
        <div className="fixed inset-0 z-[-1] bg-slate-950">
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <ParticleCloud color={currentColor} speed={mode === 'dashboard' ? 0.5 : 1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <CameraController mode={mode} />
            </Canvas>

            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}

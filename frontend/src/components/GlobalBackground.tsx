import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';
// @ts-ignore
import { easing } from 'maath';

// Reusing ParticleCloud logic but adapted for global state
function ParticleCloud({ color, speed = 1 }: { color: string; speed?: number }) {
    const ref = useRef<any>(null);
    // @ts-ignore
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
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
        const targetZ = mode === 'dashboard' ? 0.2 : 3.5;
        const targetFov = mode === 'dashboard' ? 85 : 75;

        // Damp Z position for smooth "warp" feel
        // damp3(current, target, smoothTime, delta)
        easing.damp3(state.camera.position, [0, 0, targetZ], 0.4, delta);

        // Damp FOV for "speed" effect
        easing.damp(state.camera, 'fov', targetFov, 0.4, delta);
        state.camera.updateProjectionMatrix();
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

    const [currentColor, setCurrentColor] = useState(storyColors[0]);

    useEffect(() => {
        if (mode === 'dashboard') {
            setCurrentColor("#0d9488"); // Teal-600
        } else {
            setCurrentColor(storyColors[slideIndex] || storyColors[0]);
        }
    }, [mode, slideIndex]);

    return (
        <div className="fixed inset-0 z-[-1] bg-slate-950">
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <ParticleCloud color={currentColor} speed={mode === 'dashboard' ? 0.5 : 1} />
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={mode === 'dashboard' ? 2 : 1}
                />
                <CameraController mode={mode} />
            </Canvas>

            {/* Noise Overlay */}
            <div className="absolute inset-0 z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>
    );
}

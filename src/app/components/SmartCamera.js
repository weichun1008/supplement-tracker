'use client';

import { useEffect, useRef, useState } from 'react';

export default function SmartCamera({ onCapture, onClose }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
                videoRef.current.srcObject = s;
                setStream(s);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("無法開啟相機，請確認權限設定");
            }
        }
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);

        // Stop stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Foot Shape Overlay (Dotted Lines) */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '280px', height: '450px',
                    border: '3px dashed rgba(168, 255, 120, 0.6)',
                    borderRadius: '50% 50% 40% 40% / 60% 60% 40% 40%',
                    pointerEvents: 'none',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ color: '#a8ff78', fontSize: '0.9rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
                        請將腳對準虛線框
                    </div>
                </div>

                <div style={{
                    position: 'absolute', bottom: '2rem', left: 0, width: '100%',
                    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                    padding: '0 2rem'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
                            width: '50px', height: '50px', borderRadius: '50%', fontSize: '1.5rem'
                        }}
                    >
                        ✕
                    </button>

                    <button
                        onClick={captureImage}
                        style={{
                            width: '70px', height: '70px', borderRadius: '50%',
                            background: '#a8ff78', border: '5px solid #fff',
                            boxShadow: '0 0 20px rgba(168, 255, 120, 0.5)'
                        }}
                    />

                    <div style={{ width: '50px' }} /> {/* Spacer */}
                </div>
            </div>

            {error && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,0,0,0.8)', color: '#fff', padding: '1rem', borderRadius: '8px'
                }}>
                    {error}
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}

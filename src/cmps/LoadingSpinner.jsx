import { useState, useEffect } from 'react';
import '../assets/styles/cmps/LoadingSpinner.css';

export function LoadingSpinner({ message = 'Uploading...' }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return prev;
                const increment = Math.random() * 15;
                return Math.min(prev + increment, 95);
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-spinner-overlay">
            <div className="loading-spinner-content">
                <div className="spinner-circle">
                    <svg className="spinner-svg" viewBox="0 0 100 100">
                        <circle
                            className="spinner-bg"
                            cx="50"
                            cy="50"
                            r="45"
                        />
                        <circle
                            className="spinner-progress"
                            cx="50"
                            cy="50"
                            r="45"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 45}`,
                                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
                            }}
                        />
                    </svg>
                    <div className="spinner-percentage">
                        {Math.round(progress)}%
                    </div>
                </div>
                <p className="spinner-message">{message}</p>
            </div>
        </div>
    );
}

import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';

const FeatureCard = ({ icon, title, description }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const mouseX = (x / width) * 2 - 1;
            const mouseY = (y / height) * 2 - 1;
            
            card.style.setProperty('--mouse-x', `${mouseX}`);
            card.style.setProperty('--mouse-y', `${mouseY}`);
            card.style.transform = `perspective(1000px) rotateY(${mouseX * 8}deg) rotateX(${-mouseY * 8}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div ref={cardRef} className="transform-style-3d transition-transform duration-300 ease-out h-full">
            <Card className="h-full group hover:shadow-hovery">
                <CardHeader className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full border border-blue-200/80">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-600">{description}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeatureCard;
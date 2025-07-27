import React from 'react';
import { Building, Users, UploadCloud, Bot, Send } from 'lucide-react';
import {FeatureCard} from '..';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Building className="w-6 h-6 text-blue-500" />,
            title: "Create Organization",
            description: "Set up your team's workspace in seconds to manage campaigns and members.",
        },
        {
            icon: <Users className="w-6 h-6 text-blue-500" />,
            title: "Manage Recipients",
            description: "Easily select, add, and manage your email recipients in one centralized place.",
        },
        {
            icon: <UploadCloud className="w-6 h-6 text-blue-500" />,
            title: "Upload & Extract",
            description: "Automatically extract emails from TXT, DOCX, XLSX, and CSV files.",
        },
        {
            icon: <Bot className="w-6 h-6 text-blue-500" />,
            title: "AI-Powered Composition",
            description: "Use our advanced AI to generate compelling email subjects and body content.",
        },
        {
            icon: <Send className="w-6 h-6 text-blue-500" />,
            title: "Direct & Secure Send",
            description: "Send emails directly via your Gmail account for privacy and deliverability.",
        },
    ];

    return (
        <section id="features" className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">A Powerful, All-in-One Toolkit</h2>
                    <p className="text-lg text-slate-600">
                        From setup to sending, MailSync provides everything you need to streamline your email outreach.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.34rem)]">
                             <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
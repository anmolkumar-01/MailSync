import React from 'react';
import { Building, UserPlus, Bot, Send } from 'lucide-react';
import {FeatureCard} from '..';
import {GoogleIcon} from '..';

const HowItWorksSection = () => {
    const steps = [
        {   iconCol: "blue",
            icon: <GoogleIcon className="w-6 h-6" />,
            title: "Sign-in with Google",
            description: "Connect your account securely with a single click to get started.",
        },
        {   
            iconCol: "yellow",
            icon: <Building className="w-6 h-6 text-yellow-500" />,
            title: "Create Organization",
            description: "Set up a dedicated workspace for your team and projects.",
        },
        {
            iconCol: "orange",
            icon: <UserPlus className="w-6 h-6 text-orange-500" />,
            title: "Invite Members",
            description: "Add team members to collaborate on your email campaigns.",
        },
        {
            iconCol: "red",
            icon: <Bot className="w-6 h-6 text-red-500" />,
            title: "Generate with AI",
            description: "Use AI to generate personalized and effective email content.",
        },
        {
            iconCol: "green",
            icon: <Send className="w-6 h-6 text-green-500" />,
            title: "Send Emails",
            description: "Dispatch campaigns through your own Gmail for maximum trust.",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
                    <p className="text-lg text-slate-600">
                        A simple, visual guide to launching your first campaign in 5 steps.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                    {steps.map((step, i) => (
                        <div key={i} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.34rem)]">
                            <FeatureCard {...step} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
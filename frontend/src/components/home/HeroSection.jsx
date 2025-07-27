import React from 'react';
import {Button} from '../ui/button';
import {GoogleIcon} from '..';
import {AnimatedGradientText} from '..';
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BackgroundBeams } from '../aceternity';

const HeroSection = () => (
    <section className="relative pt-50 pb-20 md:pt-62 md:pb-42 text-center overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* ---------- Heading ----------- */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        Bulk Email Automation with <br/>
                        <SparklesText>
                            <AnimatedGradientText>
                                Gmail & AI
                            </AnimatedGradientText>
                        </SparklesText>

                    </h1>
                    
                    {/* ---------- text ----------- */}
                    <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10">
                        Send AI-powered personalized emails directly from your official Gmail address.
                    </p>
                    
                </div>
            </div>
            <BackgroundBeams />
    </section>
);

export default HeroSection;

import React from 'react';
import { Navbar, HeroSection, FeaturesSection, HowItWorksSection, Footer, HomePageSkeleton } from '../components';
import { useAppStore } from '@/store/useAppStore';


export default function HomePage() {

    const {isSigningIn} = useAppStore()

    if(isSigningIn) return <HomePageSkeleton />

    return (

        <div className="bg-white text-slate-800 font-sans antialiased h-screen overflow-y-scroll no-scrollbar">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
}
import React from 'react';
import { Navbar, HeroSection, FeaturesSection, HowItWorksSection, Footer } from '../components';

// The main App component now assembles the page from imported sections.
// All styling is handled by /src/index.css and Tailwind classes.
export default function HomePage() {
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
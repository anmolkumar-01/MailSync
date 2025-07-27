import React from 'react';
import { Header, HeroSection, FeaturesSection, HowItWorksSection, Footer } from '../components';

// The main App component now assembles the page from imported sections.
// All styling is handled by /src/index.css and Tailwind classes.
export function HomePage() {
    return (
        <div className="bg-white text-slate-800 font-sans antialiased">
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
}
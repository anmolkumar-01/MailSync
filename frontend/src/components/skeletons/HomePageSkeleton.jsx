import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const HomePageSkeleton = () => {
    return (
        <div className="min-h-screen w-full bg-white flex flex-col">
        {/* --- Header Skeleton (Mimics Navbar) --- */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between pb-3 pt-4 pl-8 pr-15 bg-white/80 backdrop-blur-md border-b border-slate-200">
            
            {/* Logo Skeleton */}
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-6 w-24 hidden sm:block" />
            </div>

            {/* Right Side: Links + Auth Skeleton */}
            <div className="flex items-center gap-6">
                {/* Navigation Links Skeleton */}
                <div className="hidden items-center gap-4 md:flex">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-30" />
                    <Skeleton className="h-8 w-28" />
                </div>

                {/* Avatar Skeleton */}
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </header>

        {/* --- Hero Content Skeleton (Mimics HeroSection) --- */}
        <main className=" flex flex-1 flex-col items-center text-center p-0 p-67">
            <div className="flex flex-col items-center gap-4">
            
            {/* "Bulk Email Automation with" Skeleton */}
            <Skeleton className="h-12 w-[clamp(300px,80vw,800px)]" />

            {/* "Gmail & AI" Skeleton */}
            <Skeleton className="h-12 w-[clamp(250px,60vw,300px)]" />

            {/* Sub-headline Skeleton */}
            <Skeleton className="h-6 w-[clamp(300px,70vw,620px)] mt-4" />

            </div>
        </main>
        </div>
    );
};

export default HomePageSkeleton;
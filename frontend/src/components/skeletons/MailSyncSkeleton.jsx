import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// The final, dimensionally-accurate skeleton component based on the provided layout code.
export default function MailSyncSkeleton() {
  return (
    <div className="h-screen lg:overflow-hidden bg-secondary flex flex-col pb-0 gapb-0">
        
      {/* 1. Header Skeleton */}
      <header className="bg-white border-b top-0">
        <div className="flex items-center justify-between h-17 px-4 sm:p-6 lg:p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* 2. Main Content Grid  */}
      <main className="p-4 sm:p-6 lg:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 space-y-8 lg:space-y-0">
          
          {/* 3. Left Column Skeletons */}
          <div className="flex flex-col gap-4">
            
            {/* -----------------Upload File Card Skeleton (Exact Dimensions) */}
            <Card className="shadow-md border-blue-100">
              <CardHeader>
                <div className="flex items-center gap-3 text-xl">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>
              <CardContent>

              
                <Skeleton className="h-36 w-full rounded-lg" />
              </CardContent>
            </Card>

            {/* -------------Select Recipients Card Skeleton  */}
            <Card className="shadow-md border-blue-100">
              <CardHeader>
                <div className="flex items-center gap-3 text-xl">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-64.5 w-full rounded-lg" />

              </CardContent>
            </Card>
          </div>

          {/* 4. Right Column Skeleton (Stretches to match left column height) */}
          <div className="w-full ">
            <Card className="pb-0 h-full flex flex-col shadow-md border-blue-100">
              
              <CardHeader>
                <div className="flex items-center gap-3 text-xl">
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <Skeleton className="h-6 w-44" />
                </div>
                <Skeleton className="h-4 w-3/4 mt-1" />
              </CardHeader>

              <CardContent className="flex-grow flex flex-col gap-4">
                <Skeleton className="h-8 w-[165px] rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                
                {/* body and text editor */}
                <div className="space-y-1 flex-grow flex flex-col">
                  <Skeleton className="h-5 w-12 mb-1" />

                  {/* text editor */}
                  <Skeleton className="w-full h-78.5 rounded-md" />
                </div>
                
              </CardContent>

                <div className="flex justify-between items-center border-t py-3 px-6">
                    <Skeleton className="h-4 w-10 rounded-md " />
                    <Skeleton className="h-9 w-44 rounded-md" />
                </div>
              
            </Card>
          </div>
          
        </div>
      </main>
    </div>
  );
}
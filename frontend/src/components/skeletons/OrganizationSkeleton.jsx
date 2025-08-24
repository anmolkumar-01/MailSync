import { Skeleton } from "@/components/ui/skeleton";

const OrganizationSkeleton = () => {
    return (
        <div className="h-full flex flex-col ">
        {/* ------------- Organization Card (tabs) ---------------- */}
        <div className="flex-1 flex flex-col min-h-0">
            {/* The TabsList is like the "Stat Cards" section - it has a fixed height. */}
            <div className="grid grid-cols-2 flex-shrink-0">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            </div>

            {/* --- Tab 1 Content --- */}
            <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-white shadow-sm border flex-1 flex flex-col">
                <div className="flex-shrink-0 p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <Skeleton className="h-5 w-72" />
                    </div>
                    <Skeleton className="h-9 w-24" />
                </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 px-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {/* Skeleton for OrgsTabs items */}
                    {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="mt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                        <div className="flex items-center justify-end mt-4">
                        <Skeleton className="h-8 w-20" />
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default OrganizationSkeleton;
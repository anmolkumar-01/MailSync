import { Skeleton } from "../ui/skeleton";
import { Card, CardHeader, CardContent } from "../ui/card";

const ExtractingEmailsSkeleton = () => {
    return (
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
    );
};

export default ExtractingEmailsSkeleton;
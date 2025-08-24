import { Skeleton } from "@/components/ui/skeleton";
import {
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";

const OrgMembersSkeleton = () => {
    return (
        <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                    {/* === Member Cell Skeleton === */}
                    <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32 mt-2 hidden sm:block" />
                            </div>
                        </div>
                    </TableCell>

                    {/* === Role Cell Skeleton === */}
                    <TableCell>
                        <Skeleton className="h-7 w-28 rounded-full" />
                    </TableCell>

                    {/* === Status Cell Skeleton === */}
                    <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>

                    {/* === Member Since Cell Skeleton === */}
                    <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-24" />
                    </TableCell>

                    {/* === Last Activity Cell Skeleton === */}
                    <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-4 w-32" />
                    </TableCell>

                    {/* === Actions Cell Skeleton === */}
                    <TableCell>
                        <Skeleton className="h-8 w-8" />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default OrgMembersSkeleton;
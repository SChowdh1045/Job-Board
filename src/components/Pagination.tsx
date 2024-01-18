import { JobFilterType } from "@/lib/validations";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";


type PaginationProps = {
    currentPage: number;
    totalPages: number;
    filterValues: JobFilterType;
}
  
export default function Pagination({
    currentPage,
    totalPages,
    filterValues: { q, type, location, remote },
  }: PaginationProps) {
    
    function generatePageLink(page: number) {
        const searchParams = new URLSearchParams({
            ...(q && { q }),
            ...(type && { type }),
            ...(location && { location }),
            ...(remote && { remote: "true" }),
            page: page.toString(),
        });
  
        return `/?${searchParams.toString()}`;
    }
  
    return (
        <div className="flex justify-between">
            <Link
            href={generatePageLink(currentPage - 1)}
            className={cn(
                "flex items-center gap-2 font-semibold",
                currentPage <= 1 && "invisible",
            )}
            >
                <ArrowLeft size={16} />
                Previous page
            </Link>
        
            <span className="font-semibold">
                Page {currentPage} of {totalPages}
            </span>
            
            <Link
            href={generatePageLink(currentPage + 1)}
            className={cn(
                "flex items-center gap-2 font-semibold",
                currentPage >= totalPages && "invisible",
            )}
            >
                Next page
                <ArrowRight size={16} />
            </Link>
      </div>
    );
  }
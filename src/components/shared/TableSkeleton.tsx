import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showActions?: boolean;
}

export function TableSkeleton({columns = 6, rows = 10, showActions = true}: TableSkeletonProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(columns)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-full" />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-[70px]">
                <Skeleton className="h-4 w-full" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {[...Array(rows)].map((_, idx) => (
            <TableRow key={idx}>
              {[...Array(columns)].map((_, i) => (
                <TableCell key={i}>
                  <div className="flex items-center gap-2">
                    {i === 0 && <Skeleton className="h-10 w-10 rounded-full"></Skeleton>}
                    <Skeleton className="h-4 w-full"></Skeleton>
                  </div>
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

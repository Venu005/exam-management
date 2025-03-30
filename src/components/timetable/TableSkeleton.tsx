import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableSkeleton() {
  return (
    <Table className="min-w-full">
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 min-w-[200px]">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 w-24">
            <div className="h-5 bg-gray-200 rounded w-12 animate-pulse" />
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 w-32">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 w-40">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 w-40">
            <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
          </TableHead>
          <TableHead className="px-6 py-4 font-semibold text-gray-700 text-right w-24">
            <div className="h-5 bg-gray-200 rounded w-8 animate-pulse ml-auto" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i} className="hover:bg-transparent even:bg-gray-50">
            <TableCell className="px-6 py-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="h-5 bg-gray-200 rounded w-12 animate-pulse" />
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse uppercase" />
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            </TableCell>
            <TableCell className="px-6 py-4">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              <div className="h-6 bg-gray-200 rounded-full w-8 animate-pulse inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

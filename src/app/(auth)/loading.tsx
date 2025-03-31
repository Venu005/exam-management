import { Loader2 } from "lucide-react";

export default function loading() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Loader2 className="animate-spin h-10 w-10 text-gray-500 dark:text-gray-400" />
    </div>
  );
}

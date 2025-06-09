import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="space-y-6">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <Search className="h-12 w-12 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404 - Not Found</h1>
          <p className="text-xl text-muted-foreground">
            The page or task you're looking for doesn&apos;t exist.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            The task might have been deleted, or you may have followed an
            invalid link.
          </p>

          <Link href="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFound;

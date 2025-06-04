import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>to do manager</h1>
      <Button>
        <Link href={"/todo"}>show todos</Link>
      </Button>
    </>
  );
}

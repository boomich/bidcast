"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Home } from "lucide-react";

export default function CreatePostNav() {
  return (
    <nav className="fixed top-4 right-4 z-50 flex gap-2">
      <Link href="/">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
      <Link href="/posts/demo">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          🎯 Demo
        </Button>
      </Link>
      <Link href="/posts/create">
        <Button size="sm" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Button>
      </Link>
    </nav>
  );
}
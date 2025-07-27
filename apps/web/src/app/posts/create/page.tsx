"use client";

import CreatePostForm from "@/components/create-post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePostNav from "@/components/create-post-nav";

export default function CreatePostPage() {
  return (
    <div className="min-h-screen bg-background">
      <CreatePostNav />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreatePostForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
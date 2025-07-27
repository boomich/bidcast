"use client";

import { useState } from "react";
import CreatePostForm from "@/components/create-post-form";
import RichTextEditor from "@/components/rich-text-editor";
import FileUpload from "@/components/file-upload";
import TagInput from "@/components/tag-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreatePostNav from "@/components/create-post-nav";

export default function DemoPage() {
  const [editorContent, setEditorContent] = useState(`
    <h1>Welcome to the Rich Text Editor Demo</h1>
    <p>This editor supports <strong>bold</strong>, <em>italic</em>, and <strike>strikethrough</strike> text.</p>
    <h2>Features Include:</h2>
    <ul>
      <li>Multiple heading levels</li>
      <li>Bullet and numbered lists</li>
      <li>Blockquotes for emphasis</li>
      <li>Links and images</li>
      <li>Code formatting</li>
    </ul>
    <blockquote>
      This is a blockquote example showing how quoted text appears in the editor.
    </blockquote>
    <p>You can also add <code>inline code</code> and create links like <a href="https://example.com">this example link</a>.</p>
  `);
  
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>(["demo", "rich-text", "editor"]);

  return (
    <div className="min-h-screen bg-background">
      <CreatePostNav />
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Post Creation Demo</h1>
          <p className="text-gray-600">
            Explore the rich text editing, file upload, and tagging features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rich Text Editor Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Rich Text Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={editorContent}
                onChange={setEditorContent}
              />
              <div className="mt-4 text-sm text-gray-500">
                Try the toolbar buttons to format text, add links, or insert images!
              </div>
            </CardContent>
          </Card>

          {/* File Upload Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📁 File Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                files={files}
                onChange={setFiles}
                maxFiles={5}
                maxSizeBytes={5 * 1024 * 1024} // 5MB
              />
              <div className="mt-4 text-sm text-gray-500">
                Drag & drop files or click to browse. Supports images, documents, and more!
              </div>
            </CardContent>
          </Card>

          {/* Tag Input Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏷️ Tag Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TagInput
                tags={tags}
                onChange={setTags}
                maxTags={8}
                placeholder="Add demo tags..."
              />
              <div className="mt-4 text-sm text-gray-500">
                Type to add tags, use suggestions, or click popular tags below!
              </div>
            </CardContent>
          </Card>

          {/* Full Form Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ✨ Complete Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-4">
                The complete post creation form combines all features:
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• Title input with validation</li>
                <li>• Rich text content editor</li>
                <li>• File upload with preview</li>
                <li>• Tag management system</li>
                <li>• Preview mode toggle</li>
                <li>• Draft saving functionality</li>
                <li>• Form validation & submission</li>
              </ul>
              <a 
                href="/posts/create"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Try Full Form →
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📋 Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: editorContent }} />
            </div>
            {tags.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <strong className="text-sm text-gray-700">Tags: </strong>
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {files.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <strong className="text-sm text-gray-700">
                  Attached Files: {files.length}
                </strong>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
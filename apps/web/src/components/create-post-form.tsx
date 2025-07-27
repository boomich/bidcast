"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "./rich-text-editor";
import FileUpload from "./file-upload";
import TagInput from "./tag-input";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Eye, X } from "lucide-react";

interface PostData {
  title: string;
  content: string;
  tags: string[];
  attachments: File[];
}

export default function CreatePostForm() {
  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    tags: [],
    attachments: [],
  });
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = useCallback((title: string) => {
    setPostData(prev => ({ ...prev, title }));
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setPostData(prev => ({ ...prev, content }));
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setPostData(prev => ({ ...prev, tags }));
  }, []);

  const handleFilesChange = useCallback((files: File[]) => {
    setPostData(prev => ({ ...prev, attachments: files }));
  }, []);

  const handleSubmit = async () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting post:", postData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Post created successfully!");
      
      // Reset form
      setPostData({
        title: "",
        content: "",
        tags: [],
        attachments: [],
      });
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    console.log("Saving draft:", postData);
    alert("Draft saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Post Title
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Enter your post title..."
          value={postData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-lg"
          disabled={isSubmitting}
        />
      </div>

      {/* Content Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Content
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {isPreview ? "Edit" : "Preview"}
          </Button>
        </div>
        
        {isPreview ? (
          <Card>
            <CardContent className="p-4">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            </CardContent>
          </Card>
        ) : (
          <RichTextEditor
            content={postData.content}
            onChange={handleContentChange}
            disabled={isSubmitting}
          />
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Attachments
        </label>
        <FileUpload
          files={postData.attachments}
          onChange={handleFilesChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tags
        </label>
        <TagInput
          tags={postData.tags}
          onChange={handleTagsChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !postData.title.trim() || !postData.content.trim()}
          className="flex items-center gap-2 flex-1"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          Save Draft
        </Button>
      </div>

      {/* Post Summary */}
      {(postData.title || postData.content || postData.tags.length > 0) && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Post Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Title: {postData.title || "No title"}</p>
              <p>Content: {postData.content.replace(/<[^>]*>/g, '').length} characters</p>
              <p>Tags: {postData.tags.length} tags</p>
              <p>Attachments: {postData.attachments.length} files</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
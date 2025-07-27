"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  X, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video,
  Archive,
  HardDrive
} from "lucide-react";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedFileTypes?: string[];
}

export default function FileUpload({ 
  files, 
  onChange, 
  disabled = false,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = [
    'image/*',
    'video/*',
    'audio/*',
    'application/pdf',
    'text/*',
    '.doc,.docx,.ppt,.pptx,.xls,.xlsx'
  ]
}: FileUploadProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
    onChange(newFiles);
  }, [files, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    maxFiles: maxFiles - files.length,
    maxSize: maxSizeBytes,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.includes('pdf') || type.startsWith('text/')) return <FileText className="h-4 w-4" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getFileTypeColor = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (type.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    if (type.startsWith('audio/')) return 'bg-blue-100 text-blue-800';
    if (type.includes('pdf')) return 'bg-red-100 text-red-800';
    if (type.startsWith('text/')) return 'bg-gray-100 text-gray-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors duration-200 ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <CardContent className="p-6">
          <div 
            {...getRootProps()} 
            className="text-center"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-400">
                  Max {maxFiles} files, up to {formatFileSize(maxSizeBytes)} each
                </p>
                <p className="text-xs text-gray-400">
                  Supports: Images, Videos, Audio, PDFs, Documents
                </p>
              </div>
            )}
            
            {!disabled && (
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={(e) => e.stopPropagation()}
              >
                Browse Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                Uploaded Files ({files.length}/{maxFiles})
              </h3>
              {files.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Total: {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`p-2 rounded ${getFileTypeColor(file)}`}>
                      {getFileIcon(file)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Status */}
      {files.length >= maxFiles && (
        <div className="text-center py-2">
          <Badge variant="secondary" className="text-xs">
            Maximum number of files reached
          </Badge>
        </div>
      )}
    </div>
  );
}
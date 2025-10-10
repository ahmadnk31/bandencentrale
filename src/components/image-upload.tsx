"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Eye,
  RotateCcw
} from 'lucide-react';
import { uploadToS3, uploadMultipleToS3, validateImageFile, UploadResult } from '@/lib/aws-s3';
import Image from 'next/image';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadResult?: UploadResult;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  existingImages?: string[];
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  existingImages = [],
  maxFiles = 10,
  className = "",
  disabled = false
}) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    // Validate files
    const validFiles = acceptedFiles.filter(file => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        console.error(`Invalid file ${file.name}: ${validation.error}`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create image objects with previews
    const newImages: UploadedImage[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      isUploading: true,
      uploadProgress: 0,
    }));

    setImages(prev => [...prev, ...newImages]);
    setIsUploading(true);

    try {
      // Upload files to S3
      const uploadResults = await uploadMultipleToS3(validFiles);
      
      setImages(prev => 
        prev.map((img, index) => {
          const resultIndex = prev.length - newImages.length + index;
          if (resultIndex >= 0 && resultIndex < uploadResults.length) {
            return {
              ...img,
              isUploading: false,
              uploadResult: uploadResults[resultIndex],
              error: uploadResults[resultIndex].success ? undefined : uploadResults[resultIndex].error,
            };
          }
          return img;
        })
      );

      // Update parent component
      const updatedImages = [...images, ...newImages.map((img, index) => ({
        ...img,
        isUploading: false,
        uploadResult: uploadResults[index],
      }))];
      onImagesChange(updatedImages);

    } catch (error) {
      console.error('Upload error:', error);
      setImages(prev => 
        prev.map(img => ({
          ...img,
          isUploading: false,
          error: 'Upload failed',
        }))
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [images, onImagesChange, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - images.length,
    disabled: disabled || isUploading,
  });

  const removeImage = (id: string) => {
    setImages(prev => {
      const updatedImages = prev.filter(img => img.id !== id);
      onImagesChange(updatedImages);
      return updatedImages;
    });
  };

  const retryUpload = async (id: string) => {
    const imageToRetry = images.find(img => img.id === id);
    if (!imageToRetry) return;

    setImages(prev => 
      prev.map(img => 
        img.id === id 
          ? { ...img, isUploading: true, error: undefined }
          : img
      )
    );

    try {
      const uploadResult = await uploadToS3({ file: imageToRetry.file });
      setImages(prev => 
        prev.map(img => 
          img.id === id 
            ? { 
                ...img, 
                isUploading: false, 
                uploadResult,
                error: uploadResult.success ? undefined : uploadResult.error 
              }
            : img
        )
      );
    } catch (error) {
      setImages(prev => 
        prev.map(img => 
          img.id === id 
            ? { ...img, isUploading: false, error: 'Upload failed' }
            : img
        )
      );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        {...getRootProps()} 
        className={`
          border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive 
            ? 'border-tire-orange bg-orange-50' 
            : 'border-gray-300 hover:border-tire-orange hover:bg-gray-50'
          }
          ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          <motion.div
            animate={{
              scale: isDragActive ? 1.05 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              isDragActive ? 'text-tire-orange' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop images here' : 'Upload Product Images'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag & drop images here, or click to select files
            </p>
            <div className="text-sm text-gray-500">
              <p>Supports: JPEG, PNG, WebP (max 10MB each)</p>
              <p>Maximum {maxFiles} images</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-tire-orange animate-pulse" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Uploading images...</p>
                <Progress value={uploadProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Images from Props */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <Image
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-black/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full mt-2 text-xs">
                    Existing
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            New Images ({images.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="relative group">
                    <CardContent className="p-2">
                      <div className="aspect-square relative overflow-hidden rounded-lg">
                        <Image
                          src={image.preview}
                          alt={image.file.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Upload Status Overlay */}
                        {image.isUploading && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                              <p className="text-xs">Uploading...</p>
                            </div>
                          </div>
                        )}

                        {/* Success Indicator */}
                        {image.uploadResult?.success && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                          </div>
                        )}

                        {/* Error Indicator */}
                        {image.error && (
                          <div className="absolute top-2 right-2">
                            <AlertCircle className="w-5 h-5 text-red-500 bg-white rounded-full" />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(image.id)}
                              className="w-8 h-8 p-0 bg-red-500 text-white hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                            {image.error && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => retryUpload(image.id)}
                                className="w-8 h-8 p-0 bg-blue-500 text-white hover:bg-blue-600"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 truncate">{image.file.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">
                            {(image.file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                          {image.uploadResult?.success ? (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Uploaded
                            </Badge>
                          ) : image.error ? (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                              Failed
                            </Badge>
                          ) : image.isUploading ? (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Uploading
                            </Badge>
                          ) : null}
                        </div>
                        {image.error && (
                          <p className="text-xs text-red-600 mt-1">{image.error}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

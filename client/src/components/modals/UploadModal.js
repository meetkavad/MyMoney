"use client";

import {
  X,
  Upload,
  FileText,
  Receipt,
  Image,
  File,
  CheckCircle,
  AlertCircle,
  FolderOpen,
} from "lucide-react";
import { useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { formatFileSize } from "@/lib/utils";
import { useHover } from "@/hooks/useHover";
import Card from "@/components/ui/Card";

export default function UploadModal({
  isOpen,
  onClose,
  uploadType = "receipt",
  onUpload,
}) {
  const { isDarkMode, colors } = useTheme();
  const currentColors = isDarkMode ? colors.dark : colors.light;
  const { createHoverHandlers, createOpacityHoverHandlers } =
    useHover(currentColors);
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  if (!isOpen) return null;

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const acceptedFileTypes = "image/*,.pdf";

  const getModalTitle = () => {
    return uploadType === "receipt"
      ? "Upload Receipt"
      : "Upload Transaction History";
  };

  const getModalDescription = () => {
    return uploadType === "receipt"
      ? "Upload image or PDF file of your receipt"
      : "Upload image or PDF file of your transaction history";
  };

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return { valid: false, error: "File size must be less than 10MB" };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not supported" };
    }

    return { valid: true };
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-5 w-5" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);

    // Only take the first file for single file upload
    const file = fileArray[0];
    if (!file) return;

    const validation = validateFile(file);
    if (validation.valid) {
      const fileObj = {
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
      };

      // Replace any existing file with the new one
      setUploadedFiles([fileObj]);
    } else {
      alert(`File could not be added: ${validation.error}`);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      // Clean up preview URLs
      const removedFile = prev.find((f) => f.id === fileId);
      if (removedFile && removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      if (!onUpload) {
        throw new Error("No upload handler provided");
      }

      // Use the provided onUpload callback
      for (const fileObj of uploadedFiles) {
        await onUpload(fileObj.file, uploadType);
      }

      setUploadStatus("success");

      // Clear files after successful upload
      setTimeout(() => {
        setUploadedFiles([]);
        setUploadStatus(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URLs
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
    setUploadStatus(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card
        className="w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col"
        style={{ backgroundColor: currentColors.cardBackground }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 pb-4 border-b"
          style={{ borderBottomColor: currentColors.border }}
        >
          <div className="flex items-center space-x-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: currentColors.primaryLight }}
            >
              {uploadType === "receipt" ? (
                <Receipt
                  className="h-6 w-6"
                  style={{ color: currentColors.primary }}
                />
              ) : (
                <FileText
                  className="h-6 w-6"
                  style={{ color: currentColors.primary }}
                />
              )}
            </div>
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: currentColors.text }}
              >
                {getModalTitle()}
              </h2>
              <p
                className="text-sm"
                style={{ color: currentColors.textSecondary }}
              >
                {getModalDescription()}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: currentColors.textSecondary }}
            {...createHoverHandlers()}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-opacity-100" : "border-opacity-50"
            }`}
            style={{
              borderColor: dragActive
                ? currentColors.primary
                : currentColors.border,
              backgroundColor: dragActive
                ? currentColors.primaryLight
                : currentColors.hover,
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div
                className="p-4 rounded-full"
                style={{ backgroundColor: currentColors.primary, opacity: 0.1 }}
              >
                <Upload
                  className="h-8 w-8"
                  style={{ color: currentColors.primary }}
                />
              </div>

              <div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: currentColors.text }}
                >
                  Drag and drop a file here
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: currentColors.textSecondary }}
                >
                  or click to browse file
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: currentColors.primary,
                      color: "white",
                    }}
                    {...createOpacityHoverHandlers()}
                  >
                    <FolderOpen className="h-4 w-4" />
                    <span>Browse File</span>
                  </button>
                </div>
              </div>

              <div
                className="text-xs"
                style={{ color: currentColors.textTertiary }}
              >
                Supported formats: JPG, PNG, PDF • Max size: 10MB
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4
                className="text-sm font-medium mb-3"
                style={{ color: currentColors.text }}
              >
                File to Upload
              </h4>

              <div className="space-y-2">
                {uploadedFiles.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{
                      backgroundColor: currentColors.background,
                      borderColor: currentColors.border,
                    }}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div style={{ color: currentColors.primary }}>
                        {getFileIcon(fileItem.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: currentColors.text }}
                        >
                          {fileItem.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: currentColors.textSecondary }}
                        >
                          {formatFileSize(fileItem.size)}
                        </p>
                      </div>

                      {fileItem.preview && (
                        <img
                          src={fileItem.preview}
                          alt="Preview"
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </div>

                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="p-1 rounded transition-colors ml-2"
                      style={{ color: currentColors.textSecondary }}
                      {...createHoverHandlers()}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus && (
            <div
              className="mt-4 p-4 rounded-lg flex items-center space-x-3"
              style={{
                backgroundColor:
                  uploadStatus === "success"
                    ? currentColors.incomeLight
                    : currentColors.expenseLight,
              }}
            >
              {uploadStatus === "success" ? (
                <CheckCircle
                  className="h-5 w-5"
                  style={{ color: currentColors.income }}
                />
              ) : (
                <AlertCircle
                  className="h-5 w-5"
                  style={{ color: currentColors.expense }}
                />
              )}
              <span
                className="text-sm font-medium"
                style={{
                  color:
                    uploadStatus === "success"
                      ? currentColors.income
                      : currentColors.expense,
                }}
              >
                {uploadStatus === "success"
                  ? "File uploaded successfully!"
                  : "Upload failed. Please try again."}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-between items-center p-6 pt-0 border-t"
          style={{ borderTopColor: currentColors.border }}
        >
          <div
            className="text-sm"
            style={{ color: currentColors.textSecondary }}
          >
            {uploadedFiles.length} file selected
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: currentColors.hover,
                color: currentColors.text,
              }}
              disabled={uploading}
            >
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 || uploading}
              className="px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              style={{
                backgroundColor:
                  uploadedFiles.length === 0 || uploading
                    ? currentColors.border
                    : currentColors.primary,
                color:
                  uploadedFiles.length === 0 || uploading
                    ? currentColors.textSecondary
                    : "white",
                cursor:
                  uploadedFiles.length === 0 || uploading
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

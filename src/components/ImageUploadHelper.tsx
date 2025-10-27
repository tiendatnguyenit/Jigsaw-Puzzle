import React, { useState } from "react";
import { Upload, Image as ImageIcon, Check } from "lucide-react";
import "./ImageUploadHelper.css";

interface ImageUploadHelperProps {
  onImagesUploaded: (images: { [key: string]: string }) => void;
}

export const ImageUploadHelper: React.FC<ImageUploadHelperProps> = ({
  onImagesUploaded,
}) => {
  const [uploadedImages, setUploadedImages] = useState<{
    [key: string]: string;
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    level: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImages((prev) => ({
          ...prev,
          [`level${level}`]: result,
        }));
        onImagesUploaded({
          ...uploadedImages,
          [`level${level}`]: result,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
      setIsUploading(false);
    }
  };

  return (
    <div className="image-upload-helper">
      <h3>Upload Your Images</h3>
      <p>Add your own images for each puzzle level:</p>

      <div className="upload-grid">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="upload-item">
            <div className="upload-preview">
              {uploadedImages[`level${level}`] ? (
                <div className="preview-container">
                  <img
                    src={uploadedImages[`level${level}`]}
                    alt={`Level ${level} preview`}
                    className="preview-image"
                  />
                  <div className="preview-overlay">
                    <Check size={20} />
                    <span>Uploaded</span>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <ImageIcon size={32} />
                  <span>Level {level}</span>
                </div>
              )}
            </div>

            <label className="upload-button">
              <Upload size={16} />
              {uploadedImages[`level${level}`] ? "Change" : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, level)}
                disabled={isUploading}
                style={{ display: "none" }}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="upload-instructions">
        <h4>Instructions:</h4>
        <ul>
          <li>Upload 5 images for your puzzle levels</li>
          <li>Images should be square (300x300px or larger)</li>
          <li>Supported formats: JPG, PNG, WebP</li>
          <li>Max file size: 2MB per image</li>
        </ul>
      </div>
    </div>
  );
};

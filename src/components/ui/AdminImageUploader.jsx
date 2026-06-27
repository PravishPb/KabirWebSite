import React, { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import Icon from './Icon';
import Button from './Button';
import './AdminImageUploader.css';

export default function AdminImageUploader({ value, onChange, storageBucket = 'blog-images', label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef(null);

  // Sync state if value changes externally
  React.useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from(storageBucket)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from(storageBucket)
        .getPublicUrl(filename);

      if (publicUrlData?.publicUrl) {
        onChange(publicUrlData.publicUrl);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload image: ' + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    onChange(val);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setUrlInput('');
    onChange('');
  };

  return (
    <div className="admin-image-uploader">
      <label className="admin-form-label">{label}</label>
      
      <div className="uploader-layout">
        {/* Preview Frame */}
        <div className="uploader-preview-frame">
          {urlInput ? (
            <>
              <img src={urlInput} alt="Preview" className="uploader-preview-img" />
              <button type="button" className="uploader-remove-btn" onClick={removeImage} title="Remove image">
                <Icon name="close" size={16} />
              </button>
            </>
          ) : (
            <div className="uploader-placeholder">
              <Icon name="image" size={32} className="placeholder-icon" />
              <span className="placeholder-text">No image selected</span>
            </div>
          )}
          {uploading && (
            <div className="uploader-loading-overlay">
              <Icon name="sync" size={24} className="uploader-loading-icon" />
              <span>Uploading...</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="uploader-controls">
          <div className="uploader-url-group">
            <input
              type="url"
              className="admin-form-input uploader-url-input"
              placeholder="Paste image URL here..."
              value={urlInput}
              onChange={handleUrlChange}
              disabled={uploading}
            />
          </div>
          
          <div className="uploader-file-group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={triggerFileSelect}
              disabled={uploading}
              className="uploader-upload-btn"
            >
              <Icon name="upload" size={16} />
              <span>Upload from computer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

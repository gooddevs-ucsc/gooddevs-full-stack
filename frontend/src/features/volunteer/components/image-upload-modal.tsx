import { Upload, X } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

interface ImageUploadModalProps {
  type: 'profile-image' | 'cover-image';
  currentImageUrl: string;
  onImageUrlChange: (url: string) => void;
  onFileSelect: (file: File) => void;
  onSave: () => void;
  onCancel: () => void;
  uploading: boolean;
  loading: boolean;
}

export const ImageUploadModal = ({
  type,
  currentImageUrl,
  onImageUrlChange,
  onFileSelect,
  onSave,
  onCancel,
  uploading,
  loading,
}: ImageUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const title =
    type === 'profile-image' ? 'Update Profile Image' : 'Update Cover Image';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 min-w-96 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="size-8 rounded-full p-2"
          >
            <X className="size-3" />
          </Button>
        </div>

        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-slate-900">
              Current Image:
            </p>
            <img
              src={currentImageUrl}
              alt="Current"
              className={`max-h-32 rounded-lg border border-slate-200 object-cover ${
                type === 'profile-image' ? 'max-w-32' : 'max-w-full'
              }`}
            />
          </div>
        )}

        {/* Upload Option */}
        <div className="space-y-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
            className="w-full"
          >
            <Upload className="mr-2 size-4" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or paste URL</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="url"
              value={currentImageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="Paste image URL here"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading || uploading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </>
  );
};

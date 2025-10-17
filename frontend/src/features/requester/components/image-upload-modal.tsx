import {
  Image as ImageIcon,
  LinkIcon,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface ImageUploadModalProps {
  type: 'logo' | 'cover';
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
          <h3 className="text-lg font-semibold text-slate-900">
            Update {type === 'logo' ? 'Logo' : 'Cover Image'}
          </h3>
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
            <p className="mb-2 text-sm font-medium text-slate-700">
              Current {type === 'logo' ? 'Logo' : 'Image'}:
            </p>
            <div className="relative inline-block">
              <img
                src={currentImageUrl}
                alt={`${type} preview`}
                className={
                  type === 'logo'
                    ? 'size-20 rounded-lg border border-slate-200 object-cover'
                    : 'h-24 w-full rounded-lg object-cover'
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onImageUrlChange('')}
                className="absolute -right-2 -top-2 size-6 rounded-full border-2 border-white bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Upload Option */}
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 transition-colors hover:border-slate-400">
            <div className="text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-slate-100">
                {type === 'logo' ? (
                  <ImageIcon className="size-6 text-slate-600" />
                ) : (
                  <Upload className="size-6 text-slate-600" />
                )}
              </div>
              <p className="mb-2 text-sm font-medium text-slate-900">
                Upload a new {type === 'logo' ? 'logo' : 'image'}
              </p>
              <p className="mb-4 text-xs text-slate-500">
                {type === 'logo'
                  ? 'Recommended: Square image, PNG format'
                  : 'PNG, JPG, GIF up to 5MB'}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 size-4" />
                    Choose File
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-slate-500">or</span>
            </div>
          </div>

          {/* URL Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LinkIcon className="size-4 text-slate-500" />
              <label className="text-sm font-medium text-slate-700">
                Enter {type === 'logo' ? 'logo' : 'image'} URL
              </label>
            </div>
            <Input
              value={currentImageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder={`https://example.com/your-${type}.${type === 'logo' ? 'png' : 'jpg'}`}
              className="w-full"
            />
            {currentImageUrl && !currentImageUrl.startsWith('http') && (
              <p className="text-xs text-red-500">
                Please enter a valid URL starting with http:// or https://
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading || uploading}>
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

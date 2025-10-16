import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

import type { GeneratedProjectDetails } from '../api/generate-project-details';
import { useGenerateProjectDetails } from '../api/generate-project-details';

interface GenerateProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (details: GeneratedProjectDetails) => void;
}

export const GenerateProjectDetailsModal = ({
  open,
  onOpenChange,
  onGenerate,
}: GenerateProjectDetailsModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateMutation = useGenerateProjectDetails();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError('Please enter a project description');
      return;
    }

    try {
      const details = await generateMutation.mutateAsync(prompt);
      onGenerate(details);
      setPrompt('');
      onOpenChange(false);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to generate project details. Please try again.';

      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Generate Project Details
              </h3>
              <p className="text-sm text-slate-600">
                Describe your project idea and let AI help you get started
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="prompt"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project Description
            </label>
            <textarea
              id="prompt"
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your project idea in detail. For example: 'A mobile app to track daily expenses with analytics and budget planning features for Android users...'"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={generateMutation.isPending}
            />
            <p className="mt-1 text-xs text-slate-500">
              Be specific about features, target platform, and any special
              requirements
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={generateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={generateMutation.isPending || !prompt.trim()}
              className="flex items-center gap-2"
            >
              {generateMutation.isPending ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate Details
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

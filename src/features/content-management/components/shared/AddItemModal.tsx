import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AddItemModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  submitLabel?: string;
  showDescription?: boolean;
  className?: string;
}

export const AddItemModal = ({
  title,
  description,
  isOpen,
  onClose,
  onSubmit,
  submitLabel = 'Create',
  showDescription = false,
  className
}: AddItemModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn("sm:max-w-[425px]", className)}
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="item-title">Title</Label>
            <Input
              id="item-title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter title"
              autoFocus
            />
          </div>

          {showDescription && (
            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description (optional)"
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 
"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Icon } from '@/components/ui/icons'

interface CreateTopicDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gradeId: string
}

export function CreateTopicDialog({ open, onOpenChange, gradeId }: CreateTopicDialogProps) {
  const [title, setTitle] = useState('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate: createTopic, isLoading } = useMutation({
    mutationFn: async () => {
      // Implementation here
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics', gradeId] })
      toast({
        title: "Success",
        description: "Topic created successfully"
      })
      onOpenChange(false)
      setTitle('')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create topic",
        variant: "destructive"
      })
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon type="phosphor" name="FOLDER_PLUS" className="h-5 w-5" />
            Create New Topic
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault()
          createTopic()
        }}>
          <div className="space-y-4">
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Topic title"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
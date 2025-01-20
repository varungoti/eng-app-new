"use client"

import React, { useState } from 'react'
import { PopoverForm, PopoverFormButton } from '@/components/ui/popover-form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { useContentStore } from '@/lib/content/store'
import { contentService } from '@/lib/content/ContentService'
import { useToast } from '@/hooks/use-toast'

type FormState = 'idle' | 'loading' | 'success'

export function CreateSubtopicForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const { selectedTopic } = useContentStore()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !selectedTopic) return

    try {
      setFormState('loading')
      await contentService.createSubtopic({
        title,
        topicId: selectedTopic
      })
      setFormState('success')
      toast({
        title: 'Success',
        description: 'Subtopic created successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create subtopic',
        variant: 'destructive'
      })
      setFormState('idle')
    }
  }

  return (
    <PopoverForm
      title="Add Subtopic"
      open={open}
      setOpen={setOpen}
      width="364px"
      height="200px"
      showCloseButton={formState !== 'success'}
      showSuccess={formState === 'success'}
      openChild={
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="px-4 pt-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subtopic title"
              required
            />
          </div>
          <div className="relative flex h-12 items-center px-[10px]">
            <Separator />
            <PopoverFormButton
              loading={formState === 'loading'}
              text="Create Subtopic"
            />
          </div>
        </form>
      }
      successChild={
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Subtopic Created!</h3>
          <p className="text-sm text-muted-foreground">
            Your new subtopic has been created successfully.
          </p>
        </div>
      }
    />
  )
} 
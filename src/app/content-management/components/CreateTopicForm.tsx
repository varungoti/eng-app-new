"use client"

import React, { useState } from 'react'
import { PopoverForm, PopoverFormButton } from '@/components/ui/popover-form'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useContentStore } from '@/lib/content/store'
import { contentService } from '@/lib/content/ContentService'
import { useToast } from '@/hooks/use-toast'

type FormState = 'idle' | 'loading' | 'success'

export function CreateTopicForm() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { selectedGrade } = useContentStore()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !selectedGrade) return

    try {
      setFormState('loading')
      await contentService.createTopic({
        title,
        description,
        gradeId: selectedGrade
      })
      setFormState('success')
      toast({
        title: 'Success',
        description: 'Topic created successfully'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create topic',
      })
      setFormState('idle')
    }
  }

  return (
    <PopoverForm
      title="Add Topic"
      open={open}
      setOpen={setOpen}
      width="364px"
      height="300px"
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
              placeholder="Enter topic title"
              required
            />
          </div>
          <div className="px-4">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter topic description"
              rows={3}
            />
          </div>
          <div className="relative flex h-12 items-center px-[10px]">
            <Separator />
            <PopoverFormButton
              loading={formState === 'loading'}
              text="Create Topic"
            />
          </div>
        </form>
      }
      successChild={
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Topic Created!</h3>
          <p className="text-sm text-muted-foreground">
            Your new topic has been created successfully.
          </p>
        </div>
      }
    />
  )
} 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../lib/content/ContentService';
import { useToast } from '../useToast';
import { logger } from '../../lib/logger';

export const useContentMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const createMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      let result;
      
      // Call the appropriate creation method based on content type
      switch (type) {
        case 'topic':
          result = await contentService.createTopic(data);
          break;
        case 'subtopic':
          result = await contentService.createSubtopic(data);
          break;
        case 'lesson':
          result = await contentService.createLesson(data);
          break;
        case 'question':
          result = await contentService.createQuestion(data);
          break;
        case 'activity':
          result = await contentService.createActivity(data);
          break;
        default:
          throw new Error(`Unknown content type: ${type}`);
      }
      
      return result || null;
    },
    onSuccess: (data: any, variables: { type: string; data: any }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [variables.type] });
      queryClient.invalidateQueries({ queryKey: ['topics'] }); // Invalidate topics specifically
      
      // Log success
      logger.info(`${variables.type} created successfully`, {
        context: { data },
        source: 'useContentMutation'
      });
      
      // Show success toast
      showToast('Content created successfully', { 
        type: 'success',
        position: 'top',
        timeout: 3000
      });

      return data;
    },
    onError: (error: Error, variables: { type: string; data: any }) => {
      showToast('Failed to create content', { type: 'error' });
      logger.error(`Failed to create ${variables.type}`, {
        context: { error },
        source: 'useContentMutation'
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ type, id, data }: { type: string; id: string; data: any }) => {
      let result;
      
      // Add id to data for update methods
      const updateData = { ...data, id };
      
      // Call the appropriate update method based on content type
      switch (type) {
        case 'lesson':
          result = await contentService.updateLesson(updateData);
          break;
        case 'activity':
          result = await contentService.saveActivity(updateData);
          break;
        default:
          throw new Error(`Updating ${type} is not implemented`);
      }
      
      return result;
    },
    onSuccess: (data: any, variables: { type: string; id: string; data: any }) => {
      queryClient.invalidateQueries({ queryKey: [variables.type] });
      showToast('Content updated successfully', { type: 'success' });
      
      logger.info(`${variables.type} updated successfully`, {
        context: { data },
        source: 'useContentMutation'
      });
    },
    onError: (error: Error, variables: { type: string; id: string; data: any }) => {
      showToast('Failed to update content', { type: 'error' });
      logger.error(`Failed to update ${variables.type}`, {
        context: { error },
        source: 'useContentMutation'
      });
    }
  });

  return {
    createContent: createMutation.mutate,
    updateContent: updateMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending
  };
};
import * as z from 'zod';

export const schoolSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters'),
  type: z.enum(['main', 'branch'], {
    required_error: 'Please select a school type'
  }),
  parentId: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number({
    required_error: 'Please select a location on the map'
  }),
  longitude: z.number({
    required_error: 'Please select a location on the map'
  }),
  contactNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  status: z.enum(['active', 'inactive']),
  capacity: z.object({
    total: z.number().min(1, 'Total capacity must be at least 1'),
    current: z.number().min(0, 'Current students cannot be negative')
  }).refine(data => data.current <= data.total, {
    message: 'Current students cannot exceed total capacity',
    path: ['current']
  }),
  principalName: z.string().min(3, 'Principal name must be at least 3 characters'),
  schoolType: z.enum(['public', 'private', 'charter', 'religious', 'other'], {
    required_error: 'Please select a school type'
  }),
  schoolLevel: z.enum(['elementary', 'middle', 'high', 'other'], {
    required_error: 'Please select a school level'
  }),
  schoolLeader: z.object({
    name: z.string().min(3, 'Leader name must be at least 3 characters'),
    title: z.string().min(2, 'Title must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number')
  }),
  grades: z.array(z.string().uuid('Invalid grade ID')).min(1, 'Please select at least one grade').default([]),
  facilities: z.array(z.string()).min(1, 'Please select at least one facility'),
  curriculumType: z.array(z.string()).min(1, 'Please select at least one curriculum type'),
  languagesOffered: z.array(z.string()).min(1, 'Please select at least one language')
});

export type SchoolFormValues = z.infer<typeof schoolSchema>; 
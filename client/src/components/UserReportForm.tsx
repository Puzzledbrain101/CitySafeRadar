import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { InsertUserReport } from '@shared/schema';

const reportSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  category: z.enum(['incident', 'lighting', 'crowd', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface UserReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserReportForm({ open, onOpenChange }: UserReportFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      location: '',
      latitude: 19.0760, // Default Mumbai center
      longitude: 72.8777,
      category: 'incident',
      description: '',
    },
  });
  
  const submitReportMutation = useMutation({
    mutationFn: async (data: InsertUserReport) => {
      return await apiRequest<InsertUserReport>('POST', '/api/user-reports', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-reports'] });
      toast({
        title: 'Report Submitted',
        description: 'Thank you for helping keep Mumbai safer.',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit report',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: ReportFormData) => {
    submitReportMutation.mutate(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-lg border-gray-700/50 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Report Safety Incident
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Help keep Mumbai safer by reporting incidents or safety concerns in your area.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Location</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Andheri West, Near Station"
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
                      data-testid="input-report-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger 
                        className="bg-gray-800 border-gray-600 text-white focus:border-cyan-500"
                        data-testid="select-report-category"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="incident">Safety Incident</SelectItem>
                      <SelectItem value="lighting">Poor Lighting</SelectItem>
                      <SelectItem value="crowd">Crowd Issues</SelectItem>
                      <SelectItem value="other">Other Concern</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the safety concern in detail..."
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500 min-h-[100px] resize-none"
                      data-testid="textarea-report-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-report"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitReportMutation.isPending}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-medium shadow-glow-cyan"
                data-testid="button-submit-report"
              >
                {submitReportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

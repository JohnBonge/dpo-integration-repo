'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { FAQ } from '@/types/faq';
import { Pencil, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FAQsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['General', 'Booking', 'Tours', 'Payment', 'Travel'];

  useEffect(() => {
    fetchFAQs();
  }, []);

  async function fetchFAQs() {
    try {
      const response = await fetch('/api/faqs');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      toast.error('Failed to load FAQs');
      console.error('Error loading FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        '/api/faqs' + (selectedFAQ ? `/${selectedFAQ.id}` : ''),
        {
          method: selectedFAQ ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: formData.get('question'),
            answer: formData.get('answer'),
            category: formData.get('category'),
            order: Number(formData.get('order')),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to save FAQ');

      toast.success(
        selectedFAQ ? 'FAQ updated successfully' : 'FAQ created successfully'
      );
      setIsDialogOpen(false);
      setSelectedFAQ(null);
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete FAQ');

      toast.success('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  }

  function handleEdit(faq: FAQ) {
    setSelectedFAQ(faq);
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className='p-6 max-w-6xl mx-auto'>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-48' />
          <div className='space-y-2'>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className='h-16 w-full' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Manage FAQs</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedFAQ(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>Add New FAQ</Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>
                {selectedFAQ ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Question
                </label>
                <Input
                  name='question'
                  defaultValue={selectedFAQ?.question}
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Answer</label>
                <Textarea
                  name='answer'
                  defaultValue={selectedFAQ?.answer}
                  required
                  rows={4}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Category
                </label>
                <Select
                  name='category'
                  defaultValue={selectedFAQ?.category || 'General'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Order</label>
                <Input
                  name='order'
                  type='number'
                  defaultValue={selectedFAQ?.order || 0}
                  required
                />
              </div>
              <Button type='submit' className='w-full'>
                {selectedFAQ ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='bg-white rounded-lg shadow'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className='w-[100px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className='font-medium'>{faq.question}</TableCell>
                <TableCell>{faq.category}</TableCell>
                <TableCell>{faq.order}</TableCell>
                <TableCell>
                  <div className='flex space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(faq)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

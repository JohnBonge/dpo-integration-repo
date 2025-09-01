'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { Story } from '@prisma/client';

type StatusVariant = 'default' | 'success' | 'destructive';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  async function fetchStories() {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to fetch stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) {
    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update story');
      }

      toast.success(`Story ${status.toLowerCase()} successfully`);
      fetchStories();
    } catch (error) {
      console.error('Failed to update story:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update story'
      );
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        'Are you sure you want to delete this story? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete story');
      }

      toast.success('Story deleted successfully');
      fetchStories(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete story:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete story'
      );
    }
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, StatusVariant> = {
      PENDING: 'default',
      APPROVED: 'success',
      REJECTED: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Story Submissions</h1>
      </div>

      <div className='bg-white rounded-lg shadow'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  {story.image && (
                    <div className='relative w-16 h-16 rounded-md overflow-hidden'>
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className='font-medium'>{story.title}</TableCell>
                <TableCell>{story.authorName}</TableCell>
                <TableCell>{getStatusBadge(story.status)}</TableCell>
                <TableCell>
                  {format(new Date(story.createdAt), 'PPP')}
                </TableCell>
                <TableCell>
                  <div className='flex space-x-2'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant='outline' size='sm'>
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-3xl'>
                        <DialogHeader>
                          <DialogTitle>{story.title}</DialogTitle>
                        </DialogHeader>
                        {story.image && (
                          <div className='relative h-[300px] rounded-lg overflow-hidden mb-4'>
                            <Image
                              src={story.image}
                              alt={story.title}
                              fill
                              className='object-cover'
                            />
                          </div>
                        )}
                        <div className='prose max-w-none'>
                          <p>{story.content}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {story.status === 'PENDING' && (
                      <>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleStatusChange(story.id, 'APPROVED')
                          }
                          className='text-green-600 hover:text-green-700'
                        >
                          Approve
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleStatusChange(story.id, 'REJECTED')
                          }
                          className='text-red-600 hover:text-red-700'
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDelete(story.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      Delete
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

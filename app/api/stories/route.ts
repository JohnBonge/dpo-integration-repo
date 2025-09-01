import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/db-utils';
import { Story, StoryStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getApprovedStories } from '@/lib/cache/stories';
import { uploadImage } from '@/lib/upload';
import slugify from 'slugify';

export async function GET(request: NextRequest) {
  try {
    const referer = request.headers.get('referer') || '';
    const isDashboard = referer.includes('/dashboard');

    if (isDashboard) {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // For dashboard, don't use cache
      const stories = await withRetry<Story[]>(() =>
        prisma.story.findMany({
          orderBy: { createdAt: 'desc' },
        })
      );

      return NextResponse.json(
        stories.map((story) => ({
          ...story,
          createdAt: story.createdAt.toISOString(),
          updatedAt: story.updatedAt.toISOString(),
        }))
      );
    }

    // For public view, use cache
    const stories = await getApprovedStories();
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Failed to fetch stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorName = formData.get('authorName') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const image = formData.get('image') as File;

    if (!title || !content || !authorName || !authorEmail || !image) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate image size
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Validate image type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    let imageUrl;
    try {
      imageUrl = await uploadImage(image);
    } catch (error) {
      console.error('Image upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Generate a unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now()}`;

    // Create story in database
    const story = await withRetry<Story>(() =>
      prisma.story.create({
        data: {
          title,
          content,
          authorName,
          authorEmail,
          image: imageUrl,
          slug,
          status: StoryStatus.PENDING,
        },
      })
    );

    return NextResponse.json(story);
  } catch (error) {
    console.error('Failed to create story:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create story';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { withRetry } from '@/lib/db-utils';
import { Story, StoryStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const story = await withRetry<Story | null>(() =>
      prisma.story.findUnique({
        where: { id: params.id },
      })
    );

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const serializedStory = {
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedStory);
  } catch (error) {
    console.error('Failed to fetch story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Validate the status
    if (
      data.status &&
      !['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)
    ) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const story = await withRetry<Story>(() =>
      prisma.story.update({
        where: { id: params.id },
        data: {
          status: data.status as StoryStatus,
        },
      })
    );

    const serializedStory = {
      ...story,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    };

    return NextResponse.json(serializedStory);
  } catch (error: unknown) {
    console.error('Failed to update story:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Story not found' }, { status: 404 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.story.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete story:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete story' }), {
      status: 500,
    });
  }
}

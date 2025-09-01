import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all FAQs
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const faq = await prisma.faq.findUnique({
      where: { id: params.id },
    });
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

// POST new FAQ
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const faq = await prisma.faq.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
      },
    });
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}

// PUT (update) FAQ
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const faq = await prisma.faq.update({
      where: { id: params.id },
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        order: data.order,
      },
    });
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

// DELETE FAQ
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.faq.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

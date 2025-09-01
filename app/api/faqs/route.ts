import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all FAQs
export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        order: true,
      },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
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

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const faq = await prisma.faq.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    return NextResponse.json(
      { error: 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

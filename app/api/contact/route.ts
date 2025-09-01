import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      message,
      company,
      position,
      groupSize,
    } = body;

    // Determine if this is a corporate inquiry based on the presence of company details
    const isCorporateInquiry = company && position && groupSize;

    const emailContent = isCorporateInquiry
      ? `
        New Corporate Package Inquiry
        
        Contact Information:
        Name: ${firstName} ${lastName}
        Email: ${email}
        
        Company Details:
        Company: ${company}
        Position: ${position}
        Group Size: ${groupSize}
        
        Message:
        ${message}
      `
      : `
        New Contact Form Submission
        
        From: ${firstName} ${lastName}
        Email: ${email}
        
        Message:
        ${message}
      `;

    await resend.emails.send({
      from: 'Acme <noreply@ingomatours.com>',
      to: ['info@ingomatours.com', 'ingomatours8@gmail.com'],
      subject: `New Contact Form Message from ${firstName} ${lastName}`,
      text: emailContent,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

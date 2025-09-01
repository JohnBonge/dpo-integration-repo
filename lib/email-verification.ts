import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export class EmailVerificationService {
  static async generateToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');

    await prisma.verificationToken.create({
      data: {
        token,
        userId,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return token;
  }

  static async verifyEmail(token: string): Promise<boolean> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new Error('Invalid verification token');
    }

    if (verificationToken.expires < new Date()) {
      throw new Error('Verification token has expired');
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return true;
  }

  static async sendVerificationEmail(
    email: string,
    userId: string
  ): Promise<void> {
    const token = await this.generateToken(userId);
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Verify your email address</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If you didn't request this verification, you can safely ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
        </div>
      `,
    });
  }

  static async resendVerificationEmail(
    email: string,
    userId: string
  ): Promise<void> {
    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId },
    });

    // Send new verification email
    await this.sendVerificationEmail(email, userId);
  }
}

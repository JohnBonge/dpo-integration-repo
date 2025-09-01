import { NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<
  { success: true; data: T } | { success: false; error: NextResponse }
> {
  try {
    if (!request.body) {
      return {
        success: false,
        error: NextResponse.json(
          { error: 'Request body is required' },
          { status: 400 }
        ),
      };
    }

    const data = await request.json();
    const validatedData = schema.parse(data);

    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: NextResponse.json({ error: error.message }, { status: 400 }),
      };
    }
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      ),
    };
  }
}

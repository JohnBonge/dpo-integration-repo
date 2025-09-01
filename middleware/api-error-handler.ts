import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  // Create a safe error object for logging
  const errorObject = {
    name: error instanceof Error ? error.name : 'Unknown Error',
    message:
      error instanceof Error ? error.message : 'An unknown error occurred',
    stack: error instanceof Error ? error.stack : undefined,
  };

  console.error('API Error:', errorObject);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}

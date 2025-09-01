'use client';

interface Props {
  children: React.ReactNode;
}

export function PaymentErrorBoundary({ children }: Props) {
  return <>{children}</>;
}

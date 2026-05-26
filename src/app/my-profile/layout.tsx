import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  robots: { index: false, follow: false },
};

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import Header from '@/app/components/header';
export interface PageProps {}

export const metadata = {
  title: 'Dashboard 👩🏻‍💻',
  description: 'Developed by Iryna Bigdash'
  }

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard</Header>
    </>
  );
}

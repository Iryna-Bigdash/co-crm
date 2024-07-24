import Header from '@/app/components/header';

export interface PageProps {}

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/New Companies</Header>
     <p>Some additional information about new companies</p>
    </>
  );
}

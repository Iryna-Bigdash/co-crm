import Header from '@/app/components/header';

export interface PageProps {}

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/Categories</Header>
     <p>Some additional information about categories</p>
    </>
  );
}

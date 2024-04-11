import Header from '@/app/components/header';

export interface PageProps {}

export default function Page({}: PageProps) {
  return (
    <>
      <Header>Dashboard/Total Active Companies</Header>
     <p>Information about total active companies</p>
    </>
  );
}

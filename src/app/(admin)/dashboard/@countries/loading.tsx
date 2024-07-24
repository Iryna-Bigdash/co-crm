import Loader from '@/app/components/loader';
import React from 'react';
export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  return <Loader />;
}

export default Loading;
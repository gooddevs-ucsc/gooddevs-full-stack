import { Outlet } from 'react-router';

export const ErrorBoundary = () => {
  return <div>Something went wrong in sponsor area!</div>;
};

const SponsorRoot = () => {
  return <Outlet />;
};

export default SponsorRoot;
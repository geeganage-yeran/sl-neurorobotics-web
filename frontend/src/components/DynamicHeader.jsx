import Header from './Header';
import HeaderV2 from './HeaderV2';
import useAuth from '../hooks/useAuth';

const DynamicHeader = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <header className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-white shadow-md">
        <div className="flex items-center justify-center mx-auto max-w-7xl">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </header>
    );
  }

  // Return appropriate header
  return isAuthenticated ? <HeaderV2 user={user} /> : <Header />;
};

export default DynamicHeader;
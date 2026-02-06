const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        <div className="text-xl text-white font-semibold">Chargement...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

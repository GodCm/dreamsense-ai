export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-6">
          🌙 DreamSense AI
        </h1>
        <div className="max-w-md mx-auto bg-gray-900 border border-purple-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">
            Website Under Maintenance
          </h2>
          <p className="text-gray-300 mb-6">
            We're currently performing updates to improve your experience.
            The site will be back online soon.
          </p>
          <p className="text-sm text-gray-500">
            Thank you for your patience! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-sm w-full p-10 text-center">
        <span className="text-5xl block mb-4">⚠️</span>
        <h1 className="font-display text-2xl font-bold text-wood-900 mb-2">Access Denied</h1>
        <p className="text-bark-600 mb-6">
          Only the authorised seller account can sign in. Please use the correct Google account.
        </p>
        <a href="/auth/login" className="btn-primary w-full">Try Again</a>
      </div>
    </div>
  );
}

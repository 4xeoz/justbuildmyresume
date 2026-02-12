import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-gray-600">
            Something went wrong during authentication. Please try again.
          </p>
        </div>
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

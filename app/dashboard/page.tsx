// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const [profile, experiencesCount, resumesCount] = await Promise.all([
    prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.experience.count({
      where: { userId: session.user.id },
    }),
    prisma.resume.count({
      where: { userId: session.user.id },
    }),
  ])

  const needsSetup = !profile || experiencesCount === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Resume AI</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{session.user.name}</span>
              <Link
                href="/api/auth/signout"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {needsSetup ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome! Let's get started</h2>
            <p className="text-gray-700 mb-6">
              Before generating resumes, you need to complete your profile and add at least one experience.
            </p>
            <Link
              href="/profile/setup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Complete Profile Setup
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">{experiencesCount}</div>
                <div className="text-gray-600 mt-1">Experiences</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">{resumesCount}</div>
                <div className="text-gray-600 mt-1">Resumes Generated</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-blue-600">Ready</div>
                <div className="text-gray-600 mt-1">Status</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/resume/new"
                  className="border-2 border-blue-600 text-blue-600 p-6 rounded-lg hover:bg-blue-50 transition text-center"
                >
                  <div className="text-4xl mb-2">📝</div>
                  <h3 className="text-xl font-semibold mb-2">Generate New Resume</h3>
                  <p className="text-gray-600">Paste a job description and get a tailored resume</p>
                </Link>

                <Link
                  href="/profile/edit"
                  className="border-2 border-gray-300 text-gray-700 p-6 rounded-lg hover:bg-gray-50 transition text-center"
                >
                  <div className="text-4xl mb-2">👤</div>
                  <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
                  <p className="text-gray-600">Update your info and experiences</p>
                </Link>
              </div>
            </div>

            {/* Recent Resumes (if any) */}
            {resumesCount > 0 && (
              <div className="mt-12 bg-white rounded-lg shadow p-8">
                <h2 className="text-2xl font-bold mb-6">Recent Resumes</h2>
                <p className="text-gray-600">Your generated resumes will appear here</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

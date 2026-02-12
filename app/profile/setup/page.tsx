// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfileSetupPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Profile Setup</h1>
          <p className="text-gray-600 mb-8">
            Complete your profile to start generating tailored resumes
          </p>

          <div className="space-y-8">
            {/* Step indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="ml-3 font-medium">Basic Info</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="ml-3 font-medium">Summary</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <span className="ml-3 font-medium">Experience</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-2">Profile Setup Coming Soon</h2>
              <p className="text-gray-700">
                The profile setup wizard is under development. For now, you can use the API directly
                or access the profile edit page once it's implemented.
              </p>
              <div className="mt-4">
                <a
                  href="/dashboard"
                  className="text-blue-600 hover:underline font-medium"
                >
                  ← Back to Dashboard
                </a>
              </div>
            </div>

            {/* Placeholder for future form */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
              <p>Profile form will be implemented here</p>
              <p className="text-sm mt-2">Fields: Name, Phone, Location, Headline, Summary, Links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

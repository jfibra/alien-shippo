import { UserProfileForm } from "@/components/user-profile-form"

// Mock user profile data
const mockUserProfile = {
  id: "mock_user_1",
  email: "demo@vikingfreight.com",
  first_name: "Demo",
  middle_name: null,
  last_name: "User",
  full_name: "Demo User",
  role: "user",
  created_at: "2024-01-01T00:00:00Z",
}

export default function ProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-navy">Your Profile</h1>
      </div>

      <UserProfileForm initialData={mockUserProfile} />
    </div>
  )
}

import React from 'react'

const StudentHome = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome Back, Student 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quick Stats Cards */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
          <p>Solved: <span className="font-bold">34</span> problems</p>
          <p>Streak: <span className="font-bold text-green-600">5 days</span></p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Next Contest</h2>
          <p>Date: <strong>June 1, 2025</strong></p>
          <p>Starts in: <strong>3 days</strong></p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Daily Challenge</h2>
          <p>Problem: <strong>"Longest Palindromic Substring"</strong></p>
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Solve Now
          </button>
        </div>
      </div>

      {/* Learn / Practice Quick Access */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700">
            Go to Learn
          </button>
          <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700">
            Start Practice
          </button>
          <button className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700">
            Join GuideTalk
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentHome

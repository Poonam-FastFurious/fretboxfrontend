import React from 'react'

function OneToOneProfile({otherUser }) {
  return (
    <>
       <div className="p-6">
      <h3 className="mb-3 text-lg font-semibold">User Details</h3>
      <div>
        <p className="mb-1 text-gray-500">Name</p>
        <h5 className="text-sm">{otherUser?.fullName || "N/A"}</h5>
      </div>
      <div className="mt-4">
        <p className="mb-1 text-gray-500">Email</p>
        <h5 className="text-sm">{otherUser?.email || "N/A"}</h5>
      </div>
      <div className="mt-4">
        <p className="mb-1 text-gray-500">Role</p>
        <h5 className="text-sm">{otherUser?.role || "N/A"}</h5>
      </div>
    </div>
    </>
  )
}

export default OneToOneProfile

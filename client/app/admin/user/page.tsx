import React from 'react'
import UserTable from './userTable'

const page = () => {
  return (
        <div className="flex flex-col gap-6">
          {/* <div>
            <h1 className="text-2xl font-semibold text-gray-900">Client</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all client on the platform.</p>
          </div> */}
          <div className="rounded-xl border-gray-300 bg-white text-sm text-gray-500 shadow-sm">
            <UserTable/>
          </div>
        </div>
  )
}

export default page
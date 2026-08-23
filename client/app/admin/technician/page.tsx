import React from 'react'
import UserTable from './UserTable'
// import Title from '../layout/title.tsx'

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all users on the platform.</p>
      </div> */}

      {/* <Title /> */}
      
           <div className="rounded-xl border-gray-300 bg-white text-sm text-gray-500 shadow-sm">
        <UserTable/>
          </div>
    </div>
  )
}

export default page

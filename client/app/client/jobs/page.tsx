import React from 'react'
import JobTable from './create/ClientTable'

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">All jobs you have created.</p>
      </div>
      <div className="rounded-xl border-gray-300 bg-white text-sm text-gray-500 shadow-sm">
        <JobTable />
      </div>
    </div>
  )
}

export default page

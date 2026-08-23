import React from 'react'
import VerifyTable from './VerifyTable'

const page = () => {
  return (  
        <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Verify Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">Review and verify pending jobs.</p>
      </div>
      <div className="rounded-xl border-gray-300 bg-white text-sm text-gray-500 shadow-sm">
        <VerifyTable />
      </div>
    </div>
  )
}

export default page
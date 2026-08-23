'use client'

import React from 'react'
import PermissionTable from './PermissionTable'

const page = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Permissions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Grant or revoke module access for every user on the platform.
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white text-sm text-gray-500 shadow-sm">
        <PermissionTable />
      </div>
    </div>
  )
}

export default page

'use client'
import React, { useEffect, useState } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import RecentJobTable from '../../admin/AdminDashboard/RecentJob';
import { Divider, Spin } from 'antd';
import { showError } from '@/app/common/notification';
import api from '@/app/service/axios';

interface CountType {
  openJob: number;
  applied: number;
  acceptedJob: number;
  in_Progress : number;
  completed : number;
}

interface JobType {
  id: string;
  clientName: string;
  technicianName: string;
  title: string;
  description: string;
  location: string;
  isVerified: boolean;
  status: string;
  clientId: string;
}

const page = () => {
  const [counts, setCounts] = useState<CountType | null>(null);
  const [recentVerifiedJobs, setRecentVerifiedJobs] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const response = await api.get('/technician/dashboard-data');

      const result = response.data;

      setCounts({
        openJob: result.data.counts.openJob,
        applied: result.data.counts.applied,
        acceptedJob: result.data.counts.acceptedJob,
        in_Progress: result.data.counts.in_Progress,
        completed: result.data.counts.completed,
      });

      setRecentVerifiedJobs(
        (result.data.previews.recentVerifiedJobs ?? []).map((job: any) => ({
          id: job._id,
          clientName: job.clientName,
          technicianName: job.applications?.[0]?.technicianName ?? 'N/A',
          clientId: job.clientId ?? 'N/A',
          title: job.title,
          description: job.description,
          location: job.location,
          isVerified: job.isVerified,
          status: job.status,
        }))
      );

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showError(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Open Jobs', value: counts?.openJob ?? 0 },
    { label: 'Applied Jobs', value: counts?.applied ?? 0 },
    { label: 'Accepted Jobs', value: counts?.acceptedJob ?? 0 },
    { label: 'In Progress Jobs', value: counts?.in_Progress ?? 0 },
    { label: 'Completed Jobs', value: counts?.completed ?? 0 },
  ];

  const statCardClass =
    'flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of jobs, clients and technicians.</p>
      </div>

      <Spin spinning={loading}>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-5 w-[80%]">
              {stats.map((stat) => (
                <div key={stat.label} className={statCardClass}>
                  <div>
                    <p className="text-lg font-medium text-gray-900 sm:text-2xl">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-gray-500">{stat.label}</p>
                  </div>
                  <MdOutlineDashboard className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>

            <Divider />

            <div className="flex flex-col gap-3 w-[90%]">
              <h1 className="text-base font-bold text-gray-900">Recent Jobs</h1>
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <RecentJobTable data={recentVerifiedJobs} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default page

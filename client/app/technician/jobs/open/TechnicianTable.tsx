'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Button, Empty, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
import { showError } from '@/app/common/notification';
import api from '@/app/service/axios';
import JobDetails from '@/app/admin/jobs/view-all/JobDetails';
import ApplyJobModal from './Modal';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: string;
  clientName: string;
  title: string;
  description: string;
  location: string;
  isVerified: boolean;
  status: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const JobTable: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedApplyJobId, setSelectedApplyJobId] = useState<string | null>(null);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const handleView = (id: string) => {
    setSelectedJobId(id);
    setOpen(true)
  }

  const handleApply = (id: string) => {
    setSelectedApplyJobId(id);
    setApplyModalOpen(true);
  };

  const fetchJobs = async (
    page = 1,
    limit = 10,
  ) => {
    try {
      setLoading(true);

      const response = await api.get(`/jobs/open?page=${page}&limit=${limit}`);

      const result = response.data;

      setData(
        result.data.map((job: any) => ({
          id: job._id,
          clientName: job.clientName,
          title: job.title,
          description: job.description,
          location: job.location,
          isVerified: job.isVerified,
          status: job.status,
        })),
      );

      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          current: result.meta.page,
          pageSize: result.meta.limit,
          total: result.meta.total,
        },
      }));

    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      sorter: true,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '20%'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      sorter: true,
      key: 'isActive',
      render: (isVerified: boolean) => (
        <span className={isVerified ? 'text-green-500' : 'text-red-500'}>
          {isVerified ? 'True' : 'False'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: DataType) => (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-blue-500 cursor-pointer">
            <EyeOutlined
              className="text-base"
              onClick={() => {
                handleView(record.id)
              }}
            />
          </span>
          <Button type="primary" onClick={() => handleApply(record.id)}>
            Apply
          </Button>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchJobs(
      pagination.current,
      pagination.pageSize,
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div style={{ margin: '25px', backgroundColor: 'white' }}>
          <h1 className="text-2xl font-semibold text-gray-900">Open Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">Browse and apply to open jobs.</p>
        </div>
      </div>
      <Table<DataType>
        className="job-table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={false}
              />
              <span className="text-sm text-gray-500">No data</span>
            </div>
          ),
        }}
      />
      <JobDetails jobId={selectedJobId} onClose={() => { setSelectedJobId(null); setOpen(false); }} />
      <ApplyJobModal
        open={applyModalOpen}
        jobId={selectedApplyJobId}
        onClose={() => { setApplyModalOpen(false); setSelectedApplyJobId(null); }}
        onSuccess={() => fetchJobs()}
      />
    </div>
  );
};

export default JobTable;

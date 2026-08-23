'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Button, Empty, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
import JobDetails from './JobDetails';
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: string;
  clientName: string;
  title: string;
  description: string;
  location: string;
  status: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const VerifyTable: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

  const handleVerify = async (id: string) => {
    try {
      const verifyJob = await api.post(`/admin/verify-job/${id}`);

      if (verifyJob) {
        fetchJobs()
        showSuccess('Job Verified');
      }
    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong!');
    }
  }

  const fetchJobs = async (
    page = 1,
    limit = 10,
  ) => {
    try {
      setLoading(true);

      const response = await api.get(`/admin/non-verified-job?page=${page}&limit=${limit}`);

      const result = (response as any).data;

      setData(
        result.data.map((job: any) => ({
          id: job._id,
          clientName: job.clientName,
          title: job.title,
          description: job.description,
          location: job.location,
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
      showError(error.response?.data?.message || 'Failed to fetch jobs');
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [])

  const columns: ColumnsType<DataType> = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      sorter: true,
      width: '20%',
      onHeaderCell: () => ({
        style: {
          padding: '16px 24px',
        },
      }),
      onCell: () => ({
        style: {
          padding: '16px 24px',
        },
      }),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
      width: '20%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '30%'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (_: unknown, record: DataType) => (
        <Button type="primary" onClick={() => { handleVerify(record.id) }}>Verify</Button>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: unknown, record: DataType) => (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-blue-500 cursor-pointer">
            <EyeOutlined
              className='text-base'
              onClick={() => {
                handleView(record.id);
              }}
            />
          </span>
        </div>
      )
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchJobs(
      pagination.current,
      pagination.pageSize,
    );
  };

  return (
    <>
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
    </>
  );
};

export default VerifyTable;

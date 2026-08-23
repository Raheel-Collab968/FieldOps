'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Empty, Modal, Table } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
import JobDetails from './view-all/JobDetails';
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

interface DataType {
  id: string;
  clientName: string;
  technicianName: string;
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

  const fetchJobs = async (
    page = 1,
    limit = 10,
  ) => {
    try {
      setLoading(true);

      const response = await api.get(`/jobs?page=${page}&limit=${limit}`);

      const result = (response as any).data;

      setData(
        result.data.map((job: any) => ({
          id: job._id,
          clientName: job.clientName,
          technicianName: job.technicianName ?? 'N/A',
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

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Job',
      content: 'Are you sure you want to delete this job',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await api.delete(`/jobs/delete/${id}`)
          showSuccess((response as any).data.message);
          fetchJobs();
        } catch (error: any) {
          showError(error.response?.data?.message || 'Failed to delete job')
        }
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      sorter: true,
    },
    {
      title: 'Technician Name',
      dataIndex: 'technicianName',
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
          <span className="flex items-center gap-1 text-red-500 cursor-pointer">
            <DeleteOutlined className="text-base"
              onClick={() => {
                handleDelete(record.id)
              }} />
          </span>
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
    </div>
  );
};

export default JobTable;

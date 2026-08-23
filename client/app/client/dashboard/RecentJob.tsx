'use client';

import React from 'react';
import type { TableProps } from 'antd';
import { Empty, Table } from 'antd';

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
  clientId: string;
}

interface RecentJobTableProps {
  data: DataType[];
  loading: boolean;
}

const RecentJobTable: React.FC<RecentJobTableProps> = ({ data, loading }) => {
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
      key: 'isVerified',
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
  ];

  return (
    <div>
      <Table<DataType>
        className="job-table"
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        loading={loading}
        pagination={false}
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
    </div>
  );
};

export default RecentJobTable;

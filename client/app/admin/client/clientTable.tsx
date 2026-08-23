'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Descriptions, Drawer, Empty, Modal, Table, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: string;
  name: string;
  email: string;
  phone: number;
  isActive: boolean;
  status: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const ClientTable: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<DataType | null>();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const fetchUsers = async (
    page = 1,
    limit = 10,
  ) => {
    try {
      setLoading(true);

      const response = await api.get(`/admin/all-users?page=${page}&limit=${limit}`);

      const result = (response as any).data;

      setData(
        result.data.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isActive: user.isActive,
          status: user.status || 'Active',
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
      }))

    } catch (error: any) {
      showError(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await api.delete(`/auth/${id}`)
          showSuccess((response as any).data.message || 'User deleted successfully');
          fetchUsers(tableParams.pagination?.current, tableParams.pagination?.pageSize);
        } catch (error: any) {
          showError(error.response?.data?.message || 'Failed to delete user');
        }
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      sorter: true,
      key: 'isActive',
      render: (isActive: boolean) => (
        <span className={isActive ? 'text-green-500' : 'text-red-500'}>
          {isActive ? 'True' : 'False'}
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
            <EyeOutlined className="text-base"
              onClick={() => {
                setSelectedJob(record)
                setOpen(true)
              }}
            />
          </span>
          <span className="flex items-center gap-1 text-red-500 cursor-pointer">
            <DeleteOutlined className="text-base"
              onClick={() => handleDelete(record.id)} />
          </span>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchUsers(
      pagination.current,
      pagination.pageSize,
    );
  }

  return (
    <>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data ?? []}
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

      <Drawer
        title="User Details"
        placement='right'
        size={520}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => setOpen(false)}
        open={open}
      >
        {selectedJob && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              {selectedJob.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedJob.email}
            </Descriptions.Item>
            <Descriptions.Item label="Id">
              {selectedJob.id}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {selectedJob.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Active">
              <Tag color={selectedJob.isActive ? 'green' : 'red'}>
                {selectedJob.isActive ? 'True' : 'False'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedJob.status}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
};

export default ClientTable;

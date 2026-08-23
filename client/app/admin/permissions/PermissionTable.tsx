'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Avatar, Button, Empty, Table, Tag } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';
import PermissionDrawer from './PermissionDrawer';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

export interface PermissionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
}

const roleColor: Record<string, string> = {
  ADMIN: 'blue',
  CLIENT: 'green',
  TECHNICIAN: 'orange',
};

const PermissionTable: React.FC = () => {
  const [data, setData] = useState<PermissionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PermissionUser | null>(null);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const fetchUsers = async (page = 1, limit = 10) => {
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
          role: user.role,
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
      showError(error.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const columns: ColumnsType<PermissionUser> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      render: (name: string) => (
        <div className="flex items-center gap-3">
          <Avatar size={32} style={{ background: 'linear-gradient(135deg, #1a5276, #0e7490)' }}>
            {name?.[0]?.toUpperCase()}
          </Avatar>
          <span className="font-medium text-gray-700">{name}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '25%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: '18%',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '14%',
      render: (role: string) => (
        <Tag color={roleColor[role] || 'default'}>{role}</Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '18%',
      render: (_: unknown, record: PermissionUser) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<SafetyCertificateOutlined />}
          onClick={() => {
            setSelectedUser(record);
            setDrawerOpen(true);
          }}
        >
          Manage Access
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  return (
    <>
      <Table<PermissionUser>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
              <span className="text-sm text-gray-500">No users found</span>
            </div>
          ),
        }}
      />

      <PermissionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </>
  );
};

export default PermissionTable;

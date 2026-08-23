'use client';

import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Button, Empty, Modal, Table, Tag, Spin, Card, List, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: string;
  clientName: string;
  title: string;
  description: string;
  location: string;
  status: string;
  isVerified: boolean;
  applicationCount: number;
}

interface Applicant {
  technicianId: string;
  technicianName: string;
  coverNote: string;
  status: string;
}

interface JobApplicants {
  title: string;
  description: string;
  location: string;
  status: string;
  applications: Applicant[];
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const AssignTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: { current: 1, pageSize: 10, total: 0 },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobApplicants, setJobApplicants] = useState<JobApplicants | null>(null);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const fetchJobs = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/assignable-jobs?page=${page}&limit=${limit}`);
      const result = (response as any).data;

      setData(
        result.data.map((job: any) => ({
          id: job._id,
          clientName: job.clientName,
          title: job.title,
          description: job.description,
          location: job.location,
          status: job.status,
          isVerified: job.isVerified,
          applicationCount: job.applications?.length ?? 0,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewApplicants = async (jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
    setApplicantsLoading(true);
    try {
      const response = await api.get(`/admin/job-applicants/${jobId}`);
      setJobApplicants((response as any).data.job);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleAssign = async (technicianId: string) => {
    if (!selectedJobId) return;
    try {
      setAssigning(true);
      const response = await api.post(`/admin/assign-job/${selectedJobId}`, { technicianId });
      showSuccess((response as any).data.message || 'Technician assigned successfully');
      setDrawerOpen(false);
      setJobApplicants(null);
      setSelectedJobId(null);
      fetchJobs(tableParams.pagination?.current, tableParams.pagination?.pageSize);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

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
      width: '20%',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Applicants',
      dataIndex: 'applicationCount',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: unknown, record: DataType) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewApplicants(record.id)}
          disabled={record.applicationCount === 0}
        >
          Assign
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    fetchJobs(pagination.current, pagination.pageSize);
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
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={false} />
              <span className="text-sm text-gray-500">No open jobs to assign</span>
            </div>
          ),
        }}
      />

      <Modal
        title={jobApplicants ? `Applicants for "${jobApplicants.title}"` : 'Applicants'}
        open={drawerOpen}
        onCancel={() => {
          setDrawerOpen(false);
          setJobApplicants(null);
          setSelectedJobId(null);
        }}
        footer={null}
        width={600}
      >
        <Spin spinning={applicantsLoading}>
          {jobApplicants && (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {jobApplicants.location} &middot; {jobApplicants.applications.length} applicant(s)
                </p>
              </div>
              {jobApplicants.applications.length === 0 ? (
                <Empty description="No applicants yet" />
              ) : (
                <List
                  dataSource={jobApplicants.applications}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          key="assign"
                          type="primary"
                          size="small"
                          loading={assigning}
                          onClick={() => handleAssign(item.technicianId)}
                        >
                          Assign
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.technicianName}
                        description={
                          <div>
                            <p className="text-xs text-gray-400">{item.coverNote || 'No cover note'}</p>
                            <Tag
                              color={
                                item.status === 'ACCEPTED'
                                  ? 'green'
                                  : item.status === 'REJECTED'
                                  ? 'red'
                                  : 'orange'
                              }
                              className="mt-1"
                            >
                              {item.status}
                            </Tag>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </>
          )}
        </Spin>
      </Modal>
    </div>
  );
};

export default AssignTable;

'use client';

import React, {
  useEffect,
  useState,
} from 'react';

import {
  Drawer,
  Descriptions,
  Empty,
  Tag,
  Spin,
} from 'antd';
import api from '@/app/service/axios';
import { showError } from '@/app/common/notification';

interface Application {
  _id?: string;
  technicianId?: string;
  technicianName?: string;
  status?: string;
  [key: string]: unknown;
}

interface AuditLog {
  _id?: string;
  action?: string;
  [key: string]: unknown;
}

interface DataType {
  _id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  location: string;
  isVerified: boolean;
  status: string;
  isDeleted: boolean;
  timestamp: string;
  applications: Application[];
  auditLog: AuditLog[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface JobDetailsProps {
  jobId: string | null;
  onClose: () => void;
}

const JobDetails = ({
  jobId,
  onClose,
}: JobDetailsProps) => {
  const [loading, setLoading] =
    useState(false);

  const [job, setJob] =
    useState<DataType | null>(null);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    fetchJob(jobId);
  }, [jobId]);

  const fetchJob = async (
    id: string,
  ) => {
    try {
      setLoading(true);

      const response =
        await api.get(
          `/jobs/${id}`);

      setJob((response as any).data);
    } catch (error) {

    showError(error.response?.data?.message || 'Failed to fetch job details')

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setJob(null);
    onClose();
  };

  return (
    <Drawer
      title="Job Details"
      placement="right"
      size={650}
      open={!!jobId}
      onClose={handleClose}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : job ? (
        <Descriptions
          column={1}
          bordered
          size="small"
        >
          {/* Job ID */}

          <Descriptions.Item label="Job ID">
            {job._id}
          </Descriptions.Item>

          {/* Client ID */}

          <Descriptions.Item label="Client ID">
            {job.clientId}
          </Descriptions.Item>

          {/* Client Name */}

          <Descriptions.Item label="Client Name">
            {job.clientName}
          </Descriptions.Item>

          {/* Title */}

          <Descriptions.Item label="Title">
            {job.title}
          </Descriptions.Item>

          {/* Description */}

          <Descriptions.Item label="Description">
            {job.description}
          </Descriptions.Item>

          {/* Location */}

          <Descriptions.Item label="Location">
            {job.location}
          </Descriptions.Item>

          {/* Verified */}

          <Descriptions.Item label="Verified">
            <Tag
              color={
                job.isVerified
                  ? 'green'
                  : 'red'
              }
            >
              {job.isVerified
                ? 'True'
                : 'False'}
            </Tag>
          </Descriptions.Item>

          {/* Status */}

          <Descriptions.Item label="Status">
            <Tag color="blue">
              {job.status}
            </Tag>
          </Descriptions.Item>

          {/* Deleted */}

          <Descriptions.Item label="Deleted">
            <Tag
              color={
                job.isDeleted
                  ? 'red'
                  : 'green'
              }
            >
              {job.isDeleted
                ? 'True'
                : 'False'}
            </Tag>
          </Descriptions.Item>

          {/* Timestamp */}

          <Descriptions.Item label="Timestamp">
            {new Date(
              job.timestamp,
            ).toLocaleString()}
          </Descriptions.Item>

          {/* Created At */}

          <Descriptions.Item label="Created At">
            {new Date(
              job.createdAt,
            ).toLocaleString()}
          </Descriptions.Item>

          {/* Updated At */}

          <Descriptions.Item label="Updated At">
            {new Date(
              job.updatedAt,
            ).toLocaleString()}
          </Descriptions.Item>

          {/* Applications */}

          <Descriptions.Item label="Applications">
            {job.applications?.length ===
            0 ? (
              <Tag>
                No Applications
              </Tag>
            ) : (
              <div className="flex flex-col gap-3">
                {job.applications?.map(
                  (
                    application,
                    index,
                  ) => (
                    <div
                      key={
                        application._id ??
                        index
                      }
                      className="rounded-md border p-3"
                    >
                      <p>
                        <strong>
                          Technician:
                        </strong>{' '}
                        {application.technicianName ??
                          'N/A'}
                      </p>

                      <p>
                        <strong>
                          Technician ID:
                        </strong>{' '}
                        {application.technicianId ??
                          'N/A'}
                      </p>

                      <p>
                        <strong>
                          Status:
                        </strong>{' '}
                        {application.status ??
                          'N/A'}
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </Descriptions.Item>

          {/* Audit Log */}

          <Descriptions.Item label="Audit Log">
            {job.auditLog?.length ===
            0 ? (
              <Tag>
                No Audit Logs
              </Tag>
            ) : (
              <div className="flex flex-col gap-3">
                {job.auditLog?.map(
                  (
                    log,
                    index,
                  ) => (
                    <div
                      key={
                        log._id ??
                        index
                      }
                      className="rounded-md border p-3"
                    >
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(
                          log,
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  ),
                )}
              </div>
            )}
          </Descriptions.Item>

          {/* MongoDB Version */}

          <Descriptions.Item label="Version">
            {job.__v}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty description="Select a job to view details" />
      )}
    </Drawer>
  );
};

export default JobDetails;
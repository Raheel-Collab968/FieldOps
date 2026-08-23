'use client';

import React from 'react';
import { Button, Flex, Form, Input, Modal } from 'antd';
import type { GetProp, ModalProps } from 'antd';
import api from '@/app/service/axios';
import { showSuccess, showError } from '@/app/common/notification';

const { TextArea } = Input;

type FieldType = {
  coverNote?: string;
};

interface ApplyJobModalProps {
  open: boolean;
  jobId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const stylesFn: ModalProps['styles'] = (info): GetProp<ModalProps, 'styles', 'Return'> => {
  if (info.props.footer) {
    return {
      container: {
        borderRadius: 14,
        border: '1px solid #ccc',
        padding: 0,
        overflow: 'hidden',
      },
      header: {
        padding: 16,
      },
      body: {
        padding: 16,
      },
      footer: {
        padding: '16px 10px',
        backgroundColor: '#fafafa',
      },
    };
  }
  return {};
};

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ open, jobId, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleApply = async (values: FieldType) => {
    try {
      setLoading(true);
      const response = await api.post(`/technician/apply/${jobId}`, {
        coverNote: values.coverNote,
      });
      showSuccess(response.data.message || 'Applied successfully');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to apply job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      title="Apply Job"
      styles={stylesFn}
      mask={{ enabled: true, blur: true }}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={
        <Flex justify="end" gap={8}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
            styles={{ root: { borderColor: '#ccc', color: '#171717', backgroundColor: '#fff' } }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            loading={loading}
            styles={{ root: { backgroundColor: '#171717' } }}
            onClick={() => form.submit()}
          >
            Apply
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleApply} autoComplete="off">
        <Form.Item<FieldType>
          label="Cover Note"
          name="coverNote"
          rules={[{ required: true, message: 'Please enter a cover note' }]}
        >
          <TextArea rows={4} placeholder="Why are you a good fit for this job?" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApplyJobModal;

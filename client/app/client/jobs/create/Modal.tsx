'use client';

import React from 'react';
import { Button, DatePicker, Flex, Form, Input, Modal } from 'antd';
import type { GetProp, ModalProps } from 'antd';
import api from '@/app/service/axios';
import { showSuccess, showError } from '@/app/common/notification';

const { TextArea } = Input;

type FieldType = {
  title?: string;
  description?: string;
  location?: string;
  preferredDate?: any;
};

interface CreateJobModalProps {
  open: boolean;
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

const CreateJobModal: React.FC<CreateJobModalProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async (values: FieldType) => {
    try {
      setLoading(true);
      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        preferredDate: values.preferredDate?.toISOString(),
      };

      const response = await api.post('/jobs/create', payload);
      showSuccess(response.data.message || 'Job created successfully');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      title="Create Job"
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
            Create
          </Button>
        </Flex>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleCreate} autoComplete="off">
        <Form.Item<FieldType>
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter job title' }]}
        >
          <Input placeholder="Enter job title" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter job description' }]}
        >
          <TextArea rows={3} placeholder="Enter job description" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Location"
          name="location"
          rules={[{ required: true, message: 'Please enter job location' }]}
        >
          <Input placeholder="Enter job location" />
        </Form.Item>

        <Form.Item<FieldType> label="Preferred Date" name="preferredDate">
          <DatePicker style={{ width: '100%' }} placeholder="Select preferred date" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateJobModal;

'use client';

import { notification } from 'antd';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons';

export const showSuccess = (message: string) => {
  notification.open({
    title: message,
    placement: 'top',
    duration: 3,
    icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
    className: 'custom-notification',
    closeIcon: false,
  });
};

export const showError = (message: string) => {
  notification.open({
    title: message,
    placement: 'top',
    duration: 3,
    icon: <CloseCircleFilled style={{ color: '#ff4d4f' }} />,
    className: 'custom-notification',
    closeIcon: false,
  });
};

export const showWarning = (message: string) => {
  notification.open({
    title: message,
    placement: 'top',
    duration: 3,
    icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
    className: 'custom-notification',
    closeIcon: false,
  });
};
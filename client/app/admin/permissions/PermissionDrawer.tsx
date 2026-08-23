'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Drawer, Empty, Popconfirm, Skeleton, Table, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { showSuccess, showError } from '@/app/common/notification';
import api from '@/app/service/axios';
import type { PermissionUser } from './PermissionTable';

const MODULES = ['dashboard', 'jobs', 'users', 'technicians', 'permissions'] as const;
type ModuleName = (typeof MODULES)[number];

const ACTIONS = ['canView', 'canCreate', 'canEdit', 'canUpdate', 'canDelete'] as const;
type Action = (typeof ACTIONS)[number];

const MODULE_LABELS: Record<ModuleName, string> = {
  dashboard: 'Dashboard',
  jobs: 'Jobs',
  users: 'Users',
  technicians: 'Technicians',
  permissions: 'Permissions',
};

const ACTION_LABELS: Record<Action, string> = {
  canView: 'View',
  canCreate: 'Create',
  canEdit: 'Edit',
  canUpdate: 'Update',
  canDelete: 'Delete',
};

type ModuleMatrix = Record<ModuleName, Record<Action, boolean>>;

interface PermissionDrawerProps {
  open: boolean;
  onClose: () => void;
  user: PermissionUser | null;
}

const emptyMatrix = (): ModuleMatrix =>
  Object.fromEntries(
    MODULES.map((m) => [m, Object.fromEntries(ACTIONS.map((a) => [a, false]))]),
  ) as ModuleMatrix;

const PermissionDrawer: React.FC<PermissionDrawerProps> = ({ open, onClose, user }) => {
  const [matrix, setMatrix] = useState<ModuleMatrix>(emptyMatrix());
  const [grantedModules, setGrantedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchPermissions = async (userId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/permissions/user/${userId}`);
      const doc = (response as any).data;

      const next = emptyMatrix();
      if (doc?.permissions) {
        for (const mod of Object.keys(doc.permissions)) {
          const saved = doc.permissions[mod] || {};
          if ((next as any)[mod]) {
            for (const action of ACTIONS) {
              (next as any)[mod][action] = saved[action] === true;
            }
          }
        }
        setGrantedModules(Object.keys(doc.permissions));
      } else {
        setGrantedModules([]);
      }
      setMatrix(next);
    } catch (error: any) {
      setGrantedModules([]);
      setMatrix(emptyMatrix());
      showError(error.response?.data?.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPermissions(user.id);
    }
  }, [open, user]);

  const toggle = (mod: ModuleName, action: Action, checked: boolean) => {
    setMatrix((prev) => ({
      ...prev,
      [mod]: { ...prev[mod], [action]: checked },
    }));
  };

  const toggleModuleAll = (mod: ModuleName, checked: boolean) => {
    setMatrix((prev) => ({
      ...prev,
      [mod]: Object.fromEntries(ACTIONS.map((a) => [a, checked])),
    }) as ModuleMatrix);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await Promise.all(
        MODULES.map((mod) =>
          api.post('/permissions/grant', {
            userId: user.id,
            userRole: user.role,
            module: mod,
            permissions: matrix[mod],
          }),
        ),
      );
      showSuccess(`Permissions updated for ${user.name}`);
      onClose();
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (mod: string) => {
    if (!user) return;
    try {
      await api.delete(`/permissions/revoke/${user.id}/${mod}`);
      showSuccess(`"${MODULE_LABELS[mod as ModuleName] || mod}" access revoked`);
      fetchPermissions(user.id);
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to revoke module');
    }
  };

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Module',
      dataIndex: 'module',
      width: '22%',
      render: (_: unknown, record: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{MODULE_LABELS[record.module]}</span>
          {grantedModules.includes(record.module) && <Tag color="cyan">Active</Tag>}
        </div>
      ),
    },
    ...ACTIONS.map((action) => ({
      title: ACTION_LABELS[action],
      key: action,
      align: 'center' as const,
      render: (_: unknown, record: any) => (
        <Checkbox
          checked={matrix[record.module]?.[action]}
          onChange={(e) => toggle(record.module, action, e.target.checked)}
        />
      ),
    })),
    {
      title: 'All',
      key: 'all',
      align: 'center' as const,
      width: 90,
      render: (_: unknown, record: any) => {
        const allChecked = ACTIONS.every((a) => matrix[record.module]?.[a]);
        return (
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && ACTIONS.some((a) => matrix[record.module]?.[a])}
            onChange={(e) => toggleModuleAll(record.module, e.target.checked)}
          />
        );
      },
    },
    {
      title: '',
      key: 'revoke',
      width: 60,
      align: 'center' as const,
      render: (_: unknown, record: any) =>
        grantedModules.includes(record.module) ? (
          <Popconfirm
            title={`Revoke all "${MODULE_LABELS[record.module]}" access?`}
            okText="Revoke"
            okType="danger"
            onConfirm={() => handleRevoke(record.module)}
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <Drawer
      title={
        <div>
          <div className="font-semibold">Manage Access</div>
          {user && (
            <div className="text-xs font-normal text-gray-500">
              {user.name} &middot; {user.email}
            </div>
          )}
        </div>
      }
      placement="right"
      size={640}
      closable={{ 'aria-label': 'Close Button' }}
      onClose={onClose}
      open={open}
      footer={
        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={saving} onClick={handleSave}>
            Save Permissions
          </Button>
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : !user ? (
        <Empty description="Select a user" />
      ) : (
        <>
          <div className="mb-4 rounded-lg bg-blue-50 border border-blue-100 p-3 text-xs text-gray-600">
            Tick the actions each module allows for this user. Changes apply
            immediately after saving.
          </div>
          <Table
            columns={columns}
            rowKey="module"
            dataSource={MODULES.map((m) => ({ module: m }))}
            pagination={false}
            size="middle"
          />
        </>
      )}
    </Drawer>
  );
};

export default PermissionDrawer;

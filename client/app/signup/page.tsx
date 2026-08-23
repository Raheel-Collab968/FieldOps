'use client'

import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { showSuccess, showError } from '@/app/common/notification';
import api from '../service/axios';
import { useAppContext } from '@/app/context/AppContext';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  remember?: string;
  phone?: string;
  role?: string;
};

const page: React.FC = () => {
  const router = useRouter();
  const { refreshUser } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: FieldType) => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/register`, {
        name:     values.name,
        email:    values.email,
        password: values.password,
        phone:    values.phone,
        role:     values.role,
      });

      const { access_token } = (res as any).data;

      setCookie('token', access_token, {
        maxAge:   3600 * 24 * 7,
        path:     '/',
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      showSuccess('Account created successfully!');
      await refreshUser();

      const decoded = jwtDecode<JwtPayload>(access_token);

      if (decoded.role === 'ADMIN')      router.push('/admin/AdminDashboard');
      else if (decoded.role === 'CLIENT')     router.push('/client/dashboard');
      else if (decoded.role === 'TECHNICIAN') router.push('/technician/dashboard');

    } catch (err: any) {
      showError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#1a1f2e', border: '1px solid #2d3748' }}
      >

        {/* Top accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #1a5276, #0e7490, #1a5276)' }} />

        {/* Header */}
        <div className="text-center pt-10 pb-6 px-8">
          {/* Logo */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #1a5276, #0e7490)' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 style={{ color: '#f7fafc', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            Create Account
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>
            Join FieldOps and get started today
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <Form
            layout="vertical"
            onFinish={handleSignup}
            autoComplete="off"
            requiredMark={false}
          >
            {/* Row 1: Name + Email */}
            <div className="flex gap-4">
              <Form.Item<FieldType>
                label={<span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>Full Name</span>}
                name="name"
                className="flex-1"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input
                  placeholder="Raheel Ahmed"
                  size="large"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #2d3748',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                  }}
                />
              </Form.Item>

              <Form.Item<FieldType>
                label={<span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>Email Address</span>}
                name="email"
                className="flex-1"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input
                  placeholder="raheel@email.com"
                  size="large"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #2d3748',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                  }}
                />
              </Form.Item>
            </div>

            {/* Row 2: Password + Phone */}
            <div className="flex gap-4">
              <Form.Item<FieldType>
                label={<span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>Password</span>}
                name="password"
                className="flex-1"
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 6, message: 'Minimum 6 characters' },
                ]}
              >
                <Input.Password
                  placeholder="Min. 6 characters"
                  size="large"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #2d3748',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                  }}
                />
              </Form.Item>

              <Form.Item<FieldType>
                label={<span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>Phone Number</span>}
                name="phone"
                className="flex-1"
                rules={[{ required: true, message: 'Phone is required' }]}
              >
                <Input
                  placeholder="03XX XXXXXXX"
                  size="large"
                  style={{
                    background: '#0f1117',
                    border: '1px solid #2d3748',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                  }}
                />
              </Form.Item>
            </div>

            {/* Row 3: Role (full width) */}
            <Form.Item
              label={<span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>Select Role</span>}
              name="role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                className="role-select"
                placeholder="Choose your role"
                size="large"
                style={{ width: '100%' }}
                optionLabelProp="title"
                classNames={{ popup: { root: 'role-select-dropdown' } }}
                options={[
                  {
                    value: 'CLIENT',
                    title: 'Client',
                    label: (
                      <div className="flex items-center gap-2">
                        {/* <span>🏢</span> */}
                        <div>
                          <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Client</div>
                          <div style={{ fontSize: '11px', color: '#718096' }}>Post jobs and track progress</div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    value: 'TECHNICIAN',
                    title: 'Technician',
                    label: (
                      <div className="flex items-center gap-2">
                        {/* <span>🔧</span> */}
                        <div>
                          <div style={{ fontWeight: 600, color: '#e2e8f0' }}>Technician</div>
                          <div style={{ fontSize: '11px', color: '#718096' }}>Apply for and complete jobs</div>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </Form.Item>

            {/* Remember me */}
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '16px' }}>
              <Checkbox style={{ color: '#718096', fontSize: '13px' }}>
                Remember me for 7 days
              </Checkbox>
            </Form.Item>

            {/* Submit button */}
            <Form.Item style={{ marginBottom: '16px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                style={{
                  background:    'linear-gradient(135deg, #1a5276, #0e7490)',
                  border:        'none',
                  borderRadius:  '8px',
                  height:        '48px',
                  fontSize:      '15px',
                  fontWeight:    600,
                  letterSpacing: '0.3px',
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account →'}
              </Button>
            </Form.Item>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div style={{ flex: 1, height: '1px', background: '#2d3748' }} />
              <span style={{ color: '#4a5568', fontSize: '12px' }}>already have an account?</span>
              <div style={{ flex: 1, height: '1px', background: '#2d3748' }} />
            </div>

            {/* Login link */}
            <Button
              size="large"
              block
              onClick={() => router.push('/login')}
              style={{
                background:   'transparent',
                border:       '1px solid #2d3748',
                borderRadius: '8px',
                height:       '48px',
                color:        '#63b3ed',
                fontSize:     '14px',
                fontWeight:   500,
              }}
            >
              Sign In to Existing Account
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;

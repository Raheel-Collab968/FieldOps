'use client'

import React, { useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
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
  email?: string;
  password?: string;
  remember?: string;
};

const page: React.FC = () => {
  const router = useRouter();
  const { refreshUser } = useAppContext();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: FieldType) => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, {
        email:    values.email,
        password: values.password,
      });

      const { access_token } = res.data;

      setCookie('token', access_token, {
        maxAge:   3600 * 24 * 7,
        path:     '/',
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      showSuccess('Login Successful!');
      await refreshUser();

      const decoded = jwtDecode<JwtPayload>(access_token);

      if (decoded.role === 'ADMIN')           router.push('/admin/AdminDashboard');
      else if (decoded.role === 'CLIENT')     router.push('/client/dashboard');
      else if (decoded.role === 'TECHNICIAN') router.push('/technician/dashboard');

    } catch (err: any) {
      showError(err.response?.data?.message || 'Login Failed');
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
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
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
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 style={{ color: '#f7fafc', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            Welcome Back
          </h1>
          <p style={{ color: '#718096', fontSize: '14px', marginTop: '6px' }}>
            Sign in to your FieldOps account
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <Form
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            autoComplete="off"
            requiredMark={false}
          >

            {/* Email */}
            <Form.Item<FieldType>
              label={
                <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>
                  Email Address
                </span>
              }
              name="email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input
                placeholder="raheel@email.com"
                size="large"
                style={{
                  background:   '#0f1117',
                  border:       '1px solid #2d3748',
                  borderRadius: '8px',
                  color:        '#e2e8f0',
                  fontSize:     '14px',
                }}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item<FieldType>
              label={
                <div className="flex justify-between w-full" style={{ width: '100%' }}>
                  <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: 500 }}>
                    Password
                  </span>
                  {/* <span
                    style={{ color: '#63b3ed', fontSize: '12px', cursor: 'pointer' }}
                    onClick={() => router.push('/forgot-password')}
                  >
                    Forgot password?
                  </span> */}
                </div>
              }
              name="password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
                style={{
                  background:   '#0f1117',
                  border:       '1px solid #2d3748',
                  borderRadius: '8px',
                  color:        '#e2e8f0',
                  fontSize:     '14px',
                }}
              />
            </Form.Item>

            {/* Remember me */}
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '20px' }}>
              <Checkbox style={{ color: '#718096', fontSize: '13px' }}>
                Remember me for 7 days
              </Checkbox>
            </Form.Item>

            {/* Submit */}
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
                {loading ? 'Signing in...' : 'Sign In →'}
              </Button>
            </Form.Item>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div style={{ flex: 1, height: '1px', background: '#2d3748' }} />
              <span style={{ color: '#4a5568', fontSize: '12px' }}>
                don't have an account?
              </span>
              <div style={{ flex: 1, height: '1px', background: '#2d3748' }} />
            </div>

            {/* Signup link */}
            <Button
              size="large"
              block
              onClick={() => router.push('/signup')}
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
              Create New Account
            </Button>

            {/* Role hint */}
            <div
              className="mt-5 p-3 rounded-lg flex gap-3"
              style={{ background: '#0f1117', border: '1px solid #2d3748' }}
            >
              <span style={{ fontSize: '16px' }}>💡</span>
              <p style={{ color: '#718096', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
                Login as <strong style={{ color: '#63b3ed' }}>Client</strong> to post jobs,{' '}
                <strong style={{ color: '#63b3ed' }}>Technician</strong> to apply for jobs, or{' '}
                <strong style={{ color: '#63b3ed' }}>Admin</strong> to manage the platform.
              </p>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;
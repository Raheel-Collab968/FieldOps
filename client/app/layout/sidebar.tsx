
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DashboardOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  ToolOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Badge, Avatar, Tooltip, Button } from 'antd';
import { deleteCookie } from 'cookies-next';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import white_logo from '../assets/white-logo.png';
import { useAppContext } from '../context/AppContext';

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

const routeKeyMap: Record<string, string> = {
  '/admin/AdminDashboard':  '1',
  '/admin/permissions':     '2',
  '/admin/jobs/view-all':   '3',
  '/admin/jobs/verify':     '4',
  '/admin/jobs/assign':     '12',
  '/admin/user':            '10',
  '/admin/settings':        '11',
  '/client/dashboard':      '9',
  '/client/jobs/create':    '5',
  '/client/jobs':           '13',
  '/technician/dashboard':  '8',
  '/technician/jobs/open':  '6',
  '/technician/jobs/applied': '7',
};

interface SidebarProps {
  content: React.ReactNode;
}

const sidebar: React.FC<SidebarProps> = ({ content }) => {
  const { role, isAdmin, isClient, isTechnician, user } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  const currentYear  = new Date().getFullYear();
  const selectedKeys = [routeKeyMap[pathname] || '1'];

  // ── Role badge color ─────────────────────────────────
  const roleBadgeStyle: React.CSSProperties = {
    fontSize:     '10px',
    fontWeight:   600,
    padding:      '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.5px',
    background: isAdmin
      ? 'rgba(99,179,237,0.15)'
      : isClient
      ? 'rgba(104,211,145,0.15)'
      : 'rgba(246,173,85,0.15)',
    color: isAdmin ? '#63b3ed' : isClient ? '#68d391' : '#f6ad55',
    border: `1px solid ${isAdmin ? '#2b6cb0' : isClient ? '#276749' : '#975a16'}`,
  };

  // ── Menu items ────────────────────────────────────────
  const items: MenuItem[] = [

    // ADMIN
    isAdmin ? getItem(
      <Link href="/admin/AdminDashboard">Dashboard</Link>, '1',
      <DashboardOutlined />
    ) : null,

    isAdmin ? getItem(
      <Link href="/admin/permissions">Permissions</Link>, '2',
      <SafetyOutlined />
    ) : null,

    isAdmin ? getItem('Jobs', 'sub1', <FileSearchOutlined />, [
      getItem(<Link href="/admin/jobs/view-all">All Jobs</Link>,  '3', <UnorderedListOutlined />),
      getItem(<Link href="/admin/jobs/verify">Verify Jobs</Link>, '4', <CheckCircleOutlined />),
      getItem(<Link href="/admin/jobs/assign">Assign Jobs</Link>, '12', <SolutionOutlined />),
    ]) : null,

    isAdmin ? getItem(
      <Link href="/admin/user">Users</Link>, '10',
      <TeamOutlined />
    ) : null,

    // CLIENT
    isClient ? getItem(
      <Link href="/client/dashboard">Dashboard</Link>, '9',
      <DashboardOutlined />
    ) : null,

    isClient ? getItem('Jobs', 'sub2', <FileSearchOutlined />, [
      getItem(<Link href="/client/jobs/create">Create Job</Link>, '5', <PlusCircleOutlined />),
      // getItem(<Link href="/client/jobs">My Jobs</Link>,          '13', <UnorderedListOutlined />),
    ]) : null,

    // TECHNICIAN
    isTechnician ? getItem(
      <Link href="/technician/dashboard">Dashboard</Link>, '8',
      <DashboardOutlined />
    ) : null,

    isTechnician ? getItem('Jobs', 'sub3', <ToolOutlined />, [
      getItem(<Link href="/technician/jobs/open">Open Jobs</Link>,       '6', <UnorderedListOutlined />),
      getItem(<Link href="/technician/jobs/applied">Applied Jobs</Link>, '7', <CheckCircleOutlined />),
    ]) : null,

  ].filter(Boolean) as MenuItem[];

  const handleLogout = () => {
    deleteCookie('token');
    router.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f1117' }}>

      {/* ── SIDEBAR ───────────────────────────────────── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={240}
        style={{
          background:  '#1a1f2e',
          borderRight: '1px solid #2d3748',
          display:     'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            padding:      collapsed ? '20px 12px' : '20px 20px',
            borderBottom: '1px solid #2d3748',
            transition:   'all 0.2s',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width:        '36px',
                height:       '36px',
                borderRadius: '8px',
                background:   'linear-gradient(135deg, #1a5276, #0e7490)',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                flexShrink:   0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            {!collapsed && (
              <div>
                <div style={{ color: '#f7fafc', fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>
                  FieldOps
                </div>
                <div style={{ color: '#4a5568', fontSize: '11px' }}>
                  Management Platform
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User info */}
        {!collapsed && (
          <div
            style={{
              padding:      '14px 20px',
              borderBottom: '1px solid #2d3748',
              background:   '#0f1117',
            }}
          >
            <div className="flex items-center gap-3">
              <Avatar
                size={36}
                style={{ background: 'linear-gradient(135deg, #1a5276, #0e7490)', flexShrink: 0 }}
              >
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  color:        '#e2e8f0',
                  fontSize:     '13px',
                  fontWeight:   600,
                  whiteSpace:   'nowrap',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {user?.name || 'User'}
                </div>
                <span style={roleBadgeStyle}>
                  {role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation label */}
        {!collapsed && (
          <div style={{ padding: '12px 20px 6px', color: '#4a5568', fontSize: '10px', fontWeight: 600, letterSpacing: '1px' }}>
            NAVIGATION
          </div>
        )}

        {/* Menu */}
        <Menu
          theme="dark"
          selectedKeys={selectedKeys}
          mode="inline"
          items={items}
          key={role}
          style={{
            background:  '#1a1f2e',
            border:      'none',
            flex:        1,
            paddingBottom: '8px',
          }}
        />

        {/* Logout at bottom */}
        <div
          style={{
            padding:   '12px',
            borderTop: '1px solid #2d3748',
          }}
        >
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <button
              onClick={handleLogout}
              style={{
                width:        '100%',
                display:      'flex',
                alignItems:   'center',
                gap:          '10px',
                padding:      '10px 12px',
                borderRadius: '8px',
                border:       'none',
                background:   'transparent',
                color:        '#fc8181',
                cursor:       'pointer',
                fontSize:     '14px',
                transition:   'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(252,129,129,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LogoutOutlined style={{ fontSize: '16px' }} />
              {!collapsed && <span style={{ fontWeight: 500 }}>Logout</span>}
            </button>
          </Tooltip>
        </div>
      </Sider>

      {/* ── MAIN LAYOUT ───────────────────────────────── */}
      <Layout style={{ background: '#f5f5f5' }}>

        {/* Top Header */}
        <div
          style={{
            height:        '60px',
            background:    '#ffffff',
            borderBottom:  '1px solid #e8e8e8',
            display:       'flex',
            alignItems:    'center',
            justifyContent: 'space-between',
            padding:       '0 20px',
            position:      'sticky',
            top:           0,
            zIndex:        100,
          }}
        >
          {/* Left — collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background:   'transparent',
              border:       '1px solid #e8e8e8',
              borderRadius: '8px',
              padding:      '6px 10px',
              cursor:       'pointer',
              color:        '#595959',
              fontSize:     '16px',
              display:      'flex',
              alignItems:   'center',
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>

          {/* Center — page breadcrumb */}
          <div style={{ color: '#718096', fontSize: '13px' }}>
            {pathname.split('/').filter(Boolean).map((p, i, arr) => (
              <span key={i}>
                <span style={{ color: i === arr.length - 1 ? '#1a1a1a' : '#8c8c8c', textTransform: 'capitalize' }}>
                  {p.replace(/-/g, ' ')}
                </span>
                {i < arr.length - 1 && <span style={{ margin: '0 6px', color: '#2d3748' }}>/</span>}
              </span>
            ))}
          </div>

          {/* Right — notifications + avatar */}
          <div className="flex items-center gap-3">
            <Tooltip title="Notifications">
              <Badge count={3} size="small">
                <button
                  style={{
                    background:   'transparent',
                    border:       '1px solid #e8e8e8',
                    borderRadius: '8px',
                    padding:      '6px 10px',
                    cursor:       'pointer',
                    color:        '#595959',
                    fontSize:     '16px',
                    display:      'flex',
                    alignItems:   'center',
                  }}
                >
                  <BellOutlined />
                </button>
              </Badge>
            </Tooltip>

            <Avatar
              size={34}
              style={{
                background: 'linear-gradient(135deg, #1a5276, #0e7490)',
                cursor:     'pointer',
                fontSize:   '13px',
                fontWeight: 600,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
          </div>
        </div>

        {/* Page Content */}
        <Content style={{ margin: '20px', minHeight: 'calc(100vh - 120px)' }}>
          <div
           style={{
          background:   '#ffffff',  // ← change this
          borderRadius: '12px',
          border:       '1px solid #e8e8e8',
          minHeight:    '100%',
          overflow:     'hidden',
        }}
          >
            <main className="p-5 md:p-6">
              {content}
            </main>
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign:  'center',
            background: '#ffffff',
            color:      '#8c8c8c',
            fontSize:   '12px',
            padding:    '12px',
            borderTop:  '1px solid #e8e8e8',
          }}
        >
          FieldOps &copy; {currentYear} — Built by Raheel Ahmed
        </Footer>
      </Layout>
    </Layout>
  );
};

export default sidebar;
import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space } from 'antd';
import { Outlet, useLocation, Link } from "react-router-dom";
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
import { logoutAPI } from '@/services/api';
import './layout.admin.dark.scss'; // ✅ thêm scss dark theme

type MenuItem = Required<MenuProps>['items'][number];
const { Content, Footer, Sider } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const { user, setUser, setIsAuthenticated, isAuthenticated, setCarts } = useCurrentApp();
    const location = useLocation();

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />,
        },
        {
            label: <Link to='/admin/book'>Quản lý sách</Link>,
            key: '/admin/book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Quản lý đơn hàng</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },
        {
            label: <Link to='/admin/category'>Quản lý danh mục</Link>,
            key: '/admin/category',
            icon: <TeamOutlined />
        },
    ];

    useEffect(() => {
        const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
        setActiveMenu(active.key);
    }, [location]);

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.data) {
            setUser(null);
            setCarts([]);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
            localStorage.removeItem("carts");
        }
    };

    const itemsDropdown = [
        {
            label: <Link to="/">Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
        },
    ];

    if (isAuthenticated === false) return <Outlet />;

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") return <Outlet />;
    }

    return (
        <Layout className="layout-admin-dark">
            <Sider
                theme="dark"
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                className="admin-sider"
            >
                <div className="admin-logo">
                    <span>{collapsed ? 'A' : 'Admin Panel'}</span>
                </div>
                <Menu
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                    className="admin-menu"
                />
            </Sider>

            <Layout>
                <div className="admin-header">
                    <span className="collapse-btn">
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <Space className="admin-user">
                            {user?.fullName}
                        </Space>
                    </Dropdown>
                </div>

                <Content className="admin-content">
                    <Outlet />
                </Content>

                <Footer className="admin-footer">
                    Trần Xuân Hà Admin <HeartTwoTone twoToneColor="#ff4d4f" />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;

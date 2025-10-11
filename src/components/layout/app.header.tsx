import { useState } from "react";
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import {
    Divider,
    Badge,
    Drawer,
    Popover,
    Empty,
    Dropdown,
    Space,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import { logoutAPI } from "@/services/api";
import ManageAccount from "../client/account";
import { isMobile } from "react-device-detect";
import "./app.header.dark.scss";

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const { isAuthenticated, user, setUser, setIsAuthenticated, carts, setCarts } =
        useCurrentApp();

    const navigate = useNavigate();

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

    let items = [
        {
            label: (
                <label style={{ cursor: "pointer" }} onClick={() => setOpenManageAccount(true)}>
                    Quản lý tài khoản
                </label>
            ),
            key: "account",
        },
        {
            label: <Link to="/history">Lịch sử mua hàng</Link>,
            key: "history",
        },
        {
            label: (
                <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
                    Đăng xuất
                </label>
            ),
            key: "logout",
        },
    ];
    // @ts-expect-error
    if (user?.role.name === "SUPER_ADMIN") {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: "admin",
        });
    }

    const contentPopover = () => (
        <div className="pop-cart-body">
            <div className="pop-cart-content">
                {carts?.map((book, index) => (
                    <div className="book" key={`book-${index}`}>
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`}
                        />
                        <div className="book-info">
                            <div className="title">{book?.detail?.name}</div>
                            <div className="price">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(book?.detail?.price ?? 0)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {carts.length > 0 ? (
                <div className="pop-cart-footer">
                    <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
                </div>
            ) : (
                <Empty description="Không có sản phẩm trong giỏ hàng" />
            )}
        </div>
    );

    return (
        <>
            <header className="app-header">
                <div className="header-inner">
                    <div className="left">
                        <div className="menu-toggle" onClick={() => setOpenDrawer(true)}>
                            ☰
                        </div>
                        <div className="logo" onClick={() => navigate("/")}>
                            <FaReact className="icon-react" />
                            <span>Trần Xuân Hà</span>
                        </div>
                    </div>

                    <div className="center">
                        <div className="search-box">
                            <VscSearchFuzzy className="icon-search" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sách..."
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="right">
                        {!isMobile ? (
                            <Popover
                                placement="bottomRight"
                                content={contentPopover}
                                overlayClassName="popover-carts"
                                title="Sản phẩm mới thêm"
                            >
                                <Badge count={carts?.length ?? 0} size="small" showZero>
                                    <FiShoppingCart className="icon-cart" />
                                </Badge>
                            </Popover>
                        ) : (
                            <Badge
                                count={carts?.length ?? 0}
                                size="small"
                                showZero
                                onClick={() => navigate("/order")}
                            >
                                <FiShoppingCart className="icon-cart" />
                            </Badge>
                        )}

                        <Divider type="vertical" className="divider" />

                        {!isAuthenticated ? (
                            <span className="login-btn" onClick={() => navigate("/login")}>
                                Đăng nhập / Đăng ký
                            </span>
                        ) : (
                            <Dropdown menu={{ items }} trigger={["click"]}>
                                <Space className="user-menu">{user?.fullName}</Space>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </header>

            {/* Drawer (mobile) */}
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                className="drawer-dark"
            >
                <p onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</p>
                <Divider />
                <p onClick={() => handleLogout()}>Đăng xuất</p>
                <Divider />
            </Drawer>

            {/* Modal quản lý tài khoản */}
            <ManageAccount
                isModalOpen={openManageAccount}
                setIsModalOpen={setOpenManageAccount}
            />
        </>
    );
};

export default AppHeader;

import { Modal, Tabs } from "antd";
import UserInfo from "./user.info";
import ChangePassword from "./change.password";
import "./account.dark.scss";

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
}

const ManageAccount = (props: IProps) => {
    const { isModalOpen, setIsModalOpen } = props;

    const items = [
        {
            key: "info",
            label: `Cập nhật thông tin`,
            children: <UserInfo />,
        },
        {
            key: "password",
            label: `Đổi mật khẩu`,
            children: <ChangePassword />,
        },
    ];

    return (
        <Modal
            title={<span style={{ color: "#f0f0f0" }}>Quản lý tài khoản</span>}
            open={isModalOpen}
            footer={null}
            onCancel={() => setIsModalOpen(false)}
            maskClosable={false}
            width={"60vw"}
            className="modal-account-dark"
        >
            <Tabs defaultActiveKey="info" items={items} />
        </Modal>
    );
};

export default ManageAccount;

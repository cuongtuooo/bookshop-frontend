import { useCurrentApp } from "@/components/context/app.context";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, Input, Row, Upload, Card } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { updateUserInfoAPI, uploadFileAPI } from "@/services/api";
import type { UploadFile } from "antd";

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    avatar: string;
};

const UserInfo = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useCurrentApp();
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user._id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                // @ts-ignore
                role: user.role._id,
            });
        }
    }, [user]);

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await uploadFileAPI(file, "avatar");

        if (res && res.data) {
            const newAvatar = res.data.fileName;
            setUserAvatar(newAvatar);
            if (onSuccess) onSuccess("ok");
        } else {
            message.error(res.message);
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status === "done") {
                message.success(`Upload file thành công`);
            } else if (info.file.status === "error") {
                message.error(`Upload file thất bại`);
            }
        },
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { fullName, phone, _id, role, email, avatar } = values;
        setIsSubmit(true);
        const res = await updateUserInfoAPI(_id, avatar, email, fullName, phone, role);

        if (res && res.data) {
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone,
            });
            message.success("Cập nhật thông tin user thành công");
            localStorage.removeItem("access_token");
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <div className="account-container">
            <Row gutter={[30, 30]}>
                {/* <Col sm={24} md={10} className="account-avatar">
                    <Card bordered={false} className="card-dark">
                        <Avatar
                            size={160}
                            icon={<AntDesignOutlined />}
                            src={urlAvatar}
                            shape="circle"
                            className="avatar-glow"
                        />
                        <Upload {...propsUpload}>
                            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                        </Upload>
                    </Card>
                </Col> */}

                <Col sm={24}>
                    <Card bordered={false} className="card-dark">
                        <Form onFinish={onFinish} form={form} name="user-info" autoComplete="off" layout="vertical">
                            <Form.Item<FieldType> hidden name="_id">
                                <Input hidden />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Email không được để trống!" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Tên hiển thị"
                                name="fullName"
                                rules={[{ required: true, message: "Tên hiển thị không được để trống!" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: "Số điện thoại không được để trống!" }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Vai trò"
                                name="role"
                                rules={[{ required: true, message: "Vai trò không được để trống!" }]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Button type="primary" loading={isSubmit} onClick={() => form.submit()}>
                                Cập nhật
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default UserInfo;

import { useCurrentApp } from "@/components/context/app.context";
import { updateUserPasswordAPI } from "@/services/api";
import { App, Button, Col, Form, Input, Row, Card } from "antd";
import { useEffect, useState } from "react";
import type { FormProps } from "antd";

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
};

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { user } = useCurrentApp();
    const { message, notification } = App.useApp();

    useEffect(() => {
        if (user) {
            form.setFieldValue("email", user.email);
        }
    }, [user]);

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        const { email, oldpass, newpass } = values;
        setIsSubmit(true);
        const res = await updateUserPasswordAPI(email, oldpass, newpass);
        if (res && res.data) {
            message.success("Cập nhật mật khẩu thành công");
            form.setFieldValue("oldpass", "");
            form.setFieldValue("newpass", "");
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
            <Row justify="center">
                <Col xs={24} sm={20} md={14}>
                    <Card bordered={false} className="card-dark">
                        <Form name="change-password" onFinish={onFinish} autoComplete="off" form={form} layout="vertical">
                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Email không được để trống!" }]}
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Mật khẩu hiện tại"
                                name="oldpass"
                                rules={[{ required: true, message: "Mật khẩu hiện tại không được để trống!" }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Mật khẩu mới"
                                name="newpass"
                                rules={[{ required: true, message: "Mật khẩu mới không được để trống!" }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Xác nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;

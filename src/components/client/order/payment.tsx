import { App, Button, Col, Divider, Form, Radio, Row, Space, Input } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import type { FormProps } from "antd";
import { createOrderAPI } from "@/services/api";
import { isMobile } from "react-device-detect";
import "styles/order.dark.scss";

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";
type FieldType = { fullName: string; phone: string; address: string; method: UserMethod };
interface IProps { setCurrentStep: (v: number) => void; }

const Payment = ({ setCurrentStep }: IProps) => {
    const { carts, setCarts, user } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const [paymentMethod, setPaymentMethod] = useState<UserMethod>("COD"); // ✅ mặc định COD
    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                method: "COD",
            });
        }
    }, [user]);

    useEffect(() => {
        const sum = carts?.reduce((a, b) => a + b.quantity * b.detail.price, 0) || 0;
        setTotalPrice(sum);
    }, [carts]);

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter((i) => i._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    };

    const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
        const { address, fullName, method, phone } = values;
        const detail = carts.map((i) => ({
            _id: i._id,
            quantity: i.quantity,
            bookName: i.detail.mainText,
        }));
        setIsSubmit(true);
        const res = await createOrderAPI(fullName, address, phone, totalPrice, method, detail);
        if (res?.data) {
            localStorage.removeItem("carts");
            setCarts([]);
            message.success("Mua hàng thành công!");
            setCurrentStep(2);
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: Array.isArray(res.message) ? res.message[0] : res.message,
            });
        }
        setIsSubmit(false);
    };

    return (
        <div className="order-container-dark">
            <Row gutter={[20, 20]}>
                <Col md={16} xs={24}>
                    {carts?.map((item, i) => (
                        <div key={`cart-${i}`} className="order-book-dark">
                            <div className="book-content-dark">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                                />
                                <div className="title">{item.detail.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.detail.price)}
                                </div>
                            </div>
                            <div className="action-dark">
                                <span>Số lượng: {item.quantity}</span>
                                <div className="sum">
                                    Tổng:{" "}
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.detail.price * item.quantity)}
                                </div>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    onClick={() => handleRemoveBook(item._id)}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="back-btn" onClick={() => setCurrentStep(0)}>
                        ← Quay trở lại giỏ hàng
                    </div>
                </Col>

                <Col md={8} xs={24}>
                    <Form
                        form={form}
                        name="payment-form"
                        onFinish={handlePlaceOrder}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <div className="order-sum-dark">
                            <Form.Item<FieldType> label="Hình thức thanh toán" name="method">
                                <Radio.Group
                                    onChange={(e) => setPaymentMethod(e.target.value)} // ✅ cập nhật state
                                    value={paymentMethod}
                                >
                                    <Space direction="vertical">
                                        <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                                        <Radio value="BANKING">Chuyển khoản ngân hàng</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {/* ✅ Chỉ hiện QR khi chọn “BANKING” */}
                            {paymentMethod === "BANKING" && (
                                <div
                                    style={{
                                        marginBottom: 20,
                                        textAlign: "center",
                                        padding: 10,
                                        border: "1px solid #444",
                                        borderRadius: 8,
                                        background: "#111",
                                    }}
                                >
                                    <div style={{ color: "#ccc", marginBottom: 8 }}>
                                        Quét mã QR để chuyển khoản
                                    </div>
                                    <img
                                        src="/qrbank.png" // 🔁 đổi thành đường dẫn QR thật
                                        alt="QR Thanh toán"
                                        style={{ width: 200, borderRadius: 8 }}
                                    />
                                    <div style={{ color: "#ccc", marginTop: 8 }}>
                                        <b>Ngân hàng:</b> Mbbank<br />
                                        <b>STK:</b> 0369055930  <br />
                                        <b>Chủ TK:</b> Trần Xuân hà<br />
                                        {/* <b>Nội dung:</b> Thanh toán đơn hàng #{Math.floor(Math.random() * 1000)} */}
                                    </div>
                                </div>
                            )}

                            <Form.Item<FieldType>
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: "Họ tên không được để trống!" }]}
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
                                label="Địa chỉ nhận hàng"
                                name="address"
                                rules={[{ required: true, message: "Địa chỉ không được để trống!" }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>

                            <div className="calculate">
                                <span>Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider />
                            <div className="calculate">
                                <span>Tổng tiền</span>
                                <span className="sum-final">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(totalPrice)}
                                </span>
                            </div>
                            <Divider />
                            <Button type="primary" htmlType="submit" loading={isSubmit}>
                                Đặt hàng ({carts.length})
                            </Button>
                        </div>
                    </Form>

                </Col>
            </Row>
        </div>
    );
};

export default Payment;

import { App, Button, Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import "styles/order.dark.scss";
import { isMobile } from "react-device-detect";

interface IProps {
    setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, setCarts } = useCurrentApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const { message } = App.useApp();

    useEffect(() => {
        if (carts?.length) {
            const sum = carts.reduce((a, b) => a + b.quantity * b.detail.price, 0);
            setTotalPrice(sum);
        } else setTotalPrice(0);
    }, [carts]);

    const handleOnChangeInput = (value: number, book: IBookTable) => {
        if (!value || +value < 1) return;
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && book) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const idx = carts.findIndex((c) => c._id === book?._id);
            if (idx > -1) carts[idx].quantity = +value;
            localStorage.setItem("carts", JSON.stringify(carts));
            setCarts(carts);
        }
    };

    const handleRemoveBook = (_id: string) => {
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const newCarts = carts.filter((item) => item._id !== _id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    };

    const handleNextStep = () => {
        if (!carts.length) {
            message.error("Không tồn tại sản phẩm trong giỏ hàng.");
            return;
        }
        setCurrentStep(1);
    };

    return (
        <div className="order-container-dark">
            <Row gutter={[20, 20]}>
                <Col md={18} xs={24}>
                    {carts?.map((item, index) => {
                        const price = item.detail.price ?? 0;
                        const sum = price * (item.quantity ?? 0);
                        return (
                            <div
                                className="order-book-dark"
                                key={`book-${index}`}
                                style={isMobile ? { flexDirection: "column" } : {}}
                            >
                                <div className="book-content-dark">
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail
                                            }`}
                                    />
                                    <div className="title">{item.detail.mainText}</div>
                                    <div className="price">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(price)}
                                    </div>
                                </div>

                                <div className="action-dark">
                                    <InputNumber
                                        value={item.quantity}
                                        onChange={(v) => handleOnChangeInput(v as number, item.detail)}
                                    />
                                    <div className="sum">
                                        Tổng:{" "}
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(sum)}
                                    </div>
                                    <DeleteTwoTone
                                        twoToneColor="#ff4d4f"
                                        onClick={() => handleRemoveBook(item._id)}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {carts.length === 0 && (
                        <Empty description="Không có sản phẩm trong giỏ hàng" />
                    )}
                </Col>

                <Col md={6} xs={24}>
                    <div className="order-sum-dark">
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
                        <Button type="primary" onClick={() => handleNextStep()}>
                            Mua hàng ({carts.length})
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default OrderDetail;

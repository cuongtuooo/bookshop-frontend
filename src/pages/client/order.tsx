import { Breadcrumb, Button, Result, Steps } from "antd";
import { useState } from "react";
import OrderDetail from "@/components/client/order";
import Payment from "@/components/client/order/payment";
import "styles/order.dark.scss";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

const OrderPage = () => {
    const [currentStep, setCurrentStep] = useState<number>(0);

    return (
        <div style={{ background: "#0f0f0f", padding: "20px 0", minHeight: "100vh" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: "0 auto" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Trang Chủ</Link>,
                        },
                        {
                            title: "Chi Tiết Giỏ Hàng",
                        },
                    ]}
                />

                {!isMobile && (
                    <div className="order-steps" style={{ marginTop: 10 }}>
                        <Steps
                            size="small"
                            current={currentStep}
                            items={[
                                { title: "Đơn hàng" },
                                { title: "Đặt hàng" },
                                { title: "Thanh toán" },
                            ]}
                        />
                    </div>
                )}

                {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}

                {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}

                {currentStep === 2 && (
                    <Result
                        status="success"
                        title="Đặt hàng thành công"
                        subTitle="Hệ thống đã ghi nhận thông tin đơn hàng của bạn."
                        extra={[
                            <Button key="home" type="primary">
                                <Link to={"/"}>Trang Chủ</Link>
                            </Button>,
                            <Button key="history" type="default">
                                <Link to={"/history"}>Lịch sử mua hàng</Link>
                            </Button>,
                        ]}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderPage;

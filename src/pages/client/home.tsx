import { useEffect, useState } from "react";
import { getBooksAPI, getCategoryAPI } from "@/services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    Row, Col, Form, Checkbox, Divider, InputNumber,
    Button, Rate, Tabs, Pagination, Spin, Drawer, Card
} from "antd";
import type { FormProps } from "antd";
import {
    FilterOutlined,
    ReloadOutlined,
    StarOutlined,
    FireOutlined
} from "@ant-design/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./home.new.scss";

type FieldType = {
    range: { from: number; to: number };
    category: string[];
};

const HomePage = () => {
    const [searchTerm] = useOutletContext() as any;

    const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
    const [showFilter, setShowFilter] = useState<boolean>(false);

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const initCategory = async () => {
            const res = await getCategoryAPI();
            if (res && res.data) {
                const d = res.data.result.map((item: any) => {
                    return { label: item.name, value: item._id };
                });
                setListCategory(d);
            }
        };
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, searchTerm]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) query += `&${filter}`;
        if (sortQuery) query += `&${sortQuery}`;
        if (searchTerm) query += `&name=/${searchTerm}/i`;

        const res = await getBooksAPI(query);
        if (res && res.data) {
            setListBook(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsLoading(false);
    };

    const handleOnchangePage = (p: number, s: number) => {
        setCurrent(p);
        setPageSize(s);
    };

    const handleChangeFilter = (changedValues: any, values: any) => {
        if (changedValues.category) {
            const cate = values.category;
            if (cate && cate.length > 0) {
                const f = cate.join(",");
                setFilter(`category=${f}`);
            } else {
                setFilter("");
            }
        }
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price>=${values.range.from}&price<=${values.range.to}`;
            if (values?.category?.length) {
                const cate = values.category.join(",");
                f += `&category=${cate}`;
            }
            setFilter(f);
        }
    };

    const items = [
        { key: "sort=-sold", label: `Phổ biến`, children: <></> },
        { key: "sort=-updatedAt", label: `Hàng Mới`, children: <></> },
        { key: "sort=price", label: `Giá Thấp → Cao`, children: <></> },
        { key: "sort=-price", label: `Giá Cao → Thấp`, children: <></> },
    ];

    // banner
    const bannerList = [
        { title: "Khuyến mãi tháng 10", img: "/banner/baner1.jpg" },
        { title: "Sách mới ra mắt", img: "/banner/baner2.jpg" },
        { title: "Top best-seller", img: "/banner/baner3.png" },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        autoplay: true,
        slidesToShow: 1,
        arrows: false,
    };

    return (
        <div className="homepage-new">
            {/* Banner */}
            <div className="hero-banner">
                <Slider {...settings}>
                    {bannerList.map((b, i) => (
                        <div key={i} className="banner-slide">
                            <img src={b.img} alt={b.title} />
                            <div className="banner-text">
                                <h2>{b.title}</h2>
                                {/* <Button type="primary" size="large">
                                    Khám phá ngay
                                </Button> */}
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="homepage-container">
                {/* Category */}
                <div className="category-section">
                    <h3>Danh mục nổi bật</h3>
                    <Row gutter={[10, 10]}>
                        {listCategory.slice(0, 6).map((c, i) => (
                            <Col key={i} xs={12} sm={8} md={4}>
                                <Card
                                    hoverable
                                    className="category-card"
                                    onClick={() => setFilter(`category=${c.value}`)}
                                >
                                    {c.label}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Book list */}
                <Spin spinning={isLoading}>
                    <div className="book-section">
                        <div className="section-header">
                            <h3><FireOutlined /> Danh sách sách</h3>
                            <Button icon={<FilterOutlined />} onClick={() => setShowFilter(true)}>
                                Bộ lọc
                            </Button>
                        </div>

                        <Tabs
                            defaultActiveKey="sort=-sold"
                            items={items}
                            onChange={(value) => setSortQuery(value)}
                        />

                        <Row gutter={[20, 20]}>
                            {listBook.map((item, index) => (
                                <Col xs={12} sm={8} md={6} lg={4} key={index}>
                                    <Card
                                        hoverable
                                        className="book-card"
                                        cover={
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`}
                                                alt={item.name}
                                            />
                                        }
                                        onClick={() => navigate(`/book/${item._id}`)}
                                    >
                                        <div className="book-info">
                                            <h4 className="book-title">{item.name}</h4>
                                            <div className="book-price">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(item?.price ?? 0)}
                                            </div>
                                            <div className="book-rating">
                                                <Rate value={5} disabled style={{ fontSize: 12 }} />
                                                <span><StarOutlined /> {item?.sold ?? 0} đã bán</span>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div className="pagination-wrapper">
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={handleOnchangePage}
                            />
                        </div>
                    </div>
                </Spin>
            </div>

            {/* Drawer filter */}
            <Drawer
                title="Bộ lọc tìm kiếm"
                placement="right"
                onClose={() => setShowFilter(false)}
                open={showFilter}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    onValuesChange={(changedValues, values) =>
                        handleChangeFilter(changedValues, values)
                    }
                >
                    <Form.Item name="category" label="Danh mục" labelCol={{ span: 24 }}>
                        <Checkbox.Group>
                            <Row>
                                {listCategory?.map((item, index) => (
                                    <Col span={24} key={index} style={{ padding: "5px 0" }}>
                                        <Checkbox value={item.value}>{item.label}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                        <Row gutter={[10, 10]}>
                            <Col span={12}>
                                <Form.Item name={["range", "from"]}>
                                    <InputNumber min={0} placeholder="Từ" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name={["range", "to"]}>
                                    <InputNumber min={0} placeholder="Đến" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button onClick={() => form.submit()} style={{ width: "100%" }} type="primary">
                            Áp dụng
                        </Button>
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Đánh giá" labelCol={{ span: 24 }}>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star}>
                                <Rate value={star} disabled style={{ color: "#ffce3d", fontSize: 15 }} />
                                <span> trở lên</span>
                            </div>
                        ))}
                    </Form.Item>
                </Form>
                <Divider />
                <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setFilter("");
                    }}
                >
                    Reset
                </Button>
            </Drawer>
        </div>
    );
};

export default HomePage;

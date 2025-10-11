import { Row, Col, Rate, Divider, App, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import './book.dark.scss';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
    currentBook: IBookTable | null;
}

type UserAction = "MINUS" | "PLUS";

const BookDetail = (props: IProps) => {
    const { currentBook } = props;
    const [imageGallery, setImageGallery] = useState<any[]>([]);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);
    const [currentQuantity, setCurrentQuantity] = useState<number>(1);

    const { setCarts, user } = useCurrentApp();
    const { message } = App.useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentBook) {
            const images = [];
            if (currentBook.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image"
                });
            }
            if (currentBook.slider) {
                currentBook.slider.map(item => {
                    images.push({
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    });
                });
            }
            setImageGallery(images);
        }
    }, [currentBook]);

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    };

    const handleChangeButton = (type: UserAction) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS' && currentBook) {
            if (currentQuantity === +currentBook.quantity) return;
            setCurrentQuantity(currentQuantity + 1);
        }
    };

    const handleChangeInput = (value: string) => {
        if (!isNaN(+value)) {
            if (+value > 0 && currentBook && +value < +currentBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    };

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này.");
            return;
        }

        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const isExistIndex = carts.findIndex(c => c._id === currentBook?._id);
            if (isExistIndex > -1) {
                carts[isExistIndex].quantity += currentQuantity;
            } else {
                carts.push({
                    quantity: currentQuantity,
                    _id: currentBook._id,
                    detail: currentBook
                });
            }
            localStorage.setItem("carts", JSON.stringify(carts));
            setCarts(carts);
        } else {
            const data = [{
                _id: currentBook?._id!,
                quantity: currentQuantity,
                detail: currentBook!
            }];
            localStorage.setItem("carts", JSON.stringify(data));
            setCarts(data);
        }

        if (isBuyNow) navigate("/order");
        else message.success("Thêm sản phẩm vào giỏ hàng thành công.");
    };

    return (
        <div className="book-detail-page">
            <div className='view-detail-book'>
                <Breadcrumb
                    separator=">"
                    items={[
                        { title: <Link to={"/"}>Trang Chủ</Link> },
                        { title: 'Chi tiết sách' },
                    ]}
                />
                <div className="book-detail-container">
                    <Row gutter={[30, 30]}>
                        {/* Hình ảnh */}
                        <Col md={10} xs={24}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={handleOnClickImage}
                            />
                        </Col>

                        {/* Thông tin sách */}
                        <Col md={14} xs={24}>
                            <h1 className="book-title">{currentBook?.name}</h1>
                            <div className='book-meta'>
                                <div>Tác giả: <a>{currentBook?.author}</a></div>
                                <div>Nội dung chính: {currentBook?.mainText}</div>
                            </div>

                            <div className='rating'>
                                <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 14 }} />
                                <Divider type="vertical" />
                                <span>Đã bán {currentBook?.sold ?? 0}</span>
                            </div>

                            <div className='price'>
                                <span className='currency'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                </span>
                            </div>

                            <Divider />
                            <div className='delivery'>
                                <span className='label'>Vận chuyển</span>
                                <span className='value'>Miễn phí vận chuyển</span>
                            </div>

                            <div className='quantity'>
                                <span className='label'>Số lượng</span>
                                <div className='control'>
                                    <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                    <input value={currentQuantity} onChange={(e) => handleChangeInput(e.target.value)} />
                                    <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                </div>
                            </div>

                            <Divider />
                            <div className='desc'>
                                <h3>Mô tả</h3>
                                <p>{currentBook?.desc}</p>
                            </div>

                            {/* 👉 Nút mua đặt ở cuối */}
                            <div className='buy'>
                                <button className='cart' onClick={() => handleAddToCart()}>
                                    <BsCartPlus className='icon-cart' />
                                    <span>Thêm vào giỏ hàng</span>
                                </button>
                                <button onClick={() => handleAddToCart(true)} className='now'>
                                    Mua ngay
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div>
    );
};

export default BookDetail;

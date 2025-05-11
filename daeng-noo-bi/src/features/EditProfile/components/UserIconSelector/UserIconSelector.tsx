import { useState } from "react"
import { useAuth } from "../../../../shared/context/AuthContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode } from "swiper/modules";
import "./UserIconSelector.scss"


interface UserIconSelectorProps {
    initialIconNumber?: number;
}

const UserIconSelector = ({ initialIconNumber }: UserIconSelectorProps) => {
    const { updateUserIcon } = useAuth();
    const icons = Array.from({ length: 9 }, (_, i) => `/userIcon_${i + 1}.png`);
    const [selectedIcon, setSelectedIcon] = useState<number | null>(
        initialIconNumber ?? null
    );
    const [isOpen, setIsOpen] = useState(false);
    const currentSrc = selectedIcon
        ? icons[selectedIcon - 1]
        : '/userIcon.png'; // public/userIcon.png

    return (
        <div className="UserIconSelector">
            {/* 현재 아이콘 */}
            <img
                src={currentSrc}
                alt="사용자 아이콘"
                className="selected-icon"
                onClick={() => setIsOpen(o => !o)}
            />
            {/* 아이콘 선택창 */}
            {isOpen && (
                <div className="icon-list">
                    <Swiper
                        modules={[FreeMode]}
                        freeMode={true}
                        spaceBetween={1}
                        slidesPerView="auto"
                        className="icon-swiper"
                    >
                        {icons.map((src, idx) => (
                            <SwiperSlide key={idx} className="icon-slide">
                                <img
                                    src={src}
                                    alt={`아이콘 ${idx + 1}`}
                                    onClick={() => {
                                        const num = idx + 1;
                                        setSelectedIcon(num);
                                        setIsOpen(false);
                                        updateUserIcon(num);
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    )
}

export default UserIconSelector
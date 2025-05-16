import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../../../shared/context/AuthContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FreeMode } from "swiper/modules";
import "./UserIconSelector.scss"

const UserIconSelector = () => {
    const { updateUserIcon, user } = useAuth();
    const icons = Array.from({ length: 9 }, (_, i) => `/userIcon_${i + 1}.png`);
    const [selectedIcon, setSelectedIcon] = useState<number | null>(
        user!.icon ?? null
    );
    const [isOpen, setIsOpen] = useState(false);
    const currentSrc = selectedIcon
        ? icons[selectedIcon - 1]
        : '/userIcon.png';

    const iconRef = useRef<HTMLButtonElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (!isOpen && iconRef.current) {
            // isOpen이 false가 되면 항상 기본 클래스명으로 리셋
            iconRef.current.className = 'icon-wrapper';
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="UserIconSelector" ref={wrapperRef}>
            <label>아이콘 변경</label>
            <button
                className="icon-wrapper"
                ref={iconRef}
                onClick={() => {
                    setIsOpen(o => !o);
                    iconRef.current!.className = 'icon-wrapper active';
                }}
            >
                {/* 현재 아이콘 */}
                <img
                    src={currentSrc}
                    alt="현재 아이콘"
                    className="selected-icon"
                />
            </button>


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
                                <button
                                    type="button"
                                    className="icon-button"
                                    onClick={() => {
                                        const num = idx + 1;
                                        setSelectedIcon(num);
                                        updateUserIcon(num);
                                        setIsOpen(false);
                                        iconRef.current!.className = 'icon-wrapper';
                                    }}
                                >
                                    <img src={src} alt={`아이콘 ${idx + 1}`} />
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    )
}

export default UserIconSelector
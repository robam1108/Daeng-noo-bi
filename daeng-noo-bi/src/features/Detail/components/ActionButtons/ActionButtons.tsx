// src/pages/Detail/components/ActionButtons.tsx
import React, { useEffect, useState } from 'react';
import HeartButton from '../HeartButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import './ActionButtons.scss';

interface ActionButtonsProps {
    /** 현재 즐겨찾기 상태 */
    isActive: boolean;
    /** 찜 토글 핸들러 */
    onToggleFavorite: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ isActive, onToggleFavorite }) => {
    /** 초기 툴팁 보이기 여부 */
    const [showInitialTip, setShowInitialTip] = useState(true);
    /** 버튼별 토스트 상태 */
    const [favToast, setFavToast] = useState<string | null>(null);
    const [shareToast, setShareToast] = useState(false);

    // 페이지 진입 후 2초 뒤에 초기 툴팁 숨기기
    useEffect(() => {
        const timer = setTimeout(() => setShowInitialTip(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // 찜 버튼 클릭
    const handleFavorite = () => {
        onToggleFavorite();
        // 클릭 전 isActive가 old 상태이므로, 반대 메시지 설정
        setFavToast(isActive ? '찜삭제' : '찜완료');
        setTimeout(() => setFavToast(null), 700);
    };

    // 공유 버튼 클릭
    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 700);
    };

    return (
        <div className="ActionButtons">
            {/* 찜 버튼 래퍼 */}
            <div className="button-wrapper">
                <HeartButton isActive={isActive} onClick={handleFavorite} />
                {showInitialTip && <div className="tooltip">찜하기</div>}
                {favToast && <div className="toast heart">{favToast}</div>}
            </div>

            {/* 공유 버튼 래퍼 */}
            <div className="button-wrapper">
                <button
                    className="share-button"
                    onClick={handleShare}
                    aria-label="URL 복사하기"
                >
                    <FontAwesomeIcon icon={faLink} />
                </button>
                {shareToast && <div className="toast share">복사완료</div>}
            </div>
        </div>
    );
};

export default ActionButtons;

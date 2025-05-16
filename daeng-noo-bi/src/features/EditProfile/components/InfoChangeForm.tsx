import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import UserIconSelector from "./UserIconSelector/UserIconSelector";


const InfoChangeForm: React.FC = () => {
    const { updateNickname, user } = useAuth();

    const [nickname, setNickname] = useState(user!.nickname!);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const btnRef = useRef<HTMLButtonElement>(null);

    // 닉네임 입력이 바뀔 때마다 이전 성공 메시지 초기화
    useEffect(() => {
        setSuccessMsg(null);
    }, [nickname]);

    const handleChange = async () => {
        const trimmed = nickname.trim();
        if (!trimmed || trimmed === user!.nickname) return;

        setLoading(true);
        try {
            await updateNickname(trimmed);
            setSuccessMsg("닉네임이 성공적으로 변경되었습니다.");
        } catch (err) {
            console.error(err);
        } finally {
            btnRef.current!.className = "verify-btn";
            setLoading(false);
        }
    };

    return (
        <div className="InfoChangeForm">
            {/* 프로필 사진 선택기 */}
            <UserIconSelector />

            {/* 닉네임 입력 + 변경 버튼 (이메일 verify 레이아웃과 동일) */}
            <div className="verifyWrap">
                <div className="verify-group">
                    <input
                        type="text"
                        className="verify-input"
                        placeholder="새 닉네임 입력"
                        value={nickname}
                        onChange={(e) => {
                            btnRef.current!.className = "verify-btn active";
                            setNickname(e.target.value)
                        }}
                        disabled={loading}
                        aria-describedby="nick-msg"
                    />
                </div>
                <button
                    type="button"
                    ref={btnRef}
                    className='verify-btn'
                    onClick={handleChange}
                    disabled={
                        loading ||
                        !nickname.trim() ||
                        nickname.trim() === user!.nickname
                    }
                >
                    {loading ? "변경 중..." : "변경"}
                </button>
            </div>

            {/* 성공 메시지 */}
            <p
                id="nick-msg"
                className="dup-msg success"
            >
                {successMsg ?? "\u00A0"}
            </p>
        </div>
    );
};

export default InfoChangeForm;

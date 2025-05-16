import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import UserIconSelector from "./UserIconSelector/UserIconSelector";

const InfoChangeForm: React.FC = () => {
  const { updateNickname, user } = useAuth();
  const [nickname, setNickname] = useState(user!.nickname!);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isChanged = nickname.trim() !== "" && nickname.trim() !== user!.nickname;
  const isEnabled = isChanged && !loading;
  const [showActive, setShowActive] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNickname(user!.nickname!);
  }, [user!.nickname]);

  useEffect(() => {
    setSuccessMsg(null);
  }, [nickname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowActive(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async () => {
    if (!isEnabled) return;
    setLoading(true);
    try {
      await updateNickname(nickname.trim());
      setSuccessMsg("닉네임이 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowActive(false);
    }
  };

  return (
    <div className="InfoChangeForm" ref={wrapperRef}>
      <UserIconSelector />
      <div className="verifyWrap">
        <div className="verify-group">
          <input
            type="text"
            className="verify-input"
            placeholder="새 닉네임 입력"
            value={nickname}
            onFocus={() => setShowActive(true)}
            onChange={(e) => {
              setNickname(e.target.value);
              setShowActive(true);
            }}
            disabled={loading}
            aria-describedby="nick-msg"
          />
        </div>
        <button
          type="button"
          className={`verify-btn ${isEnabled && showActive ? "active" : ""}`}
          onClick={handleChange}
          disabled={!(isEnabled && showActive)}
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

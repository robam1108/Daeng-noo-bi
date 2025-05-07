import React, { Fragment, ReactNode } from "react";
import {
    DetailIntroResponse,
    DetailIntroTourist,
    DetailIntroCulture,
    DetailIntroLeports,
    DetailIntroStay,
    DetailIntroShopping,
} from "../api/fetchDetailIntro";

interface Props {
    intro: DetailIntroResponse;
    homepage?: string | null;
    tel?: string | null;
}

export default function IntroSection({ intro, homepage, tel }: Props) {
    // <br/> 태그를 포함한 문자열을 React 노드로 변환
    const renderWithLineBreaks = (text: string): ReactNode => {
        const parts = text.split(/<br\s*\/?>/i);
        return parts.map((part, idx) => (
            <Fragment key={idx}>
                {part}
                {idx < parts.length - 1 && <br />}
            </Fragment>
        ));
    };

    // 홈페이지 URL만 추출
    const extractUrl = (html: string): string => {
        const match = html.match(/href=["']([^"']+)["']/);
        return match ? match[1] : html;
    };
    const homepageUrl = homepage ? extractUrl(homepage) : null;

    // 공통 연락처 정보
    const contactInfo: [string, ReactNode][] = [];
    if (tel) {
        contactInfo.push(["전화번호", renderWithLineBreaks(tel)]);
    }
    if (homepageUrl) {
        contactInfo.push([
            "홈페이지",
            <a
                key="homepage-link"
                className="url"
                href={homepageUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                방문하기
            </a>,
        ]);
    }

    // specificInfo: [레이블, ReactNode] 형태
    const specificInfo: [string, ReactNode][] = [];

    switch (intro.contenttypeid) {
        case "12": {
            const t = intro as DetailIntroTourist;
            if (t.useseason) specificInfo.push(["이용 계절", renderWithLineBreaks(t.useseason)]);
            if (t.usetime) specificInfo.push(["이용 시간", renderWithLineBreaks(t.usetime)]);
            if (t.parking) specificInfo.push(["주차 정보", renderWithLineBreaks(t.parking)]);
            if (t.restdate) specificInfo.push(["휴무일", renderWithLineBreaks(t.restdate)]);
            if (!tel && t.infocenter) specificInfo.push(["문의 센터", renderWithLineBreaks(t.infocenter)]);
            break;
        }
        case "14": {
            const t = intro as DetailIntroCulture;
            if (t.usetimeculture) specificInfo.push(["이용 시간", renderWithLineBreaks(t.usetimeculture)]);
            if (t.usefee) specificInfo.push(["이용 요금", renderWithLineBreaks(t.usefee)]);
            if (t.parkingculture) specificInfo.push(["주차 정보", renderWithLineBreaks(t.parkingculture)]);
            if (t.parkingfee) specificInfo.push(["주차 요금", renderWithLineBreaks(t.parkingfee)]);
            if (t.restdateculture) specificInfo.push(["휴무일", renderWithLineBreaks(t.restdateculture)]);
            if (!tel && t.infocenterculture) specificInfo.push(["문의 센터", renderWithLineBreaks(t.infocenterculture)]);
            break;
        }
        case "28": {
            const t = intro as DetailIntroLeports;
            if (t.openperiod) specificInfo.push(["운영 기간", renderWithLineBreaks(t.openperiod)]);
            if (t.usefeeleports) specificInfo.push(["이용 요금", renderWithLineBreaks(t.usefeeleports)]);
            if (t.usetimeleports) specificInfo.push(["이용 시간", renderWithLineBreaks(t.usetimeleports)]);
            if (t.expagerangeleports) specificInfo.push(["체험 가능연령", renderWithLineBreaks(t.expagerangeleports)]);
            if (t.restdateleports) specificInfo.push(["휴무일", renderWithLineBreaks(t.restdateleports)]);
            if (!tel && t.infocenterleports) specificInfo.push(["문의 센터", renderWithLineBreaks(t.infocenterleports)]);
            break;
        }
        case "32": {
            const t = intro as DetailIntroStay;
            if (t.checkintime) specificInfo.push(["체크인", renderWithLineBreaks(t.checkintime)]);
            if (t.checkouttime) specificInfo.push(["체크아웃", renderWithLineBreaks(t.checkouttime)]);
            if (t.chkcooking) specificInfo.push(["취사 가능 여부", renderWithLineBreaks(t.chkcooking)]);
            if (t.parkinglodgin) specificInfo.push(["주차 정보", renderWithLineBreaks(t.parkinglodgin)]);
            // 예약 URL은 링크로
            if (t.reservationurl) specificInfo.push([
                "예약",
                <a
                    key="reservation-link"
                    className="url"
                    href={t.reservationurl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    방문하기
                </a>
            ]);
            break;
        }
        case "38": {
            const t = intro as DetailIntroShopping;
            if (t.fairday) specificInfo.push(["개장일", renderWithLineBreaks(t.fairday)]);
            if (t.opentime) specificInfo.push(["운영 시간", renderWithLineBreaks(t.opentime)]);
            if (t.parkingshopping) specificInfo.push(["주차 정보", renderWithLineBreaks(t.parkingshopping)]);
            if (t.restdateshopping) specificInfo.push(["휴무일", renderWithLineBreaks(t.restdateshopping)]);
            if (!tel && t.infocentershopping) specificInfo.push(["문의 센터", renderWithLineBreaks(t.infocentershopping)]);
            break;
        }
        default:
            break;
    }

    return (
        <div className="intro-section">
            {/* 타입별 상세 정보 */}
            {specificInfo.map(([label, value]) => (
                <dl key={label} className="info-entry">
                    <dt className="info-label">{label} :</dt>
                    <dd className="info-value">{value}</dd>
                </dl>
            ))}
            {/* 연락처 & 홈페이지 */}
            {contactInfo.map(([label, value]) => (
                <dl key={label} className="info-entry">
                    <dt className="info-label">{label} :</dt>
                    <dd className="info-value">{value}</dd>
                </dl>
            ))}
        </div>
    );
}

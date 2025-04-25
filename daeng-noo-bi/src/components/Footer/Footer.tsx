export default function Footer() {
    return (
        <footer className="Footer">
            <div>
                {/* 프로젝트 정보 */}
                <div className="info">
                    <p>🐾 댕누비 - 반려동물과 함께하는 여행</p>
                    <p>© 2025 DaengNooBi. All rights reserved.</p>
                </div>

                {/* 제작자 링크 */}
                <div className="producer-link">
                    <p>제작자 :
                        <a href="https://github.com/orinery">구채현</a>
                        |
                        <a href="https://github.com/robam1108">김보람</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
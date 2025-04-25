export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm p-6 mt-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                {/* 회사 정보 */}
                <div className="text-center md:text-left">
                    <p className="font-semibold">🐾 PetTrip - 반려동물과 함께하는 여행</p>
                    <p>© 2025 PetTrip. All rights reserved.</p>
                </div>

                {/* 링크 */}
                <div className="flex space-x-4">
                    <a href="/about" className="hover:underline">회사소개</a>
                    <a href="/terms" className="hover:underline">이용약관</a>
                    <a href="/privacy" className="hover:underline">개인정보처리방침</a>
                </div>

                {/* 소셜 링크 (필요시) */}
                <div className="flex space-x-3">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </div>
        </footer>
    )
}
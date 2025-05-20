import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './Banner.scss';

interface BannerItem {
    city: string;
    title: string;
    date: string;
    imageUrl: string;
    linkUrl: string;
}

const bannerItems: BannerItem[] = [
    {
        city: '청주',
        title: '2025 케이펫페어 청주',
        date: '07.25(금) – 27(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/04/09223940/2025kpet-motion-poster-09osco-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_kpet_cheongju/'
    },
    {
        city: '서울',
        title: '2025 케이펫페어 서울',
        date: '08.13(금) – 16(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/04/09223933/2025kpet-motion-poster-10coex-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_kpet_seoul/'
    },
    {
        city: '대구',
        title: '2025 케이펫페어 대구',
        date: '08.29(금) – 31(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/04/09223930/2025kpet-motion-poster-11exco-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_kpet_deagu/'
    },
    {
        city: '일산',
        title: '2025 메가주 일산',
        date: '05.16(금) – 18(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/04/02012938/2025kpet-motion-poster-06kintexS01-re-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_megazoo_spring/'
    },
    {
        city: '마곡',
        title: '2025 케이펫페어 마곡',
        date: '06.13(금) – 15(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/03/20013158/2025kpet-poster-motion-test-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_kpet_magok/'
    },
    {
        city: '수원',
        title: '2025 케이펫페어 수원',
        date: '07.04(금) – 06(일)',
        imageUrl: 'https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2025/04/09223937/2025kpet-motion-poster-08suwonS02-choo.gif',
        linkUrl: 'https://k-pet.co.kr/information/scheduled-list/2025_kpet_suwon2/'
    },
];

const Banner: React.FC = () => {
    return (
        <section className="Banner">
            <div className='banner-title'>
                <h2 className='home-title'>전국에서 열리는 케이펫페어</h2>
                <h1 className='banner-subtitle1'>댕댕이와 함께할 수 있는</h1>
                <h1 className='banner-subtitle2'>즐길거리와 볼거리가 <br />기다리고 있어요!</h1>
            </div>
            <div className='swiper-box'>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={0}
                    slidesPerView={'auto'}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                >
                    {bannerItems.map((item, idx) => (
                        <SwiperSlide key={idx} className="banner-slide">
                            <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="banner-link">
                                <div className="banner-image-wrapper">
                                    <img className="banner-image" src={item.imageUrl} alt={item.title} loading="eager" />
                                    <div className="banner-info">
                                        {item.title.split(' ').map((line, idx) => (
                                            <h1 key={idx}>{line}</h1>
                                        ))}
                                        <p>{item.date}</p>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Banner;

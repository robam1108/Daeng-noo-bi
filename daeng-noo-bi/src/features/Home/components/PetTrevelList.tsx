// src/components/PetTravelList.tsx
import { useEffect, useState } from 'react';
import { fetchPetFriendlyPlaces } from '../api/tourApi';

// API에서 받아오는 관광지 데이터 타입 정의
interface Place {
  contentid: string; // 고유 ID
  title: string; // 장소 이름
  addr1: string; // 주소
  firstimage: string; // 대표 이미지 URL
}

// 반려동물 동반 가능한 관광지 목록을 보여주는 컴포넌트
function PetTravelList() {
  const [places, setPlaces] = useState<Place[]>([]); // 관광지 목록 상태

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    fetchPetFriendlyPlaces('1').then(setPlaces); // 서울 지역 코드
  }, []);

  return (
    
    <section>
      <h2>반려동물 동반 가능한 관광지</h2>
      <div>
        {places.map((place) => (
          <div
            key={place.contentid}
          >
            <img
              src={place.firstimage || 'https://placehold.co/300x200?text=No+Image'}
              alt={place.title}
            />
            <div>
              <h3>{place.title}</h3>
              <p>{place.addr1 || '주소 정보 없음'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PetTravelList;
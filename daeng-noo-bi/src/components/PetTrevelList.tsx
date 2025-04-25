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
    
    <section className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">반려동물 동반 가능한 관광지</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.contentid}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={place.firstimage || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={place.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{place.title}</h3>
              <p className="text-sm text-gray-600">{place.addr1 || '주소 정보 없음'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PetTravelList;
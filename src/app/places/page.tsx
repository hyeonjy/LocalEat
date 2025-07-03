const page = () => {
  return (
    <div>
      <ul>
        <li>로컬잇 TOP 10</li>
        <li>NEW 로컬잇</li>
      </ul>
      <section>
        <h2>로컬잇픽 우리 동네 맛집 TOP 10</h2>
        <p>방문 횟수, 리뷰를 바탕으로 검증된 로컬 맛집만 소개합니다.</p>
        <input type="search" placeholder="지역명을 입력하세요"/>
      </section>
      <section>
        <ul>
          <li>
            <div>이미지</div>
            <div>
              <div>
                <span>신당동</span>
                <span>신당역</span>
              </div>
              <h3>
                1. 원조 남원 닭발<span>리뷰 287</span>
              </h3>
              <p>
                직접 삶아 쫄깃한 식감이 살아있는 닭발에 매콤한 양념이 깊게 배어
                있어 중독성 있는 맛을 자랑해요. 술안주로도, 든든한 한 끼로도
                손색없는 남원의 숨은 맛집이에요.
              </p>
            </div>
            <ul>
              <li>
                이미지1<div>이미지 방문</div>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default page;

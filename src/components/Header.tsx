import neurocleLogoImg from '../assets/images/neurocle/neurocle-logo.png';

/**
 * Header 컴포넌트 - 페이지 헤더
 * @component
 * @description
 * - 뉴로클 사전 과제 페이지의 헤더를 렌더링합니다.
 * - 로고 이미지와 제목 텍스트를 포함합니다.
 * - 레이아웃은 Flexbox를 사용하여 구성됩니다.
 */
const Header = () => {
  return (
    <div className="flex gap-4 items-center">
      {/* 로고 이미지 */}
      <img
        className="object-contain"
        src={neurocleLogoImg}
        width={150}
        height={50}
        alt="Neurocle Logo"
      />
      {/* 제목 텍스트 */}
      <span className="text-2xl font-bold">뉴로클 사전 과제</span>
    </div>
  );
};
export default Header;

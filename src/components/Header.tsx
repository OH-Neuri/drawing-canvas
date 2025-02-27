import canvasLofo from '../assets/images/logo/paint-brush_5956090.png';

const Header = () => {
  return (
    <div className="flex gap-4 items-center ">
      {/* 로고 이미지 */}
      <img
        className="object-contain"
        src={canvasLofo}
        width={35}
        height={35}
        alt="Neurocle Logo"
      />
      {/* 제목 텍스트 */}
      <span className="text-3xl font-bold text-gray-700">Drawing Canvas</span>
    </div>
  );
};
export default Header;

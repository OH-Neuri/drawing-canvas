import { useEffect, useRef, useState } from 'react';
import lineWidthImg from '../../src/assets/images/drawing/line-width.png';
import { TShapes } from '../App';

const STROKE_WIDTH_OPTIONS = [
  { value: 5 },
  { value: 10 },
  { value: 20 },
  { value: 30 },
  { value: 40 },
  { value: 50 },
];

export type TDropdown = {
  currentShape: TShapes;
  handleChangeStrokeWidth: (strokeWidth: number) => void;
};

/**
 * Dropdown 컴포넌트 - 도형 테두리 두께 선택 드롭다운
 * @component
 * @param {TDropdown} props - 컴포넌트에 전달되는 속성.
 * @param {TShapes} props.currentShape - 현재 선택된 도형의 상태.
 * @param {function} props.handleChangeStrokeWidth - 테두리 두께를 변경하는 함수.
 * @description
 * - 사용자가 도형의 테두리 두께를 선택할 수 있는 드롭다운을 제공합니다.
 * - 드롭다운 외부를 클릭하면 드롭다운이 닫히도록 구현되었습니다.
 */
export const Dropdown = ({
  currentShape,
  handleChangeStrokeWidth,
}: TDropdown) => {
  /**
   * @state {boolean} isStrokeWidthOptionOpen
   * 드롭다운 열림/닫힘 상태를 관리하는 상태.
   */
  const [isStrokeWidthOptionOpen, setIsStrokeWidthOptionOpen] =
    useState<boolean>(false);

  /**
   * @ref {React.MutableRefObject<HTMLDivElement | null>} dropdownRef
   * 드롭다운 컨테이너에 대한 참조. 외부 클릭 감지를 위해 사용.
   */
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  /**
   * 드롭다운 옵션 클릭 핸들러
   * @param {number} strokeWidth - 선택한 테두리 두께 값.
   */
  const handleDropdownClick = (strokeWidth: number) => {
    setIsStrokeWidthOptionOpen(false);
    handleChangeStrokeWidth(strokeWidth);
  };

  // 드롭다운 영역 밖 클릭 시 드롭다운 제거
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsStrokeWidthOptionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsStrokeWidthOptionOpen((prev) => !prev)}
        className="bg-gray-200 rounded-md flex h-14 w-14 items-center justify-center"
      >
        <img src={lineWidthImg} alt="Line Width" height={30} width={30} />
      </button>

      {/* 드롭다운 옵션 */}
      {isStrokeWidthOptionOpen && (
        <div className="absolute bg-white z-10 ">
          {STROKE_WIDTH_OPTIONS.map((option) => (
            <div
              className={`${option.value === currentShape.strokeWidth && 'bg-sky-500/50'} cursor-pointer flex border-[1px] w-52 h-16 border-gray-200 justify-between px-3 items-center gap-2`}
              key={option.value}
              onClick={() => handleDropdownClick(option.value)}
            >
              {/* 선택된 테두리 두께의 시각적 표시 */}
              <div
                style={{
                  height: `${option.value}px`,
                  width: '120px',
                  backgroundColor: 'black',
                }}
              ></div>
              <span>{`${option.value}px`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

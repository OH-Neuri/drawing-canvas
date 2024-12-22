import undoImg from '../../src/assets/images/drawing/undo.svg';
import redoImg from '../../src/assets/images/drawing/redo.svg';
import pencilImg from '../../src/assets/images/drawing/pencil.svg';
import slashImg from '../../src/assets/images/drawing/slash.svg';
import ellipseImg from '../../src/assets/images/drawing/oval.svg';
import rectangleImg from '../../src/assets/images/drawing/rectangle.svg';
import polygonImg from '../../src/assets/images/drawing/polygon.svg';
import trashImg from '../../src/assets/images/drawing/trash.svg';
import Button from './common/Button';
import { Dropdown } from './Dropdown';
import { TShapes } from '../App';

type TDrawingToolBar = {
  shapes: TShapes[];
  currentShape: TShapes;
  historyStep: React.MutableRefObject<TShapes[]>;
  handleRemoveShapes: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleChangeStrokeWidth: (strokeWidth: number) => void;
  handleChangeShapeMode: (mode: string) => void;
  handleChangeShapeColor: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * DrawingToolBar 컴포넌트 - 도형 그리기 도구 모음
 * @component
 * @param {TDrawingToolBar} props - 컴포넌트에 전달되는 속성.
 * @param {TShapes[]} props.shapes - 현재까지 그려진 도형의 목록.
 * @param {TShapes} props.currentShape - 현재 그리고 있는 도형의 상태.
 * @param {React.MutableRefObject<TShapes[]>} props.historyStep - 실행 취소된 도형 히스토리의 참조 객체.
 * @param {function} props.handleRemoveShapes - 모든 도형을 제거하는 함수.
 * @param {function} props.handleClickUndo - 실행 취소(Undo) 버튼을 클릭했을 때 호출되는 함수.
 * @param {function} props.handleClickRedo - 다시 실행(Redo) 버튼을 클릭했을 때 호출되는 함수.
 * @param {function} props.handleChangeStrokeWidth - 도형의 테두리 두께를 변경하는 함수.
 * @param {function} props.handleChangeShapeMode - 그리기 모드를 변경하는 함수.
 * @param {function} props.handleChangeShapeColor - 도형의 채우기 색상을 변경하는 함수.
 * @description
 * - 도형을 추가, 수정, 삭제할 수 있는 다양한 도구를 제공합니다.
 * - 실행 취소(Undo) 및 다시 실행(Redo) 버튼은 도형의 상태에 따라 비활성화됩니다.
 * - 지원하는 도형 모드: 자유 그리기(freeDraw), 직선(straightLine), 타원(ellipse), 직사각형(rectangle), 다각형(polygon).
 * - 테두리 두께 변경 및 색상 선택이 가능합니다.
 * - 각 도구는 버튼 형태로 구현되었으며, 시각적인 아이콘과 함께 제공됩니다.
 */
const DrawingToolBar = ({
  shapes,
  currentShape,
  historyStep,
  handleRemoveShapes,
  handleUndo,
  handleRedo,
  handleChangeShapeMode,
  handleChangeShapeColor,
  handleChangeStrokeWidth,
}: TDrawingToolBar) => {
  return (
    <div className="flex w-[515px] justify-evenly items-center rounded-md bg-gray-200 ">
      {/* 모든 도형 제거 버튼 */}
      <Button className="w-14" onClick={handleRemoveShapes}>
        <img src={trashImg} width={30} height={30} alt="Trash" />
      </Button>

      {/* Undo, 실행 취소 버튼 */}
      <Button
        className={`${(shapes.length === 0 || historyStep.current.length > 39) && 'disabled opacity-20 cursor-not-allowed'} `}
        onClick={handleUndo}
      >
        <img src={undoImg} width={20} height={17} alt="Undo" />
      </Button>
      {/* Redo, 다시 실행 버튼 */}
      <Button
        className={`${historyStep.current.length <= 0 && 'disabled opacity-20 cursor-not-allowed'}`}
        onClick={handleRedo}
      >
        <img src={redoImg} width={20} height={17} alt="Redo" />
      </Button>

      {/* 자유 그리기 모드 버튼 */}
      <Button
        className={`${currentShape.drawMode === 'freeDraw' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('freeDraw')}
      >
        <img src={pencilImg} width={30} height={30} alt="Pencil" />
      </Button>

      {/* 직선 모드 버튼 */}
      <Button
        className={`${currentShape.drawMode === 'straightLine' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('straightLine')}
      >
        <img src={slashImg} width={30} height={30} alt="Slash" />
      </Button>

      {/* 타원 모드 버튼 */}
      <Button
        className={`${currentShape.drawMode === 'ellipse' && 'bg-blue-500/40'}  `}
        onClick={() => handleChangeShapeMode('ellipse')}
      >
        <img src={ellipseImg} width={30} height={30} alt="Ellipse" />
      </Button>

      {/* 직사각형 모드 버튼 */}
      <Button
        className={`${currentShape.drawMode === 'rectangle' && 'bg-blue-500/40'} `}
        onClick={() => handleChangeShapeMode('rectangle')}
      >
        <img src={rectangleImg} width={30} height={30} alt="Rectangle" />
      </Button>

      {/* 다각형 모드 버튼 */}
      <Button
        className={`${currentShape.drawMode === 'polygon' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('polygon')}
      >
        <img src={polygonImg} width={30} height={30} alt="Polygon" />
      </Button>

      {/* 테두리 두께 변경 드롭다운 */}
      <Dropdown
        currentShape={currentShape}
        handleChangeStrokeWidth={handleChangeStrokeWidth}
      />

      {/* 색상 선택기 */}
      <div className="flex h-14 w-16 items-center justify-center relative ">
        <input
          type="color"
          className="h-7 w-[42px] border-[1px] border-gray-600 rounded-sm py-[0.6px] px-[1px]"
          value={currentShape.fillColor}
          onChange={handleChangeShapeColor}
        />
      </div>
    </div>
  );
};
export default DrawingToolBar;

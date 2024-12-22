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
  handleClickUndo: () => void;
  handleClickRedo: () => void;
  handleChangeStrokeWidth: (strokeWidth: number) => void;
  handleChangeShapeMode: (mode: string) => void;
  handleChangeShapeColor: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DrawingToolBar = ({
  shapes,
  currentShape,
  historyStep,
  handleRemoveShapes,
  handleClickUndo,
  handleClickRedo,
  handleChangeShapeMode,
  handleChangeShapeColor,
  handleChangeStrokeWidth,
}: TDrawingToolBar) => {
  return (
    <div className="flex w-[515px] justify-evenly items-center rounded-md bg-gray-200 ">
      <Button className="w-14" onClick={handleRemoveShapes}>
        <img src={trashImg} width={30} height={30} alt="Trash" />
      </Button>

      {/* undo, redo */}
      <Button
        className={`${(shapes.length === 0 || historyStep.current.length > 39) && 'disabled opacity-20 cursor-not-allowed'} `}
        onClick={handleClickUndo}
      >
        <img src={undoImg} width={20} height={17} alt="Undo" />
      </Button>
      <Button
        className={`${historyStep.current.length <= 0 && 'disabled opacity-20 cursor-not-allowed'}`}
        onClick={handleClickRedo}
      >
        <img src={redoImg} width={20} height={17} alt="Redo" />
      </Button>

      {/* Shape Mode*/}
      <Button
        className={`${currentShape.drawMode === 'freeDraw' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('freeDraw')}
      >
        <img src={pencilImg} width={30} height={30} alt="Pencil" />
      </Button>
      <Button
        className={`${currentShape.drawMode === 'straightLine' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('straightLine')}
      >
        <img src={slashImg} width={30} height={30} alt="Slash" />
      </Button>
      <Button
        className={`${currentShape.drawMode === 'ellipse' && 'bg-blue-500/40'}  `}
        onClick={() => handleChangeShapeMode('ellipse')}
      >
        <img src={ellipseImg} width={30} height={30} alt="Ellipse" />
      </Button>
      <Button
        className={`${currentShape.drawMode === 'rectangle' && 'bg-blue-500/40'} `}
        onClick={() => handleChangeShapeMode('rectangle')}
      >
        <img src={rectangleImg} width={30} height={30} alt="Rectangle" />
      </Button>
      <Button
        className={`${currentShape.drawMode === 'polygon' && 'bg-blue-500/40'}`}
        onClick={() => handleChangeShapeMode('polygon')}
      >
        <img src={polygonImg} width={30} height={30} alt="Polygon" />
      </Button>

      {/* Shape strokg width */}
      <Dropdown
        currentShape={currentShape}
        handleChangeStrokeWidth={handleChangeStrokeWidth}
      />
      {/* shape Color */}
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

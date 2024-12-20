import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Ellipse, Line, Circle } from 'react-konva';
import undoImg from '../src/assets/images/undo.svg';
import redoImg from '../src/assets/images/redo.svg';
import pencilImg from '../src/assets/images/pencil.svg';
import slashImg from '../src/assets/images/slash.svg';
import ellipseImg from '../src/assets/images/oval.svg';
import rectangleImg from '../src/assets/images/rectangle.svg';
import polygonImg from '../src/assets/images/octagon.svg';
import lineWidthImg from '../src/assets/images/line-width.png';

type TShapes = {
  drawMode: string;
  points: number[];
  fillColor: string;
  strokeWidth: number;
  radiusX?: number;
  radiusY?: number;
  width?: number;
  height?: number;
};

const App = () => {
  const [shapes, setShapes] = useState<TShapes[]>(() =>
    JSON.parse(localStorage.getItem('shapes') || '[]')
  );
  const [currentShape, setCurrentShape] = useState<TShapes>({
    drawMode: 'freeDraw',
    points: [0, 0],
    fillColor: '#353535',
    strokeWidth: 5,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleChangeShapeMode = (mode: string) => {
    if (mode === 'polygon') {
      setIsDrawing(true);
      setCurrentShape({
        drawMode: mode,
        points: [0, 0], // 초기값, 첫 마우스 클릭 시 덮어쓰기
        fillColor: currentShape.fillColor,
        strokeWidth: currentShape.strokeWidth,
      });
    } else {
      setIsDrawing(false); // 다른 모드에서는 드로잉 상태 초기화
      setCurrentShape({
        drawMode: mode,
        points: [],
        fillColor: currentShape.fillColor,
        strokeWidth: currentShape.strokeWidth,
        radiusX: 0,
        radiusY: 0,
        width: 0,
        height: 0,
      });
    }
  };

  const handleChangeShapeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (currentShape) {
      setCurrentShape((prev) => ({
        ...prev,
        fillColor: newColor,
      }));
    }
  };

  const handleChangeShapeStrokeWidth = (strokeWidth: number) => {
    if (currentShape) {
      setCurrentShape((prev) => ({
        ...prev,
        strokeWidth,
      }));
    }
  };

  const handleMouseDown = (e: any) => {
    setIsDrawing(true);

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const { x, y } = pointerPosition;

      switch (currentShape.drawMode) {
        case 'freeDraw':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case 'straightLine':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y, x, y], // 시작점과 임시 끝점 설정
          }));
          break;

        case 'ellipse':
        case 'rectangle':
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case 'polygon':
          // 첫 번째 점 근처를 클릭하면 다각형 완성
          if (
            currentShape.points.length >= 4 &&
            Math.sqrt(
              Math.pow(currentShape.points[0] - x, 2) +
                Math.pow(currentShape.points[1] - y, 2)
            ) < 10
          ) {
            setShapes([...shapes, currentShape]); // 다각형 저장
            setCurrentShape((prev) => ({
              ...prev,
              points: [], // 초기화
            }));
            setIsDrawing(false);
            return;
          }

          // 첫 클릭에서 첫 점 추가
          if (currentShape.points.length === 0) {
            setCurrentShape((prev) => ({
              ...prev,
              points: [x, y],
            }));
          } else {
            // 이후 점 추가
            setCurrentShape((prev) => ({
              ...prev,
              points: [...prev.points, x, y],
            }));
          }
          break;
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || currentShape.points.length === 0) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const { x, y } = pointerPosition;

      switch (currentShape.drawMode) {
        case 'freeDraw':
          setCurrentShape((prev) => ({
            ...prev,
            points: [...prev.points, x, y],
          }));
          break;

        case 'straightLine':
          setCurrentShape((prev) => ({
            ...prev,
            points: [prev.points[0], prev.points[1], x, y], // 시작점과 현재 마우스 위치로 업데이트
          }));
          break;

        case 'ellipse':
          const radiusX = Math.abs(x - currentShape.points[0]);
          const radiusY = Math.abs(y - currentShape.points[1]);
          setCurrentShape((prev) => ({
            ...prev,
            radiusX,
            radiusY,
          }));
          break;

        case 'rectangle':
          const width = x - currentShape.points[0];
          const height = y - currentShape.points[1];
          setCurrentShape((prev) => ({
            ...prev,
            width: Math.abs(width),
            height: Math.abs(height),
            points: [prev.points[0], prev.points[1]],
          }));
          break;

        case 'polygon':
          if (isDrawing && currentShape.points.length >= 2) {
            const updatedPoints = [
              ...currentShape.points.slice(0, -2), // 기존 점 유지
              x,
              y, // 현재 마우스 위치
            ];
            setCurrentShape((prev) => ({
              ...prev,
              points: updatedPoints,
            }));
          }
          break;
      }
    }
  };

  const handleMouseUp = () => {
    if (
      currentShape.drawMode !== 'polygon' &&
      (currentShape.points.length > 0 ||
        currentShape.width ||
        currentShape.radiusX)
    ) {
      setShapes([...shapes, currentShape]);
      setCurrentShape((prev) => ({
        ...prev,
        points: [],
        radiusX: 0,
        radiusY: 0,
        width: 0,
        height: 0,
      }));
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    // Save shapes to localStorage on change
    localStorage.setItem('shapes', JSON.stringify(shapes));
  }, [shapes]);

  return (
    <>
      <div className="mx-auto mb-[60px] flex w-[65vw] flex-col gap-6 py-5 xl:w-[936px]">
        {/* 헤더 */}
        <div>
          <img />
          <span className="text-2xl font-bold">뉴로클 사전 과제</span>
        </div>
        {/* Nav */}
        <div className="flex w-[456px] items-center rounded-md bg-gray-200">
          {/* undo, redo */}
          <button
            className="flex h-12 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('freeDraw')}
          >
            <img src={undoImg} width={20} height={17} alt="Undo" />
          </button>
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('straightLine')}
          >
            <img src={redoImg} width={20} height={17} alt="Redo" />
          </button>

          {/* Shape Mode*/}
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('freeDraw')}
          >
            <img src={pencilImg} width={30} height={30} alt="Pencil" />
          </button>
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('straightLine')}
          >
            <img src={slashImg} width={30} height={30} alt="Slash" />
          </button>
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('ellipse')}
          >
            <img src={ellipseImg} width={30} height={30} alt="Ellipse" />
          </button>
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('rectangle')}
          >
            <img src={rectangleImg} width={30} height={30} alt="Rectangle" />
          </button>
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeMode('polygon')}
          >
            <img src={polygonImg} width={30} height={30} alt="Polygon" />
          </button>

          {/* Shape Style */}
          <button
            className="flex h-14 w-14 items-center justify-center bg-gray-200"
            onClick={() => handleChangeShapeStrokeWidth(3)}
          >
            <img src={lineWidthImg} width={30} height={30} alt="Line Width" />
          </button>
          <div className="flex h-14 w-14 items-center justify-center">
            <input
              type="color"
              className="h-10 w-10"
              value={currentShape.fillColor}
              onChange={handleChangeShapeColor}
            />
          </div>
        </div>

        <Stage
          width={800}
          height={700}
          className="rounded-md border-[1px] border-stone-400"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* 기존 Shapes 렌더링 */}
            {shapes.map((shape, index) => {
              switch (shape.drawMode) {
                case 'freeDraw':
                  return (
                    <Line
                      key={index}
                      points={shape.points}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                case 'straightLine':
                  return (
                    <Line
                      key={index}
                      points={shape.points}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                      lineCap="round"
                    />
                  );
                case 'ellipse':
                  return (
                    <Ellipse
                      key={index}
                      x={shape.points[0]}
                      y={shape.points[1]}
                      radiusX={shape.radiusX || 0}
                      radiusY={shape.radiusY || 0}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                case 'rectangle':
                  return (
                    <Rect
                      key={index}
                      x={shape.points[0]}
                      y={shape.points[1]}
                      width={shape.width || 0}
                      height={shape.height || 0}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                case 'polygon':
                  return (
                    <Line
                      key={index}
                      points={shape.points}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                      closed
                    />
                  );
                default:
                  return null;
              }
            })}

            {/* 현재 드로잉 중인 Shape */}
            {currentShape && currentShape.drawMode === 'freeDraw' && (
              <Line
                points={currentShape.points}
                stroke={currentShape.fillColor}
                strokeWidth={currentShape.strokeWidth}
              />
            )}

            {currentShape && currentShape.drawMode === 'straightLine' && (
              <Line
                points={currentShape.points}
                stroke={currentShape.fillColor} // 현재 그리는 선의 색상
                strokeWidth={currentShape.strokeWidth}
                lineCap="round"
              />
            )}
            {currentShape && currentShape.drawMode === 'ellipse' && (
              <Ellipse
                x={currentShape.points[0]}
                y={currentShape.points[1]}
                radiusX={currentShape.radiusX || 0}
                radiusY={currentShape.radiusY || 0}
                stroke={currentShape.fillColor}
                strokeWidth={currentShape.strokeWidth}
                dash={[0, 0]} // 점선 스타일
                fill="transparent"
              />
            )}

            {currentShape && currentShape.drawMode === 'rectangle' && (
              <Rect
                x={currentShape.points[0]}
                y={currentShape.points[1]}
                width={currentShape.width}
                height={currentShape.height}
                stroke={currentShape.fillColor}
                strokeWidth={currentShape.strokeWidth}
                dash={[1, 0]} // 점선 스타일
              />
            )}

            {currentShape && currentShape.drawMode === 'polygon' && (
              <>
                {/* 기존 점들로 그려진 선 */}
                <Line
                  points={currentShape.points}
                  stroke="#3aa9ff"
                  strokeWidth={3}
                  lineCap="round"
                  closed={false} // 다각형이 아직 미완성이므로 닫지 않음
                />

                {/* 점 표시 */}
                {currentShape.points
                  .reduce<number[][]>(
                    (acc, _, i, arr) =>
                      i % 2 === 0 ? [...acc, [arr[i], arr[i + 1]]] : acc,
                    []
                  )
                  .map(([x, y], index) => (
                    <Circle
                      key={index}
                      x={x}
                      y={y}
                      radius={5}
                      fill="white"
                      stroke="#3aa9ff"
                      strokeWidth={2}
                    />
                  ))}
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </>
  );
};
export default App;

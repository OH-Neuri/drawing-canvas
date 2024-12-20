import { useState } from "react";
import { Stage, Layer, Rect, Ellipse, Line, Circle } from "react-konva";

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
  const [shapes, setShapes] = useState<TShapes[]>([]);
  const [currentShape, setCurrentShape] = useState<TShapes>({
    drawMode: "freeDraw",
    points: [0, 0],
    fillColor: "#888",
    strokeWidth: 5,
  });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const handleChangeShapeMode = (mode: string) => {
    if (mode === "polygon") {
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

  const handleChangeShapeColor = (fillColor: string) => {
    if (currentShape) {
      setCurrentShape((prev) => ({
        ...prev,
        fillColor,
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
        case "freeDraw":
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case "straightLine":
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y, x, y], // 시작점과 임시 끝점 설정
          }));
          break;

        case "ellipse":
        case "rectangle":
          setCurrentShape((prev) => ({
            ...prev,
            points: [x, y],
          }));
          break;

        case "polygon":
          // 첫 번째 점 근처를 클릭하면 다각형 완성
          if (
            currentShape.points.length >= 4 &&
            Math.sqrt(
              Math.pow(currentShape.points[0] - x, 2) +
                Math.pow(currentShape.points[1] - y, 2),
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
        case "freeDraw":
          setCurrentShape((prev) => ({
            ...prev,
            points: [...prev.points, x, y],
          }));
          break;

        case "straightLine":
          setCurrentShape((prev) => ({
            ...prev,
            points: [prev.points[0], prev.points[1], x, y], // 시작점과 현재 마우스 위치로 업데이트
          }));
          break;

        case "ellipse":
          const radiusX = Math.abs(x - currentShape.points[0]);
          const radiusY = Math.abs(y - currentShape.points[1]);
          setCurrentShape((prev) => ({
            ...prev,
            radiusX,
            radiusY,
          }));
          break;

        case "rectangle":
          const width = x - currentShape.points[0];
          const height = y - currentShape.points[1];
          setCurrentShape((prev) => ({
            ...prev,
            width: Math.abs(width),
            height: Math.abs(height),
            points: [prev.points[0], prev.points[1]],
          }));
          break;

        case "polygon":
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
      currentShape.drawMode !== "polygon" &&
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
  return (
    <>
      <div className="mx-auto mb-[60px] flex w-[65vw] flex-col gap-6 py-5 xl:w-[936px]">
        {/* 헤더 */}
        <div>
          <img />
          <span className="text-2xl font-bold">뉴로클 사전 과제</span>
        </div>
        {/* Nav */}
        <div className="flex gap-10">
          {/* undo, redo */}
          <div className="flex gap-3">
            <button onClick={() => handleChangeShapeMode("freeDraw")}>
              Undo
            </button>
            <button onClick={() => handleChangeShapeMode("straightLine")}>
              Redo
            </button>
          </div>

          {/* Shape Mode*/}
          <div className="flex gap-3">
            <button
              className=" "
              onClick={() => handleChangeShapeMode("freeDraw")}
            >
              자유그리기
            </button>
            <button onClick={() => handleChangeShapeMode("straightLine")}>
              직선
            </button>
            <button onClick={() => handleChangeShapeMode("ellipse")}>
              타원
            </button>
            <button onClick={() => handleChangeShapeMode("rectangle")}>
              직사각형
            </button>
            <button onClick={() => handleChangeShapeMode("polygon")}>
              다각형
            </button>
          </div>

          {/* Shape Style */}
          <div className="flex gap-3">
            <button onClick={() => handleChangeShapeColor("#555")}>크기</button>
            <button onClick={() => handleChangeShapeStrokeWidth(10)}>
              색상
            </button>
          </div>
        </div>

        <Stage
          width={800}
          height={700}
          className="bg-[#1E1E1E]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* 기존 Shapes 렌더링 */}
            {shapes.map((shape, index) => {
              switch (shape.drawMode) {
                case "freeDraw":
                  return (
                    <Line
                      key={index}
                      points={shape.points}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                case "straightLine":
                  return (
                    <Line
                      key={index}
                      points={shape.points}
                      stroke={shape.fillColor}
                      strokeWidth={shape.strokeWidth}
                      lineCap="round"
                    />
                  );
                case "ellipse":
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
                case "rectangle":
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
                case "polygon":
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
            {currentShape && currentShape.drawMode === "freeDraw" && (
              <Line
                points={currentShape.points}
                stroke={currentShape.fillColor}
                strokeWidth={currentShape.strokeWidth}
              />
            )}

            {currentShape && currentShape.drawMode === "straightLine" && (
              <Line
                points={currentShape.points}
                stroke={currentShape.fillColor} // 현재 그리는 선의 색상
                strokeWidth={currentShape.strokeWidth}
                lineCap="round"
                dash={[4, 4]} // 대시 스타일 (선택사항)
              />
            )}
            {currentShape && currentShape.drawMode === "ellipse" && (
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

            {currentShape && currentShape.drawMode === "rectangle" && (
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

            {currentShape && currentShape.drawMode === "polygon" && (
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
                    [],
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

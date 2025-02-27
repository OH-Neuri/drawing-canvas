### 주제 : 벡터(SVG) 기반의 드로잉 툴 구현
<br />

#### 프로젝트 기간
- 2024.12.20(금) ~ 2024.12.22(일) (총 3일)
<br />

#### 진행 node 버전
- Node.js v20.13.1
- Npm 10.5.2
<br />

#### 실행 방법
``` jsx
$ cd drawing-tool
$ npm i
$ npm run dev
```
<br />

#### 배포 링크
🌐 [드로잉 툴 바로가기](https://neurocle-frontend-drawing-tool.vercel.app/)

<br />

#### 구현 세부 내용
- React, typescript와 드로잉 라이브러리 Konva(https://konvajs.org/)를 사용해 프로젝트를 구현

<br />
<br />

  
## 1. 기술 스택, 기술 선정 이유
#### 1-1 Typescript
- 타입 안정성을 높여 타입 관련 오류를 사전에 방지하고, 유지 보수를 용이하게 하기 위해 타입스크립트를 사용하였습니다.
#### 1-2 tailwindCSS
- 미리 정의된 유틸리티 클래스를 사용하여 CSS를 작성하지 않아도 다양한 스타일을 적용할 수 있습니다.
- 빠르고 효율적인 코드 수정 및 스타일 변경이 가능하여 해당 기술을 사용하였습니다.


<br />
<br />


## 2. 컴포넌트 설계
- UI
   1. Button (공용 버튼 컴포넌트)
   2. Header (헤더)
   3. DrawingCanvas (캔버스)
   4. DrawingToolBar (드로잉 툴 바)
   5. Dropdown (드로잉 선 굵기 선택 드롭다운)

   
<br />
<br />


## 3. 프로젝트 화면
|기본 화면|자유 그리기|
|:--:|:--:|
|![image](https://github.com/user-attachments/assets/f6891bb8-31c3-4240-b2cf-0f3dd27065b9)|![image](https://github.com/user-attachments/assets/dc9f5bad-f05d-402a-b1d1-9f38d4163e89)|


|직선 그리기| 타원 그리기 |
|:--:|:--:|
|![image](https://github.com/user-attachments/assets/24b16cd1-8844-4099-99e8-7e1fd27410c5)|![image](https://github.com/user-attachments/assets/56de7699-cc16-48f7-9c33-655cfd3822ef)|


|직사각형 그리기|다각형 그리기 |
|:--:|:--:|
|![image](https://github.com/user-attachments/assets/a80c7207-de87-4518-9054-fd5cae0b005e)|![image](https://github.com/user-attachments/assets/99c2f1b0-2deb-43ae-98b4-e398261a50f7)|

|Undo(실행 취소)| Redo(되돌리기)|
|:--:|:--:|
|![image](https://github.com/user-attachments/assets/dce6d6b7-bed5-435c-b43e-070ce8027786)|![image](https://github.com/user-attachments/assets/9ffe97c9-69f9-4d7e-9c1f-574329c1254e)|

|선 굵기 선택 | 색상 선택 | 
|:--:|:--:|
|![image](https://github.com/user-attachments/assets/103a9bef-068a-4869-85ae-430959b4b109)|![image](https://github.com/user-attachments/assets/f76f05da-ce9e-4cf0-811c-6e080ba578c1)|

<br />
<br />

## 4. 프로젝트 화면 및 기능 설명
### 4.1 드로잉 타입 선택 : 자유그리기, 직선, 타원, 직사각형, 다각형
![DrawingCanvas-Chrome2025-02-2721-55-45-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/0b0483a1-8f73-47be-b09f-a328ffc0c261)



#### 요구사항 확인
1. 드로잉 타입 선택: 자유 그리기, 직선, 타원, 직사각형, 다각형
   - 1회성 드로잉이 아닌, 그려진 도형들이 한 화면에서 나타나도록 구현
   - 가장 최근에 그린 도형이 맨 위에 표시
   - 새로 고침 이후에도 캔버스 내용이 유지
     
- 관련 Git Issues
   - [#2드로잉 기능 구현 및 스타일링](https://github.com/OH-Neuri/neurocle-frontend-drawing-tool/issues/2)
 
      
          
<br />
<br />
  

### 4.2 선 두께 선택
![DrawingCanvas-Chrome2025-02-2721-57-07-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/7e1de91a-8878-4653-be6b-d429b5e3a5b1)

#### 요구사항 확인
2. 선 두께 선택
   - 두께 값의 최소/최대 제한 (최소 5px, 최대 50px) 
- 관련 Git Issues
   - [#2드로잉 기능 구현 및 스타일링](https://github.com/OH-Neuri/neurocle-frontend-drawing-tool/issues/2)
 

<br />
<br/ >


### 4.3 컬러 선택
![DrawingCanvas-Chrome2025-02-2721-57-38-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/c6657670-1fd4-406f-9ea4-d8181a1822b6)

#### 요구사항 확인
3. 컬러 선택
   - 현재 선택된 컬러를 사용자가 인지 가능하게 구현
- 관련 Git Issues
   - [#2드로잉 기능 구현 및 스타일링](https://github.com/OH-Neuri/neurocle-frontend-drawing-tool/issues/2)


<br />
<br/ >


### 4.4 Undo, Redo 
![DrawingCanvas-Chrome2025-02-2721-58-09-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/981db1c8-d721-492f-a649-0db4723b478d)

#### 요구사항 확인
4. Undo, Redo
  - 지난 작업으로 돌아갈 수 있어야 하고 마지막으로 작업한 시점으로 돌아올 수도 있다.
  - 최근 40개의 작업 기록만 저장
  - Redo, Undo 상황에 따라 각 버튼 활성화/비활성화 기능 추가
  - 로컬스토리지에서 데이터를 가져올 때 데이터가 손상된 경우를 처리할 수 있도록 에러 핸들링 코드를 추가 
  - Ctrl + z, Ctrl +y 키보드 이벤트 적용 
- 관련 Git Issues
  - [#2드로잉 기능 구현 및 스타일링](https://github.com/OH-Neuri/neurocle-frontend-drawing-tool/issues/2)

<br />
<br/ >

### 4.5 전체 지우기
![DrawingCanvas-Chrome2025-02-2721-58-43-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/b91a625b-0c10-4bb9-9259-8ba43ba98a7a)


#### 구현 사항
- 휴지통 아이콘 클릭 시 현재 캔버스에 그려진 도형 전체 지우기 기능 추가
- 새로고침 시 이전에 그려진 도형들로 초기화되지 않도록 로컬스토리지에 저장된 데이터 제거
- 드로잉 모드, 선 굵기, 색상 상태 값 유지 

<br />
<br/ >

## 5. 프로젝트 폴더 구조
``` jsx
📦public
 ┣ 📜paint-brush_5956090.png
 ┗ 📜vite.svg
📦src
 ┣ 📂assets
 ┃ ┣ 📂css
 ┃ ┃ ┣ 📜index.css
 ┃ ┃ ┗ 📜tailwind.css
 ┃ ┣ 📂font
 ┃ ┃ ┗ 📜PretendardVariable.woff2
 ┃ ┗ 📂images
 ┃ ┃ ┣ 📂drawing
 ┃ ┃ ┃ ┣ 📜line-width.png
 ┃ ┃ ┃ ┣ 📜oval.svg
 ┃ ┃ ┃ ┣ 📜pencil.svg
 ┃ ┃ ┃ ┣ 📜polygon.svg
 ┃ ┃ ┃ ┣ 📜rectangle.svg
 ┃ ┃ ┃ ┣ 📜redo.svg
 ┃ ┃ ┃ ┣ 📜slash.svg
 ┃ ┃ ┃ ┣ 📜trash.svg
 ┃ ┃ ┃ ┗ 📜undo.svg
 ┃ ┃ ┗ 📂logo
 ┃ ┃ ┃ ┗ 📜paint-brush_5956090.png
 ┣ 📂components
 ┃ ┣ 📂common
 ┃ ┃ ┗ 📜Button.tsx
 ┃ ┣ 📜DrawingCanvas.tsx
 ┃ ┣ 📜DrawingToolBar.tsx
 ┃ ┣ 📜Dropdown.tsx
 ┃ ┗ 📜Header.tsx
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```

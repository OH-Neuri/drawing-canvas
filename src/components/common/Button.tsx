type TButtonProps = React.ComponentPropsWithoutRef<'button'>;

/**
 * Button 컴포넌트 - 사용자 정의 버튼 컴포넌트
 * @component
 * @param {TButtonProps} props - 버튼 컴포넌트에 전달되는 속성.
 * @param {React.ReactNode} props.children - 버튼 내부에 렌더링되는 내용.
 * @param {string} [props.className] - 추가적인 CSS 클래스 이름.
 * @description
 * - HTML 기본 `<button>` 요소의 속성을 상속받아 사용 가능한 버튼 컴포넌트입니다.
 * - `className`을 통해 사용자 정의 스타일을 추가할 수 있습니다.
 * - `...props`를 통해 나머지 속성을 버튼에 전달합니다.
 */
const Button = ({ children, className, ...props }: TButtonProps) => {
  return (
    <button
      className={`flex h-14 w-14 items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

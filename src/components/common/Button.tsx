type TButtonProps = React.ComponentPropsWithoutRef<'button'>;

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

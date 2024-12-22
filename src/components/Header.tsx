import neurocleLogoImg from '../assets/images/neurocle/neurocle-logo.png';

const Header = () => {
  return (
    <div className="flex gap-4 items-center">
      <img
        className="object-contain"
        src={neurocleLogoImg}
        width={150}
        height={50}
        alt="Neurocle Logo"
      />
      <span className="text-2xl font-bold">뉴로클 사전 과제</span>
    </div>
  );
};
export default Header;

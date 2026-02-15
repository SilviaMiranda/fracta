/**
 * Logo Component
 * Displays the Fracta logo image
 */

const Logo = ({ size = 'large' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <img
        src="/fracta-logo_gran.png"
        alt="Fracta Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;


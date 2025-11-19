import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'military',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-tactical uppercase tracking-widest transition-all duration-200 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    military: 'btn-military',
    commander: 'btn-commander',
    alert: 'btn-alert',
    tactical: 'btn-tactical',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-lg',
    lg: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['military', 'commander', 'alert', 'tactical']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;

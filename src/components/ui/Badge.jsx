import PropTypes from 'prop-types';

const Badge = ({
  children,
  variant = 'military',
  icon,
  pulse = false,
  className = '',
  ...props
}) => {
  const variants = {
    military: 'badge-military',
    rank: 'badge-rank',
    alert: 'badge-alert',
  };

  const pulseClass = pulse ? 'animate-pulse-slow' : '';

  return (
    <span
      className={`${variants[variant]} ${pulseClass} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['military', 'rank', 'alert']),
  icon: PropTypes.node,
  pulse: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;

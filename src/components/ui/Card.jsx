import PropTypes from 'prop-types';

const Card = ({
  children,
  variant = 'military',
  className = '',
  title,
  badge,
  cornerBrackets = false,
  scanlines = false,
  ...props
}) => {
  const variants = {
    military: 'card-military',
    mission: 'card-mission',
    hud: 'hud-panel',
  };

  const wrapperClasses = `
    ${variants[variant]}
    ${cornerBrackets ? 'corner-brackets' : ''}
    ${scanlines ? 'scanlines' : ''}
    ${className}
  `;

  return (
    <div className={wrapperClasses} {...props}>
      {title && (
        <div className="classified-header mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-tactical text-military-gold-bright font-stencil">
              {title}
            </h3>
            {badge && <span className="badge-rank">{badge}</span>}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['military', 'mission', 'hud']),
  className: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.string,
  cornerBrackets: PropTypes.bool,
  scanlines: PropTypes.bool,
};

export default Card;

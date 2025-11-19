import PropTypes from 'prop-types';

const ProgressBar = ({
  progress = 0,
  label,
  showPercentage = true,
  className = '',
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="font-stencil text-xs uppercase text-military-green-bright tracking-wider">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="font-mono text-sm text-military-gold-bright">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="progress-military">
        <div
          className="progress-military-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
  label: PropTypes.string,
  showPercentage: PropTypes.bool,
  className: PropTypes.string,
};

export default ProgressBar;

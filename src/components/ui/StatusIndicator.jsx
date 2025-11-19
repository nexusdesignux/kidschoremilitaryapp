import PropTypes from 'prop-types';

const StatusIndicator = ({
  status = 'ready',
  label,
  className = '',
  ...props
}) => {
  const statuses = {
    ready: 'status-ready',
    'in-progress': 'status-in-progress',
    completed: 'status-completed',
    critical: 'status-critical',
  };

  const labels = {
    ready: 'READY',
    'in-progress': 'IN PROGRESS',
    completed: 'MISSION ACCOMPLISHED',
    critical: 'MISSION CRITICAL',
  };

  return (
    <div className={`${statuses[status]} ${className}`} {...props}>
      {label || labels[status]}
    </div>
  );
};

StatusIndicator.propTypes = {
  status: PropTypes.oneOf(['ready', 'in-progress', 'completed', 'critical']),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default StatusIndicator;

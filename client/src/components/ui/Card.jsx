const Card = ({ children, className = '', hover = true, padding = true, ...props }) => {
  return (
    <div
      className={`card ${padding ? 'p-6' : ''} ${hover ? '' : 'hover:shadow-card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

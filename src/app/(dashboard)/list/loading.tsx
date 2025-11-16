interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = `
    flex items-center justify-center 
    ${fullScreen ? 'min-h-screen w-full' : 'w-full h-full min-h-[200px]'}
  `;

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className={`
            animate-spin rounded-full border-b-2 border-gray-900 
            ${sizeClasses[size]}
          `}
        />
        <span className="text-gray-600 text-sm font-medium">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
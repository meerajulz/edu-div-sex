// Add to any of your utility files
export const isMobileDevice = () => {
  return (typeof window !== 'undefined') && 
    (window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
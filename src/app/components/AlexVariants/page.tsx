export const AlexVariants = {
  default: '/svg/alex-default.svg',
  smiling: '/svg/alex-smiling.svg',
  mouthOpen: '/svg/alex-boca-aberta.svg',
  mouthClosed: '/svg/alex-boca-cerrada.svg',
  mouthOpenArmUp: '/svg/alex-boca-aberta-brazo-up.svg',
  mouthClosedArmUp: '/svg/alex-boca-cerrada-brazo-up.svg'
} as const;

interface AlexSVGProps {
  variant?: keyof typeof AlexVariants;
  className?: string;
}

export const AlexSVG: React.FC<AlexSVGProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  return (
    // SVG will be loaded from public/svg directory
    <img 
      src={AlexVariants[variant]} 
      alt={`Alex ${variant}`}
      className={className}
    />
  );
};

export default AlexSVG;
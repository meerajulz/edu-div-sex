export interface ContainerSize {
  width: number;
  height: number;
  iconSize: number;
  yOffset?: number; // Optional for backward compatibility
  spacing?: number; // Optional for backward compatibility
}

export interface Position {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  opacity: number;
}

export interface ItemData {
  id: number;
  label: string;
  url: string;
  svgPath: string;
  isUnlocked: boolean;
}

export interface CarouselItemProps {
  item: ItemData;
  index: number;
  activeIndex: number;
  position: Position;
  containerSize: ContainerSize;
  handleCircleClick: (index: number, isUnlocked: boolean) => void;
  handleLabelClick: (url: string, isUnlocked: boolean) => void;
}
// Types for Orbital Carousel

export interface ItemData {
  id: number;
  label: string;
  url: string;
  svgPath: string;
  isUnlocked: boolean;
}

export interface ContainerSize {
  width: number;
  height: number;
  iconSize: number;
}

export interface Position {
  x: number;
  y: number;
  scale: number;
  zIndex: number;
  opacity: number;
}

export interface CarouselItemProps {
  item: ItemData;
  index: number;
  activeIndex: number;
  position: Position;
  containerSize: ContainerSize;
  handleCircleClick: (index: number, isUnlocked: boolean) => Promise<void>;
  handleLabelClick: (url: string, isUnlocked: boolean) => Promise<void>;
}
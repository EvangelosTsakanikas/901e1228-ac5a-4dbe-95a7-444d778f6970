export interface Photo {
  uuid: string
  id: string;
  src: string;
  isFavorite: boolean;
  originalWidth?: number
  originalHeight?: number
}
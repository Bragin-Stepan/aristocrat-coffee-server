export class ImageResponseDto {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  productId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
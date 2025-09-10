export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}
export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id : number;
    nombre: string;
    precio: number;
    descripcion: string;
    imageUrl?: string;
    categoryId?: number;
    Category?: Category;
    createdAt: string;
    updatedAt: string;
}
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
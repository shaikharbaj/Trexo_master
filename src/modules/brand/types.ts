export interface CreateBrandBody {
    brand_name: string;
    is_active?: boolean;
}

export interface ToggleBrandVisibilityBody {
    is_active: boolean;
}

export interface UpdateBrandBody {
    brand_name: string;
    is_active?: boolean;
}


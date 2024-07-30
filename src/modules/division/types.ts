export interface CreateDivisionBody {
    slug: string;
    division_name: string;
    is_active?: boolean;

}

export interface ToggleDivisionVisibilityBody {
    is_active: boolean;
}

export interface UpdateDivisionBody {
    slug: string;
    division_name: string;
    is_active?: boolean;

}


export interface CreateStateBody {
  country_uuid: string;
  name: string;
  short_code: string;
  is_active?: boolean|string;
}

export interface toggleStateVisibilityBody {
  is_active: boolean | string;
}

export interface UpdateStateBody {
  country_uuid: string;
  name: string;
  short_code: string;
  is_active?: string|boolean;
}

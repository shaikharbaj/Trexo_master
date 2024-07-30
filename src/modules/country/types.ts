export interface CreateCountryBody {
  country_name: string;
  iso_code: string;
  mobile_code: number;
  currency_code: string;
  is_active?: boolean;
}

export interface UpdateCountryBody {
  country_name: string;
  iso_code: string;
  mobile_code: number;
  currency_code: string;
  is_active?: boolean;
}

export interface toggleCountryBody {
  is_active: boolean | string;
}

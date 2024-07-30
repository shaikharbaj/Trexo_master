export interface CreateTaxBody {
  tax_name: number;
  description: string;
  tax_type: string;
  value_type: string;
  tax_value: number;
  is_active?: boolean | string;
}

export interface ToggleTaxVisibilityBody {
  is_active: boolean | string;
}

export interface UpdateTaxBody {
  tax_name: number;
  description: string;
  tax_type: string;
  value_type: string;
  tax_value: number;
  is_active?: boolean | string;
}

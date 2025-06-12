export type OpeningHourProps = {
  open?: string;
  close?: string;
  last_order?: string;
  closed?: boolean;
};

export type RestaurantProps = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  category: string;
  opening_hours: {
    mon: OpeningHourProps;
    tue: OpeningHourProps;
    wed: OpeningHourProps;
    thu: OpeningHourProps;
    fri: OpeningHourProps;
    sat: OpeningHourProps;
    sun: OpeningHourProps;
  };
  closed_days: string;
  parking?: boolean;
  pet_allowed?: boolean;
  image_url: string;
  created_at: string;
};

export type MenuProps = {
  id: number;
  restaurant_id: number;
  name: string;
  image_url: string;
  description: string;
  created_at: string;
};

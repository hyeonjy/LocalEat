export type OpeningHourProps = {
  open?: string;
  close?: string;
  last_order?: string;
  closed?: boolean;
};

export type OpeningHours = {
  mon: OpeningHourProps;
  tue: OpeningHourProps;
  wed: OpeningHourProps;
  thu: OpeningHourProps;
  fri: OpeningHourProps;
  sat: OpeningHourProps;
  sun: OpeningHourProps;
};

export type RestaurantProps = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  category: string;
  opening_hours: OpeningHours;
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
  badge: string;
};

export type ReactionType = '공감해요' | '도움이 됐어요';

export type StandardReviewPhoto = {
  id: number;
  review_id: number;
  type: 'food' | 'receipt';
  image_url: string;
  uploaded_at: string;
};

export type StandardReviewReactions = {
  [key in ReactionType]?: number;
};

export type StandardReviewProps = {
  id: number;
  user_id: number;
  restaurant_id: number;
  type: 'standard';
  rating: number;
  visited_at: string;
  created_at: string;
  updated_at: string;
  content: string;
  keywords: string[];
  visited_date: string;
  visit_count: number;
  visited_time_slot: 'morning' | 'lunch' | 'afternoon' | 'dinner';
  nickname: string;
  profile_image: string;
  photos: StandardReviewPhoto[];
  reactions: StandardReviewReactions;
};

export type StandardReviewPayload = {
  restaurantId: string;
  userId: number;
  content: string;
  keywords: string[];
  rating: number;
  visitedAt: string;
  visitedTimeSlot: 'morning' | 'lunch' | 'afternoon' | 'dinner';
  photos: {
    type: 'food' | 'receipt';
    imageUrl: string;
  }[];
};

export type GraphicReviewPayload = {
  restaurantId: string;
  userId: number;
  keywords: string[];
  rating: number;
  photos: {
    type: 'receipt' | 'story';
    imageUrl: string;
  }[];
  storyImage: string;
  storyData: any;
};

export type keywordSummaryProps = {
  keyword: string;
  count: number;
};

export type ReactionProps = {
  review_id: number;
  type: string;
};

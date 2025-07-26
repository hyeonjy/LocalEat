import { TemplateElement, TemplateElementAPI } from './template';

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
  reviewCount: number;
  averageRating: number;
};

export type TopRestaurantProps = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  image_url: string;
  category: string;
  averageRating: number;
  review_count: number;
  reviews: ReviewSummaryProps[];
  menus: string[];
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

export type ReviewPhoto = {
  review_id: number;
  image_url: string;
  type: 'food' | 'receipt';
};

export type ReviewSummaryProps = {
  id: number;
  user_id: number;
  restaurant_id: number;
  type: 'standard';
  rating: number;
  visited_at: string;
  created_at: string;
  updated_at: string;
  visited_date: string;
  visited_time_slot: 'morning' | 'lunch' | 'afternoon' | 'dinner';
  nickname: string;
  profile_image: string;
  visit_count: number;
  photo: ReviewPhoto;
};

export type StandardReviewReactions = {
  visited_date: string;
  visit_count: number;
  visited_time_slot: 'morning' | 'lunch' | 'afternoon' | 'dinner';
  nickname: string;
  profile_image: string;
  photos: StandardReviewPhoto[];
  reactions: StandardReviewReactions;
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

export type GraphicReviewProps = {
  id: number;
  user_id: number;
  restaurant_id: number;
  type: 'graphic';
  rating: number;
  created_at: string;
  updated_at: string;
  keywords: string[];
  visit_count: number;
  nickname: string;
  profile_image: string;
  elements: TemplateElementAPI[];
  background_image_url: string;
  receipt_image_url?: string;
  story_preview_url: string;
};

export type GraphicReviewPayload = {
  restaurantId: string;
  userId: number;
  keywords: string[];
  rating: number;
  photos: {
    type: 'receipt' | 'storyBg' | 'storyPreview';
    imageUrl: string;
  }[];
  elements: TemplateElement[];
};

export type keywordSummaryProps = {
  keyword: string;
  count: number;
};

export type ReactionProps = {
  review_id: number;
  type: string;
};

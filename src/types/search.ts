// types/search.ts
export type MapItem = {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  [k: string]: any;
};

export type MapCenter = { lat: number; lng: number };

export type QueryStatusLite = 'pending' | 'error' | 'success';

export type SearchPagingProps = {
  initialKeyword: string;
  items: MapItem[];
  center: MapCenter;
  status: QueryStatusLite;
  error: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export type TNotice = {
  id: number;
  title: string;
  content: string;
  preview: string;
  priority: string;
  urgency_indicator: string;
  effective_from: string;
  effective_until: string;
  is_pinned: boolean;
  created_at: string;
  published_at: string;
  view_count: number;
  status: string;
  attachments: {
    url: string;
    filename: string;
    file_type: string;
    file_size: number;
    uploaded_at: string;
  }[];
  target_audience: string;
  target_units: number[];
  target_floors: number[];
  category_name: string;
  category_color_code: string;
  category_icon_url: string;
  published_by_name: string;
  published_by_lastname: string;
  is_read: boolean;
  viewed_at: string | null;
  content_length: number;
  attachment_count: number;
  is_expired: boolean;
  hours_since_published: number;
  reading_time_minutes: number;
};

export type TNoticesStats = {
  total_notices: number;
  unread_count: number;
  high_priority_count: number;
  pinned_count: number;
  expired_count: number;
};

export type TUserTargetingInfo = {
  unit_ids: string[];
  floor_ids: string[];
  relationship_types: string[];
};

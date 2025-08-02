export const SERVICE_REQUEST_PRIORITY = [
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
  {
    label: "Urgent",
    value: "urgent",
  },
] as const;

export const SERVICE_REQUEST_STATUS = [
  {
    label: "Open",
    value: "open",
  },
  {
    label: "In Progress",
    value: "in_progress",
  },
  {
    label: "Pending Approval",
    value: "pending_approval",
  },
  {
    label: "Resolved",
    value: "resolved",
  },
  {
    label: "Closed",
    value: "closed",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
] as const;

export const SERVICE_DEPARTMENT = [
  {
    label: "Maintenance",
    value: "maintenance",
  },
  {
    label: "Administration",
    value: "administration",
  },
  {
    label: "Housekeeping",
    value: "housekeeping",
  },
  {
    label: "Security",
    value: "security",
  },
  {
    label: "Technical",
    value: "technical",
  },
] as const;

export const UPDATE_TYPE = [
  {
    label: "Status Change",
    value: "status_change",
  },
  {
    label: "Assignment",
    value: "assignment",
  },
  {
    label: "Comment",
    value: "comment",
  },
  {
    label: "Attachment",
    value: "attachment",
  },
] as const;

export const PRIORITY_LEVELS = {
  [SERVICE_REQUEST_PRIORITY[0].value]: {
    label: "Low",
    value: 1,
    color: "#10B981", // green
    bgColor: "#ECFDF5",
  },
  [SERVICE_REQUEST_PRIORITY[1].value]: {
    label: "Medium",
    value: 2,
    color: "#F59E0B", // yellow
    bgColor: "#FFFBEB",
  },
  [SERVICE_REQUEST_PRIORITY[2].value]: {
    label: "High",
    value: 3,
    color: "#EF4444", // red
    bgColor: "#FEF2F2",
  },
  [SERVICE_REQUEST_PRIORITY[3].value]: {
    label: "Urgent",
    value: 4,
    color: "#DC2626", // dark red
    bgColor: "#FEE2E2",
  },
} as const;

export const STATUS_CONFIG = {
  [SERVICE_REQUEST_STATUS[0].value]: {
    label: "Open",
    color: "#3B82F6", // blue
    bgColor: "#EFF6FF",
    canTransitionTo: [
      SERVICE_REQUEST_STATUS[1].value,
      SERVICE_REQUEST_STATUS[5].value,
    ],
  },
  [SERVICE_REQUEST_STATUS[1].value]: {
    label: "In Progress",
    color: "#F59E0B", // yellow
    bgColor: "#FFFBEB",
    canTransitionTo: [
      SERVICE_REQUEST_STATUS[2].value,
      SERVICE_REQUEST_STATUS[3].value,
      SERVICE_REQUEST_STATUS[5].value,
    ],
  },
  [SERVICE_REQUEST_STATUS[2].value]: {
    label: "Pending Approval",
    color: "#8B5CF6", // purple
    bgColor: "#F3E8FF",
    canTransitionTo: [
      SERVICE_REQUEST_STATUS[1].value,
      SERVICE_REQUEST_STATUS[3].value,
      SERVICE_REQUEST_STATUS[5].value,
    ],
  },
  [SERVICE_REQUEST_STATUS[3].value]: {
    label: "Resolved",
    color: "#10B981", // green
    bgColor: "#ECFDF5",
    canTransitionTo: [
      SERVICE_REQUEST_STATUS[4].value,
      SERVICE_REQUEST_STATUS[1].value,
    ],
  },
  [SERVICE_REQUEST_STATUS[4].value]: {
    label: "Closed",
    color: "#6B7280", // gray
    bgColor: "#F9FAFB",
    canTransitionTo: [],
  },
  [SERVICE_REQUEST_STATUS[5].value]: {
    label: "Cancelled",
    color: "#EF4444", // red
    bgColor: "#FEF2F2",
    canTransitionTo: [],
  },
} as const;

export const DEPARTMENT_CONFIG = {
  [SERVICE_DEPARTMENT[0].value]: {
    label: "Maintenance",
    icon: "🔧",
    color: "#F59E0B",
  },
  [SERVICE_DEPARTMENT[1].value]: {
    label: "Housekeeping",
    icon: "🧹",
    color: "#10B981",
  },
  [SERVICE_DEPARTMENT[2].value]: {
    label: "Security",
    icon: "🛡️",
    color: "#EF4444",
  },
  [SERVICE_DEPARTMENT[3].value]: {
    label: "Administration",
    icon: "📋",
    color: "#3B82F6",
  },
  [SERVICE_DEPARTMENT[4].value]: {
    label: "Technical",
    icon: "💻",
    color: "#8B5CF6",
  },
} as const;

export const RATING_CONFIG = {
  1: { label: "Very Poor", emoji: "😞", color: "#EF4444" },
  2: { label: "Poor", emoji: "😐", color: "#F59E0B" },
  3: { label: "Average", emoji: "😊", color: "#F59E0B" },
  4: { label: "Good", emoji: "😄", color: "#10B981" },
  5: { label: "Excellent", emoji: "🤩", color: "#10B981" },
} as const;

"use client";

/**
 * بازصادرِ آیکون‌های antd.
 *
 * `@ant-design/icons` رهنمودِ "use client" ندارد و داخلش createContext صدا زده
 * می‌شود، پس در Server Component مستقیم import شدنش بیلد را می‌شکند. این فایل
 * مرزِ کلاینت را می‌سازد؛ همه‌جا آیکون را از این‌جا بگیر.
 */
export {
  ArrowLeftOutlined,
  AudioOutlined,
  BulbOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckOutlined,
  CodeOutlined,
  CopyOutlined,
  FireOutlined,
  HeartOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlayCircleFilled,
  RobotOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ShopOutlined,
  SendOutlined,
  StarFilled,
  TeamOutlined,
} from "@ant-design/icons";

"use client";

/**
 * بازصادرِ تخت از antd برای Server Componentها.
 *
 * در RSC نمی‌شود `Typography.Title` یا `Card.Meta` نوشت: دسترسی به
 * ویژگیِ یک «client reference» خطا می‌دهد. این‌جا روی کلاینت باز می‌شوند و
 * با نام تخت صادر می‌شوند تا صفحه‌های سروری هم بتوانند استفاده‌شان کنند.
 */
import { Typography, Card, Skeleton, Breadcrumb, Collapse, Tabs, List } from "antd";

export const Title = Typography.Title;
export const Paragraph = Typography.Paragraph;
export const Text = Typography.Text;
export const TypoLink = Typography.Link;
export const ListItem = List.Item;
export const ListItemMeta = List.Item.Meta;
export const CardMeta = Card.Meta;
export const SkeletonButton = Skeleton.Button;
export const SkeletonAvatar = Skeleton.Avatar;
export const SkeletonImage = Skeleton.Image;
export const SkeletonInput = Skeleton.Input;
export const SkeletonNode = Skeleton.Node;
export { Card, Skeleton, Breadcrumb, Collapse, Tabs, List };
export {
  Button,
  Tag,
  Avatar,
  Rate,
  Empty,
  Result,
  Row,
  Col,
  Flex,
  Space,
  Divider,
  Badge,
  Alert,
  Statistic,
  Grid,
} from "antd";

import { CheckCircleFilled } from "@/components/icons";

/** تیک آبی «متخصص تاییدشده» — همه‌ی متخصص‌های لیست‌شده احراز هویت ادمین شده‌اند */
export default function VerifiedTick() {
  return (
    <CheckCircleFilled
      className="verified-tick"
      title="متخصص تاییدشده"
      aria-label="متخصص تاییدشده"
    />
  );
}

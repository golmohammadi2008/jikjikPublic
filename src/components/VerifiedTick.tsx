/** تیک آبی «متخصص تاییدشده» — همه‌ی متخصص‌های لیست‌شده احراز هویت ادمین شده‌اند */
export default function VerifiedTick() {
  return (
    <span className="verified-tick" title="متخصص تاییدشده" aria-label="متخصص تاییدشده">
      <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6.2 4.8 9 10 3.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

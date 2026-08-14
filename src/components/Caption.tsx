import { parseCaption, type CaptionSpan } from "@/lib/caption";
import CopyCodeButton from "@/components/CopyCodeButton";

function Span({ span }: { span: CaptionSpan }) {
  switch (span.type) {
    case "bold":
      return <strong>{span.text}</strong>;
    case "italic":
      return <em>{span.text}</em>;
    case "code":
      // dir=ltr چون کد در متنِ راست‌به‌چپ وگرنه وارونه چیده می‌شود
      return <code dir="ltr">{span.text}</code>;
    case "tag":
      // dir=auto تا # سرِ درستِ کلمه بنشیند: راستِ «#وینو» و چپِ «#php».
      // بدون این، در پاراگرافِ راست‌به‌چپ هر دو یک‌جور و یکی‌شان وارونه بود.
      return <span className="cap-tag" dir="auto">{span.text}</span>;
    default:
      return <>{span.text}</>;
  }
}

/**
 * کپشنِ پست با نشانه‌گذاری. هیچ‌جا dangerouslySetInnerHTML نیست — توکن‌ها به
 * المانِ ری‌اکت تبدیل می‌شوند، پس ورودیِ کاربر ذاتاً امن است.
 */
export default function Caption({ text }: { text: string }) {
  const blocks = parseCaption(text);

  return (
    <>
      {blocks.map((block, i) =>
        block.type === "code" ? (
          <figure className="code-block" key={i}>
            <figcaption>
              <span>{block.lang || "code"}</span>
              <CopyCodeButton code={block.code} />
            </figcaption>
            <pre dir="ltr">
              <code>{block.code}</code>
            </pre>
          </figure>
        ) : (
          <p key={i}>
            {block.spans.map((span, j) => (
              <Span key={j} span={span} />
            ))}
          </p>
        )
      )}
    </>
  );
}

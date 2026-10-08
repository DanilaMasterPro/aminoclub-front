/** Schema.org structured data. `<` is escaped so the JSON can never close the script tag. */
const LESS_THAN = /</g;
const ESCAPED_LESS_THAN = "\\" + "u003c";

export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(LESS_THAN, ESCAPED_LESS_THAN) }} />;
}

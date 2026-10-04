import { ExternalLink, ShieldCheck } from "lucide-react";
import { formatDate, source } from "@/lib/demo";

export function SourceBadge({ id, detail, linked = true }: { id: string; detail?: string; linked?: boolean }) {
  const item = source(id);
  return <div className="source-block">
    <span className="source-label"><ShieldCheck size={13} aria-hidden /> Nguồn chính thức</span>
    {linked ? <a href={item.canonical_url} target="_blank" rel="noopener noreferrer">
      {item.document_number ? `${item.title} ${item.document_number}` : item.publisher}
      <ExternalLink size={12} aria-hidden />
    </a> : <strong className="source-name">{item.document_number ? `${item.title} ${item.document_number}` : item.publisher}</strong>}
    <span className="verified">{detail ? `${detail} · ` : ""}Đã xác minh {formatDate(item.last_verified_at)}</span>
  </div>;
}

export function SourceDisclosure({ entries }: { entries: { id: string; detail?: string }[] }) {
  return <details className="source-disclosure"><summary>Căn cứ để AN SINH 360 đưa hướng dẫn này</summary>
    {entries.map((entry) => <div key={`${entry.id}-${entry.detail}`}><SourceBadge {...entry} linked={false} /><a className="text-action" href={source(entry.id).canonical_url} target="_blank" rel="noopener noreferrer">Xem nguồn chính thức<ExternalLink size={14} /></a></div>)}
  </details>;
}

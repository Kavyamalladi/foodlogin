"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyableId({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-[#E8D8CC] last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-mono text-xs text-[#0f172a] truncate">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8D8CC] bg-[#F9F4F0] hover:border-brand/40 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green-600" />
          : <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        }
      </button>
    </div>
  );
}

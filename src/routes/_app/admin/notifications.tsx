import { createFileRoute } from "@tanstack/react-router";
import { NOTIFICATION_LOG } from "@/lib/mock/data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_app/admin/notifications")({ component: NotificationsLog });

function NotificationsLog() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications log</h1>
        <p className="text-sm text-muted-foreground mt-1">Every WhatsApp/SMS/in-app message the platform has sent.</p>
      </div>
      <div className="rounded-lg border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recipient</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Channel</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fell back</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {NOTIFICATION_LOG.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{n.recipient}</td>
                <td className="px-4 py-3">{n.message}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={n.channel === "WhatsApp" ? "verified" : n.channel === "SMS (fallback)" ? "pending" : "neutral"}>
                    {n.channel}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{n.fellBack ? "Yes → SMS" : "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{n.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

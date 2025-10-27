// CHANGELOG: 2025-10-12 - Add lightweight monitoring helpers with webhook fallback
// CHANGELOG: 2025-10-12 - Fan out alerts to Slack and PagerDuty when configured
import { logError, logInfo } from "@/lib/log";

const monitoringWebhook = process.env.MONITORING_WEBHOOK_URL || "";
const slackWebhook = process.env.SLACK_ALERT_WEBHOOK_URL || "";
const pagerDutyRoutingKey = process.env.PAGERDUTY_ROUTING_KEY || "";

type MonitoringPayload = Record<string, unknown>;

async function postToWebhook(event: string, payload: MonitoringPayload) {
  if (!monitoringWebhook) {
    logInfo("monitoring.event", { event, ...payload });
    return;
  }

  try {
    await fetch(monitoringWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
    });
  } catch (error: unknown) {
    logError("Monitoring webhook failed", error, { event });
  }
}

export function trackEvent(event: string, payload: MonitoringPayload = {}) {
  void postToWebhook(event, payload);
  void postToSlack(event, payload);
}

export function trackError(event: string, payload: MonitoringPayload = {}) {
  logError(event, undefined, payload);
  void postToWebhook(`${event}.error`, payload);
  void postToSlack(event, payload, true);
  void postToPagerDuty(event, payload);
}

async function postToSlack(event: string, payload: MonitoringPayload, isError = false) {
  if (!slackWebhook) return;
  try {
    await fetch(slackWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `*[${isError ? "ERROR" : "EVENT"}]* ${event}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*[${isError ? "ERROR" : "EVENT"}]* ${event}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "```" + JSON.stringify(payload, null, 2) + "```",
            },
          },
        ],
      }),
    });
  } catch (error: unknown) {
    logError("Slack alert failed", error, { event });
  }
}

async function postToPagerDuty(event: string, payload: MonitoringPayload) {
  if (!pagerDutyRoutingKey) return;
  try {
    await fetch("https://events.pagerduty.com/v2/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routing_key: pagerDutyRoutingKey,
        event_action: "trigger",
        payload: {
          summary: event,
          source: payload.source || "avallon-cloud",
          severity: "error",
          custom_details: payload,
        },
      }),
    });
  } catch (error: unknown) {
    logError("PagerDuty alert failed", error, { event });
  }
}

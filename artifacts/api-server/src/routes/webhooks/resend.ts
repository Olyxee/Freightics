import { Router } from "express";
import { and, eq, ne } from "drizzle-orm";
import {
  db,
  emailNotificationsTable,
  notificationDeliveriesTable,
  notificationEventsTable,
  ordersTable,
} from "@workspace/db";
import { generateId } from "../../lib/id";
import { logger } from "../../lib/logger";
import { verifyResendWebhook } from "../../lib/resend-webhooks";

const router = Router();

router.post("/webhooks/resend", async (req, res) => {
  const rawBody =
    (req as unknown as { rawBody?: Buffer }).rawBody?.toString("utf8") ??
    JSON.stringify(req.body ?? {});

  if (!verifyResendWebhook(rawBody, req.headers as Record<string, unknown>)) {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  const event = req.body as {
    type?: string;
    data?: {
      email_id?: string;
      to?: string[];
      bounce?: { message?: string };
      suppression?: { reason?: string };
    };
  };

  const eventType = event?.type;
  if (eventType !== "email.bounced" && eventType !== "email.suppressed") {
    res.status(200).json({ received: true });
    return;
  }

  const emailId = event.data?.email_id;
  if (!emailId) {
    res.status(200).json({ received: true });
    return;
  }

  const status = eventType === "email.bounced" ? "bounced" : "suppressed";
  const reason =
    event.data?.bounce?.message ??
    event.data?.suppression?.reason ??
    "Email was not delivered";

  try {
    const [legacyEmail] = await db
      .update(emailNotificationsTable)
      .set({ status })
      .where(
        and(
          eq(emailNotificationsTable.providerMessageId, emailId),
          ne(emailNotificationsTable.status, status),
        ),
      )
      .returning();

    await db
  .update(notificationDeliveriesTable)
  .set({ status, failureReason: reason })
  .where(
    and(
      eq(notificationDeliveriesTable.providerMessageId, emailId),
      eq(notificationDeliveriesTable.channel, "email"),
      ne(notificationDeliveriesTable.status, status),
    ),
  );

    if (legacyEmail) {
      const order = await db.query.ordersTable.findFirst({
        where: eq(ordersTable.id, legacyEmail.orderId),
      });

      if (order) {
        const eventId = generateId();
        await db.insert(notificationEventsTable).values({
          id: eventId,
          orderId: legacyEmail.orderId,
          businessId: order.businessId,
          status: "EMAIL_DELIVERY_FAILED",
          message: `Email to ${legacyEmail.customerEmail} was not delivered: ${reason}`,
        });

        await db.insert(notificationDeliveriesTable).values({
          id: generateId(),
          eventId,
          channel: "email",
          status,
          recipient: legacyEmail.customerEmail,
          failureReason: reason,
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error({ error, emailId, eventType }, "Failed to process Resend webhook");
    res.status(200).json({ received: true });
  }
});

export default router;

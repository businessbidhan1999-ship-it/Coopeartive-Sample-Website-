// src/app/api/public/contact/route.ts
// Receives contact form submissions, validates server-side, saves to JSON.
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, generateId } from "@/lib/json-store";

interface ContactMessage {
  id: string;
  submittedAt: string;
  status: "new" | "reviewed" | "replied";
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const NEPALI_PHONE_RE = /^(\+977[-\s]?)?(9[78]\d{8}|0\d{8,9}|[1-9]\d{6,8})$/;
const EMAIL_RE = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: Partial<ContactMessage>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim().replace(/[\s\-]/g, "") ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length < 2 || name.length > 100) errors.name = "Name must be 2–100 characters";
  if (!NEPALI_PHONE_RE.test(phone)) errors.phone = "Enter a valid Nepali phone number";
  if (email && !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!message || message.length < 10) errors.message = "Message must be at least 10 characters";
  if (message.length > 2000) errors.message = "Message must be under 2000 characters";

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const contacts = await readJSON<ContactMessage[]>("submissions/contacts");
  const newMsg: ContactMessage = {
    id: generateId(),
    submittedAt: new Date().toISOString(),
    status: "new",
    name,
    phone,
    email,
    subject,
    message,
  };
  contacts.push(newMsg);
  await writeJSON("submissions/contacts", contacts);

  return NextResponse.json({ ok: true, id: newMsg.id }, { status: 201 });
}

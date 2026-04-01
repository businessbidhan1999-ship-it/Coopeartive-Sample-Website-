// src/app/api/public/apply/route.ts
// Receives online application submissions, validates server-side, saves to JSON.
import { NextRequest, NextResponse } from "next/server";
import { readJSON, writeJSON, generateId } from "@/lib/json-store";

interface Application {
  id: string;
  submittedAt: string;
  status: "new" | "reviewed" | "contacted";
  name: string;
  phone: string;
  email: string;
  product: string;
  message: string;
}

// Nepali phone: landline 01-XXXXXXX or mobile 9[78]XXXXXXXX (optionally +977 prefix)
const NEPALI_PHONE_RE = /^(\+977[-\s]?)?(9[78]\d{8}|0\d{8,9}|[1-9]\d{6,8})$/;
const EMAIL_RE = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: Partial<Application>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Server-side validation
  const errors: Record<string, string> = {};
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim().replace(/[\s\-]/g, "") ?? "";
  const email = body.email?.trim() ?? "";
  const product = body.product?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || name.length < 2 || name.length > 100) errors.name = "Name must be 2–100 characters";
  if (!NEPALI_PHONE_RE.test(phone)) errors.phone = "Enter a valid Nepali phone number";
  if (email && !EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  if (!product) errors.product = "Product selection is required";
  if (message.length > 1000) errors.message = "Message must be under 1000 characters";

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const applications = await readJSON<Application[]>("submissions/applications");
  const newApp: Application = {
    id: generateId(),
    submittedAt: new Date().toISOString(),
    status: "new",
    name,
    phone,
    email,
    product,
    message,
  };
  applications.push(newApp);
  await writeJSON("submissions/applications", applications);

  return NextResponse.json({ ok: true, id: newApp.id }, { status: 201 });
}

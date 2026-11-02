import { NextRequest, NextResponse } from 'next/server';
import { generateId, updateJSON } from './store';
import { getProducts } from './content';

export async function handleEnquiry(request: NextRequest, mode: 'apply' | 'contact') {
  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 12000)
      return NextResponse.json({ error: 'Please shorten your enquiry.' }, { status: 413 });
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: 'The form could not be read. Please try again.' },
      { status: 400 },
    );
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw))
    return NextResponse.json({ error: 'Invalid form details.' }, { status: 400 });
  const body = raw as Record<string, unknown>;
  const field = (key: string) =>
    typeof body[key] === 'string' ? (body[key] as string).trim() : '';
  if (field('website'))
    return NextResponse.json({ error: 'Unable to accept this enquiry.' }, { status: 422 });
  const name = field('name'),
    phone = field('phone').replace(/[\s()-]/g, ''),
    email = field('email'),
    message = field('message'),
    product = field('product'),
    subject = field('subject');
  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100)
    errors.name = 'Please use a sample name between 2 and 100 characters.';
  if (!/^(\+977)?(9[78]\d{8}|0\d{8,9})$/.test(phone))
    errors.phone = 'Use a valid-format Nepali sample phone number.';
  if (email && (email.length > 254 || !/^\S+@\S+\.[a-zA-Z]{2,}$/.test(email)))
    errors.email = 'Use an address such as member@example.com.';
  if (message.length > 2000 || (mode === 'contact' && message.length < 10))
    errors.message = 'Please write between 10 and 2000 characters.';
  if (subject.length > 150) errors.subject = 'Keep the subject under 150 characters.';
  if (field('consent') !== 'yes') errors.consent = 'Please confirm you are using sample details.';
  if (
    mode === 'apply' &&
    !['Membership', ...(await getProducts()).map((p) => p.name)].includes(product)
  )
    errors.product = 'Choose a service from the list.';
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  const submission = {
    id: generateId(),
    submittedAt: new Date().toISOString(),
    status: 'new',
    name,
    phone,
    email,
    message,
    ...(mode === 'apply' ? { product } : { subject }),
  };
  try {
    await updateJSON<Record<string, unknown>[]>(
      mode === 'apply' ? 'submissions/applications' : 'submissions/contacts',
      (items) => [...items, submission],
    );
    return NextResponse.json({ ok: true, id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'We couldn’t save this sample enquiry. Please try again later.' },
      { status: 503 },
    );
  }
}

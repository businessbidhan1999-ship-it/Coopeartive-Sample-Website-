'use client';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function EnquiryForm({
  mode,
  products = [],
  selectedProduct = '',
}: {
  mode: 'apply' | 'contact';
  products?: string[];
  selectedProduct?: string;
}) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setPending(true);
    setError('');
    setFieldErrors({});
    try {
      const response = await fetch(`/api/public/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        setFieldErrors(result.errors ?? {});
        throw new Error(result.error ?? 'Please check the highlighted fields and try again.');
      }
      setDone(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'We couldn’t send the form. Please check your connection and try again.',
      );
    } finally {
      setPending(false);
    }
  }
  const hint = (field: string) =>
    fieldErrors[field] ? (
      <span className="field-error" id={`${field}-error`}>
        {fieldErrors[field]}
      </span>
    ) : null;
  if (done)
    return (
      <div className="form-success" role="status" tabIndex={-1}>
        <CheckCircle2 size={42} strokeWidth={1.5} />
        <h2>Your demo enquiry is complete.</h2>
        <p>
          The sample details have been saved for the demo administrator to review. This does not
          open an account, arrange a callback or create a real membership.
        </p>
        <button className="button button-outline" onClick={() => setDone(false)}>
          Try another enquiry
        </button>
      </div>
    );
  return (
    <form className="enquiry-form" onSubmit={submit}>
      <h2>{mode === 'apply' ? 'Let’s start with the basics.' : 'What would you like to ask?'}</h2>
      <p className="form-intro">
        This is a demonstration. Please use invented contact details and do not include
        identification or financial information.
      </p>
      <div className="form-field">
        <label htmlFor="name">
          Full name <span>(required)</span>
        </label>
        <input
          id="name"
          name="name"
          autoComplete="off"
          required
          minLength={2}
          maxLength={100}
          placeholder="For example, Sample Member"
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
        />
        {hint('name')}
      </div>
      <div className="form-two-col">
        <div className="form-field">
          <label htmlFor="phone">
            Sample phone <span>(required)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            required
            maxLength={24}
            placeholder="9800000000"
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
          />
          {hint('phone')}
        </div>
        <div className="form-field">
          <label htmlFor="email">
            Sample email <span>(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            maxLength={254}
            placeholder="member@example.com"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          />
          {hint('email')}
        </div>
      </div>
      {mode === 'apply' ? (
        <div className="form-field">
          <label htmlFor="product">
            I’m interested in <span>(required)</span>
          </label>
          <select
            id="product"
            name="product"
            defaultValue={selectedProduct}
            required
            aria-invalid={!!fieldErrors.product}
            aria-describedby={fieldErrors.product ? 'product-error' : undefined}
          >
            <option value="">Choose a service</option>
            <option value="Membership">Membership</option>
            {products.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          {hint('product')}
        </div>
      ) : (
        <div className="form-field">
          <label htmlFor="subject">
            Subject <span>(optional)</span>
          </label>
          <input id="subject" name="subject" maxLength={150} placeholder="What is this about?" />
        </div>
      )}
      <div className="form-field">
        <label htmlFor="message">
          Your message{' '}
          <span>({mode === 'apply' ? 'optional' : 'required, at least 10 characters'})</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required={mode === 'contact'}
          minLength={mode === 'contact' ? 10 : undefined}
          maxLength={2000}
          placeholder="Try a sample question about a service or membership."
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
        />
        {hint('message')}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="checkbox-label">
        <input name="consent" type="checkbox" required value="yes" />I understand this is a demo and
        I am using sample details.
      </label>
      {hint('consent')}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={pending}>
        {pending ? 'Sending sample enquiry…' : 'Send demo enquiry'}
        <ArrowUpRight size={17} />
      </button>
      <p className="help-text">
        Sample details are stored on this demo server. No emails or text messages are sent.
      </p>
    </form>
  );
}

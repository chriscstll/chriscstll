'use client';

import { CascadeText, BlurIn } from '@/components/ui/motion-primitives';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { contact } from '@/data/portfolio';
import { useRef, useState } from 'react';

// TYPES+VALIDATION
type FieldName = 'name' | 'email' | 'message';
type FieldErrors = Partial<Record<FieldName, string>>;
type FieldValues = Record<FieldName, string>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const INITIAL_VALUES: FieldValues = {
  name: '',
  email: '',
  message: '',
};

const ERROR_COLOR = '#f87171';
const ERROR_BORDER = '#ef4444';

function validateField(name: FieldName, value: string): string | null {
  const trimmed = value.trim();

  switch (name) {
    case 'name':
      if (!trimmed) return 'Please enter your name.';
      if (trimmed.length < 2) return 'Name should be at least 2 characters.';
      if (trimmed.length > 80) return 'Name is too long (80 characters max).';
      return null;

    case 'email':
      if (!trimmed) return 'Please enter your email.';
      if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address (name@gmail.com).';
      if (trimmed.length > 120) return 'Email is too long.';
      return null;

    case 'message':
      if (!trimmed) return 'Please write a message.';
      if (trimmed.length < 10) return 'Message should be at least 10 characters.';
      if (trimmed.length > 1000) return 'Message is too long (1000 characters max).';
      return null;
  }
}
const SPAM_PATTERNS = [
  /(https?:\/\/.*){2,}/i,
  /\b(viagra|casino|crypto|bitcoin|forex|loan)\b/i,
  /[A-Z]{15,}/,
  /(.)\1{9,}/,
];
const looksLikeSpam = (message: string): boolean => SPAM_PATTERNS.some((p) => p.test(message));

export default function Contact() {
  const [values, setValues] = useState<FieldValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
    }
  };

  const handleBlur = (name: FieldName) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error ?? undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setTouched({ name: true, email: true, message: true });

    // 0. HONEYPOT
    if (honeypot) {
      setStatus('success');
      setValues(INITIAL_VALUES);
      return;
    }

    const MAX_LENGTHS = { name: 80, email: 120, message: 1000 };

    // 1. REJECT OVERSIZED PAYLOAD
    if (
      values.name.length > MAX_LENGTHS.name * 2 ||
      values.email.length > MAX_LENGTHS.email * 2 ||
      values.message.length > MAX_LENGTHS.message * 2
    ) {
      setServerError('Message is too long. Please shorten it.');
      return;
    }

    // 2. RATE LIMIT
    const RATE_LIMIT_MS = 60_000;
    const lastSubmit = Number(localStorage.getItem('contact_submitted_at') || 0);
    const now = Date.now();
    if (now - lastSubmit < RATE_LIMIT_MS) {
      const secondsLeft = Math.ceil((RATE_LIMIT_MS - (now - lastSubmit)) / 1000);
      setServerError(`Please wait ${secondsLeft}s before sending another message.`);
      return;
    }

    // 3. TRIMMED VALUES
    const trimmed = {
      name: values.name.trim().slice(0, MAX_LENGTHS.name),
      email: values.email.trim().slice(0, MAX_LENGTHS.email),
      message: values.message.trim().slice(0, MAX_LENGTHS.message),
    };

    // 4. SPAM CHECK
    if (looksLikeSpam(trimmed.message) || looksLikeSpam(trimmed.name)) {
      setServerError('Your message was flagged as spam. If this is a mistake, email me directly.');
      return;
    }

    // 5. FFIELD VALIDATION
    const newErrors: FieldErrors = {};
    (Object.keys(trimmed) as FieldName[]).forEach((key) => {
      const err = validateField(key, trimmed[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstInvalid = (['name', 'email', 'message'] as FieldName[]).find((key) => newErrors[key]);
      if (firstInvalid) {
        const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
        el?.focus();
      }
      return;
    }

    // 6. SEND
    setStatus('submitting');

    const formData = new FormData();
    formData.append('name', trimmed.name);
    formData.append('email', trimmed.email);
    formData.append('message', trimmed.message);

    try {
      const res = await fetch(contact.formspreeEndpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        setValues(INITIAL_VALUES);
        setErrors({});
        setTouched({});
        localStorage.setItem('contact_submitted_at', String(Date.now()));
      } else {
        setStatus('error');
        setServerError("We couldn't send your message right now. Please try again, or email me directly.");
      }
    } catch {
      setStatus('error');
      setServerError('Network error. Please check your connection or email me directly.');
    }
  };

  return (
    <section
      id="contact"
      className="section-container">
      <div className="flex max-w-2xl flex-col items-start">
        <CascadeText
          as="h2"
          text="Let's Talk"
          className="mb-5 font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
          charClassName="gradient-text"
          delay={0.25}
          stagger={0.06}
          blur={10}
          y={-14}
        />

        <BlurIn
          delay={0.75}
          blur={8}
          y={10}
          className="mb-10 max-w-xl">
          <p
            className="text-sm italic leading-relaxed sm:text-base"
            style={{ color: 'var(--color-foreground-subtle)' }}>
            {contact.tagline}
          </p>
        </BlurIn>

        {/* FORM */}
        <BlurIn
          delay={1.1}
          blur={10}
          y={14}
          className="w-full">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-4 rounded-lg border p-6"
                style={{
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-subtle)',
                }}>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-background)',
                  }}>
                  <Check
                    size={18}
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <p
                    className="font-heading text-base font-bold"
                    style={{ color: 'var(--color-foreground)' }}>
                    Message sent.
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: 'var(--color-foreground-muted)' }}>
                    Thanks for reaching out — I&apos;ll get back to you soon.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="text-xs transition-colors duration-200 hover:text-accent"
                  style={{ color: 'var(--color-foreground-subtle)' }}>
                  Send another →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
                noValidate>
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden',
                  }}
                />

                {/* NAME + EMAIL */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Your name"
                    value={values.name}
                    onChange={(v) => handleChange('name', v)}
                    onBlur={() => handleBlur('name')}
                    error={errors.name}
                    touched={!!touched.name}
                    disabled={status === 'submitting'}
                    maxLength={80}
                    autoComplete="name"
                  />
                  <Field
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(v) => handleChange('email', v)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    touched={!!touched.email}
                    disabled={status === 'submitting'}
                    maxLength={120}
                    autoComplete="name"
                  />
                </div>

                {/* MESSAGE */}
                <Field
                  name="message"
                  label="Message"
                  type="textarea"
                  placeholder="Tell me what we're working on…"
                  value={values.message}
                  onChange={(v) => handleChange('message', v)}
                  onBlur={() => handleBlur('message')}
                  error={errors.message}
                  touched={!!touched.message}
                  disabled={status === 'submitting'}
                  rows={5}
                  maxLength={1000}
                  autoComplete="name"
                />

                {/* SUBMIT + SERVER ERROR */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex self-start items-center justify-center gap-2 rounded-md border px-2.5 py-1 text-m font-semibold tracking-normal cursor-pointer transition-all duration-500 ease-out hover:tracking-[0.15em] disabled:opacity-60 text-accent"
                    style={{ borderColor: 'var(--color-accent-text)' }}>
                    {status === 'submitting' ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Sending…
                      </>
                    ) : (
                      <>Send message</>
                    )}
                  </button>

                  <AnimatePresence>
                    {serverError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-1.5 text-xs"
                        style={{ color: ERROR_COLOR }}
                        role="alert">
                        <AlertCircle
                          size={12}
                          className="mt-0.5 shrink-0"
                        />
                        {serverError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </BlurIn>

        {/* EMAIL FALLBACK */}
        <BlurIn
          delay={1.35}
          blur={6}
          y={10}>
          <div
            className="mt-8 pt-6 text-sm"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-foreground-subtle)',
            }}>
            <p>
              Prefer email?{' '}
              <a
                href={`mailto:${contact.email}`}
                className="underline-offset-4 transition-colors duration-200 hover:underline"
                style={{ color: 'var(--color-accent)' }}>
                {contact.email}
              </a>
            </p>
          </div>
        </BlurIn>
      </div>
    </section>
  );
}

//  FIELD — controlled input with inline validation feedback
type FieldProps = {
  name: FieldName;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
};

function Field({
  name,
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  rows = 4,
  maxLength,
  autoComplete,
}: FieldProps) {
  const hasError = touched && !!error;
  const isValid = touched && !error && value.trim().length > 0;
  const nearLimit = maxLength ? value.length > maxLength * 0.9 : false;

  const inputClasses =
    'w-full rounded-md border bg-transparent px-4 py-3 text-sm outline-none transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-[color:var(--color-foreground-subtle)]';

  const inputStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-card)',
    borderColor: hasError ? ERROR_BORDER : 'var(--color-border)',
    color: 'var(--color-foreground)',
  };

  return (
    <label className="flex flex-col gap-2">
      {/* LABEL ROW */}
      <span
        className="flex items-center justify-between text-xs font-medium uppercase tracking-wider"
        style={{ color: 'var(--color-foreground-muted)' }}>
        <span>{label}</span>
        {maxLength && type === 'textarea' && (
          <span
            className="font-mono text-[10px] normal-case tracking-normal"
            style={{
              color: nearLimit ? ERROR_COLOR : 'var(--color-foreground-subtle)',
            }}>
            {value.length} / {maxLength}
          </span>
        )}
      </span>

      {/* INPUT + STATUS ICON */}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            name={name}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={inputClasses}
            style={inputStyle}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        ) : (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={inputClasses}
            style={inputStyle}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : undefined}
          />
        )}

        {/* VALID / INVALID ICON */}
        {touched && (isValid || hasError) && (
          <span
            className="pointer-events-none absolute right-3"
            style={{
              top: type === 'textarea' ? '0.75rem' : '50%',
              transform: type === 'textarea' ? 'none' : 'translateY(-50%)',
            }}>
            {isValid && (
              <Check
                size={14}
                strokeWidth={2.5}
                style={{ color: 'var(--color-accent)' }}
              />
            )}
            {hasError && (
              <AlertCircle
                size={14}
                strokeWidth={2.5}
                style={{ color: ERROR_BORDER }}
              />
            )}
          </span>
        )}
      </div>

      {/* INLINE ERROR */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            id={`${name}-error`}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-1.5 overflow-hidden text-xs"
            style={{ color: ERROR_COLOR }}
            role="alert">
            <AlertCircle
              size={11}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

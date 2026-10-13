import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Loader2, MessageCircle, Phone, Send } from 'lucide-react';
import { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import {
  ENQUIRIES_VIA_WHATSAPP,
  INTERESTS,
  inquiryWhatsappLink,
  submitInquiry,
  todayIso,
  validateInquiry,
  type Inquiry,
  type InquiryErrors,
  type Interest,
  type StayRequest,
} from '@/lib/inquiry';
import { SITE, WHATSAPP_GENERAL } from '@/lib/site';

const EMPTY: Inquiry = {
  name: '',
  phone: '',
  interest: 'stay',
  checkIn: '',
  checkOut: '',
  guests: '2',
  message: '',
};

type FormState =
  | { status: 'idle' | 'prefilled' | 'sending' | 'sent' | 'whatsapp' }
  | { status: 'failed'; message: string };

interface ContactProps {
  /** Set when the visitor uses the hero's availability bar. */
  stayRequest: StayRequest | null;
}

export default function Contact({ stayRequest }: ContactProps) {
  const [form, setForm] = useState<Inquiry>(EMPTY);
  const nameRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<FormState>({ status: 'idle' });
  const sending = state.status === 'sending';

  // Carry the dates over and bring the visitor to the fields still needed
  useEffect(() => {
    if (!stayRequest) return;
    setForm((f) => ({ ...f, interest: 'stay', ...stayRequest }));
    setState({ status: 'prefilled' });
    // Straight to the form: on phones the section heading alone fills the screen
    nameRef.current?.form?.scrollIntoView();
    nameRef.current?.focus({ preventScroll: true });
  }, [stayRequest]);

  const set = <K extends keyof Inquiry>(key: K, value: Inquiry[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setState({ status: 'idle' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const found = validateInquiry(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (ENQUIRIES_VIA_WHATSAPP) {
      // Opened straight from the click so browsers do not block it as a pop-up
      window.open(inquiryWhatsappLink(form), '_blank', 'noopener');
      setState({ status: 'whatsapp' });
      return;
    }

    setState({ status: 'sending' });
    const result = await submitInquiry(form, website);
    if (result.status === 'sent') {
      setForm(EMPTY);
      setState({ status: 'sent' });
    } else if (result.status === 'invalid') {
      setErrors(result.errors);
      setState({ status: 'idle' });
    } else {
      setState({ status: 'failed', message: result.message });
    }
  };

  return (
    <section id="contact" className="section bg-cream">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Plan your visit" title="Tell us what you have in mind.">
            Ask about rooms, the meeting hall, the café or a gathering. Send the form, or reach us
            directly — we are happy to help.
          </SectionHeading>

          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <RevealItem>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-4 rounded-2xl border border-forest/15 bg-white p-5 transition-colors hover:border-gold"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-ink/55">Call us</span>
                  <span className="block font-medium text-forest-deep">{SITE.phone}</span>
                </span>
              </a>
            </RevealItem>
            <RevealItem>
              <a
                href={WHATSAPP_GENERAL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-forest/15 bg-white p-5 transition-colors hover:border-gold"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-gold">
                  <MessageCircle size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-ink/55">WhatsApp</span>
                  <span className="block font-medium text-forest-deep">Chat with the lodge</span>
                </span>
              </a>
            </RevealItem>
          </RevealGroup>
        </div>

        <RevealGroup className="lg:col-span-7">
          <RevealItem>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="scroll-mt-24 rounded-[1.5rem] bg-white p-6 shadow-soft sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="field-label">
                    Your name
                  </label>
                  <input
                    id="name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className="field"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-sm text-red-700">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="field-label">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="09…"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className="field"
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1.5 text-sm text-red-700">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="interest" className="field-label">
                    I am interested in
                  </label>
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={(e) => set('interest', e.target.value as Interest)}
                    className="field"
                  >
                    {Object.entries(INTERESTS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {form.interest === 'stay' && (
                  <div className="grid grid-cols-2 gap-5 sm:col-span-2 sm:grid-cols-3">
                    <div>
                      <label htmlFor="checkIn" className="field-label">
                        Check-in <span className="normal-case text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="checkIn"
                        type="date"
                        min={todayIso()}
                        value={form.checkIn}
                        onChange={(e) => set('checkIn', e.target.value)}
                        className="field"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="field-label">
                        Check-out <span className="normal-case text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="checkOut"
                        type="date"
                        min={form.checkIn || undefined}
                        value={form.checkOut}
                        onChange={(e) => set('checkOut', e.target.value)}
                        aria-invalid={!!errors.checkOut}
                        aria-describedby={errors.checkOut ? 'checkOut-error' : undefined}
                        className="field"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label htmlFor="guests" className="field-label">
                        Guests <span className="normal-case text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="guests"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={form.guests}
                        onChange={(e) => set('guests', e.target.value)}
                        className="field"
                      />
                    </div>
                    {errors.checkOut && (
                      <p id="checkOut-error" className="col-span-full -mt-3 text-sm text-red-700">
                        {errors.checkOut}
                      </p>
                    )}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="field-label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="field resize-none"
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-sm text-red-700">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot: hidden from people, tempting to bots. The server drops anything that fills it. */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-forest mt-6 w-full disabled:opacity-70 sm:w-auto"
              >
                {sending ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                {sending ? 'Sending…' : ENQUIRIES_VIA_WHATSAPP ? 'Continue on WhatsApp' : 'Send enquiry'}
              </button>

              <p className="mt-3 text-xs text-ink/55">
                This sends an enquiry, not a confirmed reservation. The lodge will contact you to
                confirm.
              </p>

              <div role="status" className="mt-4 min-h-[1.5rem] text-sm">
                {state.status === 'prefilled' && (
                  <p className="flex items-start gap-2 text-forest">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Your dates are filled in. Add your name, phone number and a short message so
                    the lodge can confirm availability.
                  </p>
                )}
                {state.status === 'whatsapp' && (
                  <p className="flex items-start gap-2 text-forest">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    WhatsApp has opened with your enquiry ready — press send there to reach the
                    lodge.
                  </p>
                )}
                {state.status === 'sent' && (
                  <p className="flex items-start gap-2 text-forest">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    Thank you — your enquiry has reached the lodge. We will call you back soon.
                  </p>
                )}
                {state.status === 'failed' && (
                  <div className="rounded-xl bg-red-50 p-4 text-red-800">
                    <p className="flex items-start gap-2">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {state.message} Your details are still here — you can send them on WhatsApp
                      instead.
                    </p>
                    <a
                      href={inquiryWhatsappLink(form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-forest mt-3 w-full sm:w-auto"
                    >
                      <MessageCircle size={16} aria-hidden="true" /> Send on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </form>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

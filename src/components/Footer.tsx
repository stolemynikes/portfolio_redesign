import { useRef, useState } from 'react';

// Web3Forms: paste your free access key from https://web3forms.com (no
// backend needed — it emails the submission to you). Until it's replaced,
// the form gracefully falls back to opening the visitor's mail client.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
const CONTACT_EMAIL = 'contact@pepijnscheer.nl';

type Status = 'idle' | 'sending' | 'success' | 'error';
interface Errors {
  naam?: string;
  email?: string;
  bericht?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { naam: string; email: string; bericht: string }): Errors {
  const e: Errors = {};
  if (!values.naam.trim()) e.naam = 'Vul je naam in.';
  if (!values.email.trim()) e.email = 'Vul je e-mailadres in.';
  else if (!EMAIL_RE.test(values.email)) e.email = 'Dit lijkt geen geldig e-mailadres.';
  if (!values.bericht.trim()) e.bericht = 'Schrijf een kort bericht.';
  else if (values.bericht.trim().length < 10) e.bericht = 'Iets meer context helpt — min. 10 tekens.';
  return e;
}

export default function Footer() {
  const [values, setValues] = useState({ naam: '', email: '', bericht: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const setField = (field: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) setErrors(validate({ ...values, [field]: value }));
  };

  const blur = (field: keyof typeof values) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  };

  const mailtoFallback = () => {
    const body = encodeURIComponent(`${values.bericht}\n\n— ${values.naam}`);
    const subject = encodeURIComponent(`Bericht via portfolio — ${values.naam}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ naam: true, email: true, bericht: true });
    if (Object.keys(found).length) {
      // Move focus to the first invalid field
      const first = (['naam', 'email', 'bericht'] as const).find((k) => found[k]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    // No key configured yet → open the visitor's mail client instead
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      mailtoFallback();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: values.naam,
          email: values.email,
          message: values.bericht,
          subject: `Bericht via portfolio — ${values.naam}`,
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setStatus('success');
      setValues({ naam: '', email: '', bericht: '' });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer id="contact" className="footer">
      <div className="grid-12 contact">
        <div className="contact-intro">
          <p className="label" data-reveal="fade">
            Contact
          </p>
          <h2 className="heading-2 contact-heading" data-reveal="lines">
            Laten we iets bouwen
          </h2>
          <p className="contact-sub" data-reveal="fade">
            Een project, een vraag of gewoon even sparren? Laat een bericht
            achter — ik reageer meestal binnen een dag.
          </p>
        </div>

        {status === 'success' ? (
          <div className="contact-success" role="status" data-reveal="fade">
            <span className="contact-success-mark" aria-hidden="true">
              &#10003;
            </span>
            <p className="heading-2">Bedankt!</p>
            <p className="contact-sub">
              Je bericht is verstuurd. Ik neem snel contact met je op.
            </p>
            <button type="button" className="link-underline" onClick={() => setStatus('idle')}>
              Nog een bericht sturen
            </button>
          </div>
        ) : (
          <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate data-reveal="fade">
            <div className={`field ${touched.naam && errors.naam ? 'field-error' : ''}`}>
              <label htmlFor="naam">
                Naam <span aria-hidden="true">*</span>
              </label>
              <input
                id="naam"
                name="naam"
                type="text"
                autoComplete="name"
                value={values.naam}
                onChange={(e) => setField('naam', e.target.value)}
                onBlur={() => blur('naam')}
                aria-invalid={!!(touched.naam && errors.naam)}
                aria-describedby={touched.naam && errors.naam ? 'err-naam' : undefined}
              />
              {touched.naam && errors.naam && (
                <p className="field-msg" id="err-naam" role="alert">
                  {errors.naam}
                </p>
              )}
            </div>

            <div className={`field ${touched.email && errors.email ? 'field-error' : ''}`}>
              <label htmlFor="email">
                E-mail <span aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => blur('email')}
                aria-invalid={!!(touched.email && errors.email)}
                aria-describedby={touched.email && errors.email ? 'err-email' : undefined}
              />
              {touched.email && errors.email && (
                <p className="field-msg" id="err-email" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className={`field ${touched.bericht && errors.bericht ? 'field-error' : ''}`}>
              <label htmlFor="bericht">
                Bericht <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="bericht"
                name="bericht"
                rows={5}
                value={values.bericht}
                onChange={(e) => setField('bericht', e.target.value)}
                onBlur={() => blur('bericht')}
                aria-invalid={!!(touched.bericht && errors.bericht)}
                aria-describedby={touched.bericht && errors.bericht ? 'err-bericht' : undefined}
              />
              {touched.bericht && errors.bericht && (
                <p className="field-msg" id="err-bericht" role="alert">
                  {errors.bericht}
                </p>
              )}
            </div>

            {status === 'error' && (
              <p className="field-msg contact-form-error" role="alert">
                Er ging iets mis bij het versturen.{' '}
                <button type="button" className="link-underline" onClick={mailtoFallback}>
                  Mail direct
                </button>
                .
              </p>
            )}

            <button type="submit" className="contact-submit glass" disabled={status === 'sending'}>
              {status === 'sending' ? 'Versturen…' : 'Verstuur bericht'}
              <span className="contact-submit-arrow" aria-hidden="true">
                &rarr;
              </span>
            </button>
          </form>
        )}
      </div>

      <div className="footer-bottom">
        <span className="label">&copy; {new Date().getFullYear()} Pepijn Scheer</span>
        <a
          href="https://github.com/pepijnscheer"
          className="label link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

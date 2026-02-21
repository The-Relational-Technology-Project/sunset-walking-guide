import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

function useFormSubmit() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const reset = () => { setStatus('idle'); setErrorMsg(''); };

  return { status, setStatus, errorMsg, setErrorMsg, reset };
}

export function About() {
  // Tour request form
  const tour = useFormSubmit();
  const [tourName, setTourName] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [tourMessage, setTourMessage] = useState('');

  // Suggest a site form
  const suggest = useFormSubmit();
  const [suggestLayer, setSuggestLayer] = useState('');
  const [suggestDetails, setSuggestDetails] = useState('');
  const [suggestName, setSuggestName] = useState('');
  const [suggestEmail, setSuggestEmail] = useState('');

  // Get in touch form
  const contact = useFormSubmit();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    tour.setErrorMsg('');
    const n = tourName.trim(), em = tourEmail.trim(), m = tourMessage.trim();
    if (!n || !em || !m) { tour.setErrorMsg('All fields are required.'); return; }
    if (!validateEmail(em)) { tour.setErrorMsg('Please enter a valid email address.'); return; }
    if (m.length > 1000) { tour.setErrorMsg('Message must be under 1,000 characters.'); return; }
    tour.setStatus('submitting');
    const { error } = await supabase.from('tour_requests').insert({ name: n, email: em, message: m });
    tour.setStatus(error ? 'error' : 'success');
    if (error) tour.setErrorMsg('Something went wrong. Please try again.');
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    suggest.setErrorMsg('');
    const layer = suggestLayer, d = suggestDetails.trim();
    if (!layer || !d) { suggest.setErrorMsg('Time layer and details are required.'); return; }
    if (d.length > 1000) { suggest.setErrorMsg('Details must be under 1,000 characters.'); return; }
    const em = suggestEmail.trim();
    if (em && !validateEmail(em)) { suggest.setErrorMsg('Please enter a valid email address.'); return; }
    suggest.setStatus('submitting');
    const { error } = await supabase.from('site_suggestions').insert({
      time_layer: layer,
      details: d,
      name: suggestName.trim() || null,
      email: em || null,
    });
    suggest.setStatus(error ? 'error' : 'success');
    if (error) suggest.setErrorMsg('Something went wrong. Please try again.');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contact.setErrorMsg('');
    const n = contactName.trim(), em = contactEmail.trim(), m = contactMessage.trim();
    if (!n || !em || !m) { contact.setErrorMsg('All fields are required.'); return; }
    if (!validateEmail(em)) { contact.setErrorMsg('Please enter a valid email address.'); return; }
    if (m.length > 1000) { contact.setErrorMsg('Message must be under 1,000 characters.'); return; }
    contact.setStatus('submitting');
    const { error } = await supabase.from('contact_messages').insert({ name: n, email: em, message: m });
    contact.setStatus(error ? 'error' : 'success');
    if (error) contact.setErrorMsg('Something went wrong. Please try again.');
  };

  return (
    <div className="px-6 py-6 pb-12 space-y-8 max-w-prose">
      <div className="space-y-4">
        <h2 className="serif text-lg font-medium text-foreground">About this guide</h2>
        <p className="text-sm leading-relaxed text-foreground/80">The Outer Sunset Field Guide is a neighborhood exploration companion. This version including past, present, and future landmarks centered on the blocks around 48th Avenue and Irving Street in San Francisco's Outer Sunset.</p>
        <p className="text-sm leading-relaxed text-foreground/80">It was made by neighbors, for neighbors. The content comes from community members, local historians, and people who love this place.</p>
      </div>

      <div className="border-t border-border pt-6 space-y-3">
        <h3 className="serif text-sm font-medium text-foreground">The time layers</h3>
        <div className="space-y-2">
          {[
            { circles: '● ○ ○', label: 'Past', desc: 'Historical sites, old photo locations, historical podcasts.' },
            { circles: '○ ● ○', label: 'Present', desc: 'Local businesses, art, and gathering spaces.' },
            { circles: '○ ○ ●', label: 'Future', desc: 'Community dreams, planned projects, neighbor aspirations.' },
          ].map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <span className="text-xs text-foreground/60 font-mono mt-0.5 flex-shrink-0 w-14">{row.circles}</span>
              <div>
                <span className="text-xs font-medium text-foreground">{row.label}</span>
                <span className="text-xs text-muted-foreground"> — {row.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-2">
        <h3 className="serif text-sm font-medium text-foreground">Community credits</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Illustrated thumbnails are placeholder sketches for the prototype. Our intent is to commission a local Outer Sunset artist to create the final illustrations. Historical research informed by the Western Neighborhoods Project and the San Francisco Public Library.
        </p>
      </div>

      {/* Suggest a site */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="serif text-sm font-medium text-foreground">Suggest a site</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Know a spot that belongs in the field guide? Tell us about it — past, present, or future.
        </p>

        {suggest.status === 'success' ? (
          <div className="py-6 text-center space-y-1">
            <p className="serif text-sm text-foreground">Thanks for the suggestion!</p>
            <p className="text-xs text-muted-foreground">We'll look into adding it.</p>
          </div>
        ) : (
          <form onSubmit={handleSuggestSubmit} className="space-y-3">
            <div className="flex gap-3">
              {['past', 'present', 'future'].map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => setSuggestLayer(layer)}
                  className={`serif text-[11px] tracking-[0.1em] uppercase py-1.5 px-3 border rounded-full transition-colors ${
                    suggestLayer === layer
                      ? 'border-foreground/40 text-foreground bg-foreground/5'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
            <textarea
              placeholder="What's the place? Why does it matter?"
              value={suggestDetails}
              onChange={(e) => setSuggestDetails(e.target.value.slice(0, 1000))}
              rows={3}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={suggestName}
              onChange={(e) => setSuggestName(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={suggestEmail}
              onChange={(e) => setSuggestEmail(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            {suggest.errorMsg && (
              <p className="text-xs text-destructive">{suggest.errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={suggest.status === 'submitting'}
              className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors py-2 disabled:opacity-40"
            >
              {suggest.status === 'submitting' ? 'Sending…' : 'Submit suggestion →'}
            </button>
          </form>
        )}
      </div>

      {/* Get in touch */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="serif text-sm font-medium text-foreground">Get in touch</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Have a question, correction, or just want to say hello? We'd love to hear from you.
        </p>

        {contact.status === 'success' ? (
          <div className="py-6 text-center space-y-1">
            <p className="serif text-sm text-foreground">Message received!</p>
            <p className="text-xs text-muted-foreground">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <textarea
              placeholder="What's on your mind?"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value.slice(0, 1000))}
              rows={3}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
            {contact.errorMsg && (
              <p className="text-xs text-destructive">{contact.errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={contact.status === 'submitting'}
              className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors py-2 disabled:opacity-40"
            >
              {contact.status === 'submitting' ? 'Sending…' : 'Send message →'}
            </button>
          </form>
        )}
      </div>

      {/* Request a tour */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="serif text-sm font-medium text-foreground">Request a neighborhood tour</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Want to explore the Outer Sunset with a neighbor who knows the stories? Drop us a note.
        </p>

        {tour.status === 'success' ? (
          <div className="py-6 text-center space-y-1">
            <p className="serif text-sm text-foreground">Thanks for reaching out!</p>
            <p className="text-xs text-muted-foreground">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleTourSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={tourEmail}
              onChange={(e) => setTourEmail(e.target.value)}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors"
            />
            <textarea
              placeholder="Group size, preferred dates, what you're curious about..."
              value={tourMessage}
              onChange={(e) => setTourMessage(e.target.value.slice(0, 1000))}
              rows={3}
              className="w-full text-sm bg-transparent border-b border-border py-2 px-0 placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
            />
            {tour.errorMsg && (
              <p className="text-xs text-destructive">{tour.errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={tour.status === 'submitting'}
              className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground transition-colors py-2 disabled:opacity-40"
            >
              {tour.status === 'submitting' ? 'Sending…' : 'Send request →'}
            </button>
          </form>
        )}
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          This is an early prototype. Content may be incomplete or inaccurate. Location data is used only within your browser and is never stored or transmitted.
        </p>
      </div>
    </div>
  );
}

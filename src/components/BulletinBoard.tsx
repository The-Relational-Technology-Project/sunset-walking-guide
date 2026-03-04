interface SiblingSite {
  question: string;
  name: string;
  domain: string;
  url: string;
  cardBg: string;
  rotation: string;
  pinPosition: string;
  pinColor: string;
}

const SIBLING_SITES: SiblingSite[] = [
  {
    question: "Live near 48th and Irving?",
    name: "Cozy Corner Neighbor Hub",
    domain: "cozycorner.place",
    url: "https://cozycorner.place",
    cardBg: "hsl(38 30% 93%)",
    rotation: "-3deg",
    pinPosition: "left-[40%]",
    pinColor: "#9c5a4a",
  },
  {
    question: "Looking for local community?",
    name: "Community Guide",
    domain: "outersunset.us",
    url: "https://outersunset.us/",
    cardBg: "hsl(210 20% 93%)",
    rotation: "1.5deg",
    pinPosition: "left-1/2 -translate-x-1/2",
    pinColor: "#3a6e9e",
  },
  {
    question: "Want to share things with neighbors?",
    name: "Community Supplies",
    domain: "communitysupplies.org",
    url: "https://communitysupplies.org",
    cardBg: "hsl(30 40% 94%)",
    rotation: "-1deg",
    pinPosition: "right-5",
    pinColor: "#c87a2e",
  },
  {
    question: "Curious what's happening today?",
    name: "Outer Sunset Today",
    domain: "outersunset.today",
    url: "https://outersunset.today",
    cardBg: "hsl(100 18% 92%)",
    rotation: "2.5deg",
    pinPosition: "left-[30%]",
    pinColor: "#5a7a52",
  },
];

function darken(hex: string): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - 40);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - 40);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - 40);
  return `rgb(${r},${g},${b})`;
}

function Pushpin({ position, color }: { position: string; color: string }) {
  return (
    <div className={`absolute top-2 ${position} pointer-events-none`}>
      <div
        className="absolute top-[2px] left-[1px] w-4 h-4 rounded-full"
        style={{ background: "rgba(0,0,0,0.25)", filter: "blur(1px)" }}
      />
      <div
        className="relative w-4 h-4 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${color}, ${darken(color)})`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute top-[2px] left-[3px] w-[5px] h-[5px] rounded-full"
          style={{ background: "rgba(255,255,255,0.55)" }}
        />
      </div>
    </div>
  );
}

function PinnedCard({ site }: { site: SiblingSite }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block text-center p-4 pt-8 transition-all duration-200"
      style={{
        backgroundColor: site.cardBg,
        transform: `rotate(${site.rotation})`,
        boxShadow: "1px 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
        borderRadius: "2px",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "rotate(0deg) scale(1.05) translateY(-4px)";
        e.currentTarget.style.boxShadow = "2px 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${site.rotation})`;
        e.currentTarget.style.boxShadow = "1px 2px 6px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)";
      }}
    >
      <Pushpin position={site.pinPosition} color={site.pinColor} />
      <p className="serif text-sm font-medium leading-snug mb-2 text-foreground">
        {site.question}
      </p>
      <p className="text-xs leading-tight text-foreground/75">
        {site.name}
      </p>
      <p className="mt-1.5 text-[11px] font-mono text-muted-foreground">
        {site.domain}
      </p>
    </a>
  );
}

export function BulletinBoard() {
  return (
    <div className="border-t border-border pt-6 space-y-4">
      <h3 className="serif text-sm font-medium text-foreground">Neighborhood projects</h3>
      <div
        className="rounded-sm p-5 pb-6"
        style={{
          backgroundColor: "hsl(35 20% 82%)",
          backgroundImage: `
            radial-gradient(circle, hsl(35 15% 74%) 1px, transparent 1px),
            radial-gradient(circle, hsl(38 18% 86%) 0.5px, transparent 0.5px)
          `,
          backgroundSize: "8px 8px, 12px 12px",
          backgroundPosition: "0 0, 4px 4px",
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {SIBLING_SITES.map((site) => (
            <PinnedCard key={site.domain} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
}

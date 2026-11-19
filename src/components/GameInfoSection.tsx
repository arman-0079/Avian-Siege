import { useState } from 'react';
import { trackAnalyticsEvent } from '../utils/analytics';

interface GameInfoSectionProps {
  onBackToGame: () => void;
}

type RosterTab = 'birds' | 'materials' | 'pigs' | 'powerups';

interface RosterEntry {
  name: string;
  role: string;
  detail: string;
}

const ROSTER_DATA: Record<RosterTab, RosterEntry[]> = {
  birds: [
    {
      name: 'Red',
      role: 'Balanced Striker',
      detail: 'Reliable weight and impact velocity for breaking wooden beams and triggering unstable joints.',
    },
    {
      name: 'Blue',
      role: 'Triple Splitter',
      detail: 'Tap or press Space mid-flight to split into three birds that shatter glass and ice barriers.',
    },
    {
      name: 'Yellow',
      role: 'Mach Dash',
      detail: 'Accelerates forward along its flight vector to punch cleanly through thick wood fortifications.',
    },
    {
      name: 'Black',
      role: 'Bomber',
      detail: 'Detonates on command or shortly after impact to blast apart heavy stone and armored defenses.',
    },
    {
      name: 'White',
      role: 'Egg Dropper',
      detail: 'Releases an explosive egg straight downward while propelling the bird upward into higher towers.',
    },
    {
      name: 'Big Brother',
      role: 'Heavy Crusher',
      detail: 'Oversized mass and momentum built to bowl directly through multi-layered fortress walls.',
    },
    {
      name: 'Green',
      role: 'Boomerang',
      detail: 'Reverses direction mid-air to loop back and strike defended pigs from behind shield walls.',
    },
  ],
  materials: [
    {
      name: 'Wood',
      role: 'Medium Structural Beams',
      detail: 'Supports multi-story towers and collapses under angled strikes, Yellow dashes, or falling debris.',
    },
    {
      name: 'Glass',
      role: 'Brittle Panes',
      detail: 'Low fracture threshold that shatters into shards when hit by Blue bird splits or fast impacts.',
    },
    {
      name: 'Stone',
      role: 'Heavy Masonry',
      detail: 'High density and durability; best cleared with Black bomber blasts or cascading tower collapses.',
    },
    {
      name: 'Ice',
      role: 'Low-Friction Frost Blocks',
      detail: 'Slippery surfaces slide easily off foundations, toppling entire structures when nudged at the base.',
    },
    {
      name: 'Metal',
      role: 'Reinforced Armor',
      detail: 'Extremely durable girders and shielding plates that resist light hits and redirect trajectories.',
    },
    {
      name: 'TNT Crates',
      role: 'Chain-Reaction Explosives',
      detail: 'Detonate on impact to trigger shockwaves, ignite nearby crates, and clear packed strongholds.',
    },
  ],
  pigs: [
    {
      name: 'Minion Pig',
      role: '5,000 pts · Unarmored',
      detail: 'Lightest enemy unit easily defeated by direct bird strikes or collapsing roof timber.',
    },
    {
      name: 'Corporal Pig',
      role: '5,000 pts · Light Armor',
      detail: 'Tougher front-line defender positioned inside wooden frames and glass enclosures.',
    },
    {
      name: 'Foreman Pig',
      role: '6,500 pts · Reinforced',
      detail: 'Command unit with higher health that guards key structural supports and elevated balconies.',
    },
    {
      name: 'Helmet Pig',
      role: '7,500 pts · Heavy Helmet',
      detail: 'Protected by a hard helmet that absorbs glancing blows, requiring blasts or heavy collapses.',
    },
    {
      name: 'King Pig',
      role: '15,000 pts · Boss Siege Target',
      detail: 'Heavily fortified boss featured at the climax of major fortresses with the highest point bounty.',
    },
  ],
  powerups: [
    {
      name: 'Mighty Eagle',
      role: 'Aerial Strike',
      detail: 'Calls down an unstoppable aerial dive from above to crush stubborn fortresses and clear pigs.',
    },
    {
      name: 'Super Slingshot',
      role: '+35% Launch Velocity',
      detail: 'Extends pull range and increases shot speed for piercing distant or heavily reinforced walls.',
    },
    {
      name: 'Sling Scope',
      role: 'Extended Trajectory',
      detail: 'Projects an extended aiming arc so you can thread tight gaps and bank shots with precision.',
    },
    {
      name: 'Birdquake',
      role: 'Seismic Tremor',
      detail: 'Shakes the entire stage to destabilize tall towers and topple teetering blocks onto hidden pigs.',
    },
  ],
};

const WORLDS_AND_MODES = [
  {
    kicker: 'World 01 · Levels 1–10',
    title: 'Green Hills',
    summary:
      'Sunlit timber outposts and rolling meadows where wind-blown leaves drift across balanced starter fortresses.',
  },
  {
    kicker: 'World 02 · Levels 11–20',
    title: 'Snowy Mountains',
    summary:
      'High-altitude alpine bastions featuring slick ice foundations, brittle glass towers, and falling snow.',
  },
  {
    kicker: 'World 03 · Levels 21–30',
    title: 'Obsidian Caldera',
    summary:
      'Volcanic stone and reinforced metal strongholds lit by rising embers, culminating in the King Pig boss siege.',
  },
  {
    kicker: 'Additional Playable Modes',
    title: 'Daily, Endless & Sandbox Editor',
    summary:
      'Tackle the Daily Challenge to build a streak, survive escalating waves in Endless mode, or build and test custom stages in the Level Editor.',
  },
];

const HOW_TO_PLAY_STEPS = [
  {
    step: '01',
    title: 'Aim the Slingshot',
    description:
      'Pull back on the slingshot pouch to set your launch angle and power while watching the trajectory preview arc.',
  },
  {
    step: '02',
    title: 'Activate Mid-Air Abilities',
    description:
      'Click, tap, or press Space while a bird is in flight to trigger its special power before impact.',
  },
  {
    step: '03',
    title: 'Target Weak Foundations',
    description:
      'Strike load-bearing wood, glass, or ice supports and chain TNT explosions to bring entire forts crashing down.',
  },
  {
    step: '04',
    title: 'Earn Three-Star Clearances',
    description:
      'Defeat every pig on the stage with unused birds remaining to collect 10,000 bonus points per spare bird.',
  },
];

export const FAQS = [
  {
    question: 'What is Avian Siege?',
    answer:
      'Avian Siege is a free online 2D physics slingshot game built with Matter.js and HTML5 Canvas. You launch a flock of seven specialized birds to topple fortified towers across 30 campaign levels, daily challenges, endless waves, and a custom level editor.',
  },
  {
    question: 'How do you play Avian Siege?',
    answer:
      'Drag the slingshot pouch back to aim your trajectory, release to launch a bird toward the enemy fortress, and click, tap, or press Space mid-flight to trigger that bird’s special ability. Clear all pigs on the map before running out of birds.',
  },
  {
    question: 'Is Avian Siege free to play?',
    answer:
      'Yes. Avian Siege is completely free to play directly in your web browser with no downloads, account registration, or paid locks.',
  },
  {
    question: 'Can I play Avian Siege on mobile?',
    answer:
      'Yes. Avian Siege supports touch controls on smartphones and tablets in both portrait and landscape orientations, including touch-and-drag slingshot aiming, mid-air tap abilities, one-finger camera panning, and two-finger pinch-to-zoom.',
  },
  {
    question: 'Does Avian Siege work directly in a browser?',
    answer:
      'Yes. The game runs natively inside modern desktop and mobile web browsers using HTML5 Canvas, Matter.js rigid-body physics, and synthesized Web Audio sound effects with no plugins required.',
  },
  {
    question: 'What game modes and features are included?',
    answer:
      'Avian Siege includes a 30-stage Campaign across Green Hills, Snowy Mountains, and Obsidian Caldera, a Daily Challenge with streak tracking, Endless Survival waves, an interactive Sandbox Level Editor, 4 power-ups, and 12 achievements.',
  },
];

export default function GameInfoSection({ onBackToGame }: GameInfoSectionProps) {
  const [activeTab, setActiveTab] = useState<RosterTab>('birds');
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [actionImgFailed, setActionImgFailed] = useState(false);

  const handleTabChange = (tab: RosterTab) => {
    setActiveTab(tab);
    trackAnalyticsEvent('guide_roster_tab', { tab });
  };

  return (
    <div className="bg-[#0b1120] text-slate-200 border-t border-slate-800/80">
      {/* Top Bar (3-zone editorial contract, positioned below the 100dvh game canvas) */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-800/80 flex items-center justify-between gap-4 sm:gap-8">
        <a
          href="#about"
          className="font-display text-lg font-bold tracking-tight text-amber-400 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          Avian Siege
        </a>

        <nav
          aria-label="Game guide navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            About
          </a>
          <a href="#how-to-play" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            How to Play
          </a>
          <a href="#features" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Birds &amp; Materials
          </a>
          <a href="#modes" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Modes
          </a>
          <a href="#controls" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Controls
          </a>
          <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
        </nav>

        <button
          type="button"
          onClick={() => {
            trackAnalyticsEvent('back_to_game_click');
            onBackToGame();
          }}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          Play Game
        </button>
      </header>

      {/* 1. About Avian Siege */}
      <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs font-medium tracking-wide text-amber-400 mb-3">
              Physics Slingshot Game · Browser &amp; Mobile · Free to Play
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-[1.15] text-balance">
              Avian Siege: Free Online Physics Slingshot Game
            </h1>
            <p className="mt-5 text-base sm:text-[17px] text-slate-300 leading-relaxed max-w-[65ch]">
              Avian Siege is a browser-based physics destruction game powered by Matter.js rigid-body
              simulation and HTML5 Canvas rendering. Pull back the slingshot, gauge gravity and
              structural balance, and launch seven specialized birds to topple wooden, glass, stone,
              ice, and metal strongholds across 30 campaign stages.
            </p>
            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-[65ch]">
              Every collision calculates real momentum, structural stress, and chain-reaction debris,
              letting you win through clean precision shots or dramatic collapses—at home on desktop
              or on mobile touchscreens.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBackToGame}
                className="px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                Launch Slingshot
              </button>
              <a
                href="#how-to-play"
                className="px-5 py-2.5 text-sm font-semibold text-slate-200 border border-slate-700 hover:border-slate-500 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Read Strategy Guide
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-[#111827] flex items-center justify-center">
              {!heroImgFailed ? (
                <picture className="w-full h-full block">
                  <source srcSet="./images/avian-siege-slingshot-combat.webp" type="image/webp" />
                  <img
                    src="./images/avian-siege-slingshot-combat.jpg"
                    alt="Avian Siege physics slingshot gameplay showing Red, Yellow, and Black birds preparing to topple a stone and TNT pig fortress"
                    width={960}
                    height={540}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover block"
                  />
                </picture>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  Avian Siege Slingshot Battle Scene
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. How to Play */}
      <section id="how-to-play" className="border-t border-slate-800/80 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              How to Play Avian Siege
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Master trajectory timing, mid-flight abilities, and structural weak points to clear every
              fortress in as few shots as possible.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_TO_PLAY_STEPS.map((item) => (
              <article
                key={item.step}
                className="p-6 rounded-xl bg-[#111827] border border-slate-800/90 flex flex-col"
              >
                <span className="font-mono tabular-nums text-xs font-semibold text-amber-400">
                  Step {item.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Game Features, Birds, Materials & Power-Ups */}
      <section id="features" className="border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                Flock Roster, Destructible Materials &amp; Power-Ups
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
                Pair the right bird ability with each material type to break armored fortifications and
                clear protected pig targets.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Game encyclopedia categories"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#111827] border border-slate-800 rounded-lg shrink-0"
            >
              {(
                [
                  { id: 'birds', label: 'Birds (7)' },
                  { id: 'materials', label: 'Materials (6)' },
                  { id: 'pigs', label: 'Pigs (5)' },
                  { id: 'powerups', label: 'Power-Ups (4)' },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-amber-400 text-slate-950'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROSTER_DATA[activeTab].map((entry) => (
                <div
                  key={entry.name}
                  className="p-5 rounded-xl bg-[#111827] border border-slate-800/90"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-white">
                      {entry.name}
                    </h3>
                    <span className="text-xs font-medium text-amber-400/90 whitespace-nowrap">
                      {entry.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {entry.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 rounded-xl overflow-hidden border border-slate-800 bg-[#111827]">
              {!actionImgFailed ? (
                <picture className="block w-full">
                  <source srcSet="./images/avian-siege-fortress-action.webp" type="image/webp" />
                  <img
                    src="./images/avian-siege-fortress-action.jpg"
                    alt="Crimson striker bird launching from wooden slingshot toward a collapsing stone tower defended by King Pig"
                    width={600}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setActionImgFailed(true)}
                    className="w-full h-auto object-cover block"
                  />
                </picture>
              ) : (
                <div className="aspect-square flex items-center justify-center p-6 text-sm text-slate-400">
                  Avian Siege Fortress Siege Artwork
                </div>
              )}
              <div className="p-5 border-t border-slate-800/80">
                <h3 className="font-display text-base font-semibold text-white">
                  12 Unlockable Achievements
                </h3>
                <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
                  Track campaign stars, block demolitions, TNT chain reactions, Endless wave
                  milestones, Daily Challenge clears, and custom Sandbox designs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Game Modes & Campaign Worlds */}
      <section id="modes" className="border-t border-slate-800/80 bg-[#0d1425]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              Campaign Worlds &amp; Playable Game Modes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Progress through 30 handcrafted levels across three distinct environments or jump into
              daily, endless, and sandbox play anytime.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {WORLDS_AND_MODES.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-[#111827] border border-slate-800/90"
              >
                <p className="text-xs font-mono font-medium text-amber-400">
                  {item.kicker}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-slate-400 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Controls */}
      <section id="controls" className="border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              Desktop, Touch &amp; Keyboard Controls
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
              Responsive input across mouse, multi-touch screens, and keyboard shortcuts.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#111827] border border-slate-800/90">
              <h3 className="font-display text-lg font-semibold text-white">Mouse Controls</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Aim &amp; Launch</dt>
                  <dd className="font-medium text-slate-100 text-right">Drag slingshot</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Bird Ability</dt>
                  <dd className="font-medium text-slate-100 text-right">Left-click mid-air</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Pan Camera</dt>
                  <dd className="font-medium text-slate-100 text-right">Drag empty sky</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Zoom View</dt>
                  <dd className="font-medium text-slate-100 text-right">Scroll wheel</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-xl bg-[#111827] border border-slate-800/90">
              <h3 className="font-display text-lg font-semibold text-white">Mobile Touch</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Aim &amp; Launch</dt>
                  <dd className="font-medium text-slate-100 text-right">Touch &amp; pull pouch</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Bird Ability</dt>
                  <dd className="font-medium text-slate-100 text-right">Tap screen mid-air</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Inspect Fort</dt>
                  <dd className="font-medium text-slate-100 text-right">One-finger drag</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Zoom Camera</dt>
                  <dd className="font-medium text-slate-100 text-right">Two-finger pinch</dd>
                </div>
              </dl>
            </div>

            <div className="p-6 rounded-xl bg-[#111827] border border-slate-800/90">
              <h3 className="font-display text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Trigger Ability</dt>
                  <dd className="font-mono text-amber-300">Space</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Pause / Resume</dt>
                  <dd className="font-mono text-amber-300">P / Esc</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-slate-800/70 pb-2">
                  <dt className="text-slate-400">Restart Level</dt>
                  <dd className="font-mono text-amber-300">R</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Mute / Fullscreen</dt>
                  <dd className="font-mono text-amber-300">M / F</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section id="faq" className="border-t border-slate-800/80 bg-[#0d1425]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Answers to common questions about gameplay, browser support, and mobile controls.
          </p>

          <div className="mt-8 divide-y divide-slate-800/90 border-y border-slate-800/90">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 py-2 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-white">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-lg text-amber-400 shrink-0 w-6 text-center"
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="pt-2 pb-1 text-sm sm:text-base text-slate-300 leading-relaxed max-w-[70ch]">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
          <p>
            <strong className="font-semibold text-slate-200">Avian Siege</strong>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Free Online Physics Slingshot Game</span>
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#game-stage" onClick={(e) => { e.preventDefault(); onBackToGame(); }} className="hover:text-white transition-colors">
              Play Game
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#controls" className="hover:text-white transition-colors">
              Controls
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="./sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

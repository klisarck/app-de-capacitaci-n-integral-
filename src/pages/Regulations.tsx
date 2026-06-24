import { useMemo, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useI18n } from '@/contexts/I18nContext';
import { Input } from '@/components/ui/input';
import { regulations, searchRegulations } from '@/data/regulations';
import { Search, BookText, ScrollText, Scale, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

const icons: Record<string, JSX.Element> = {
  'codigo-etica': <ScrollText className="h-5 w-5" />,
  'reglamento-disciplinario': <Scale className="h-5 w-5" />,
  'reglamento-general': <BookText className="h-5 w-5" />,
};

const highlight = (text: string, query: string) => {
  if (!query.trim()) return text;
  const tokens = query.trim().split(/\s+/).filter(Boolean);
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-military-green/30 text-foreground font-semibold px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const Regulations = () => {
  const { lang } = useI18n();
  const [query, setQuery] = useState('');
  const [activeReg, setActiveReg] = useState<string>(regulations[0].id);

  const hits = useMemo(() => searchRegulations(query), [query]);
  const isSearching = query.trim().length >= 2;
  const current = regulations.find((r) => r.id === activeReg)!;

  return (
    <AppLayout isLoggedIn>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="border-b-2 border-foreground pb-6 mb-8">
          <p className="text-military-label mb-1">UNEFA · {lang === 'es' ? 'Normativa Oficial' : 'Official Regulations'}</p>
          <h1 className="text-3xl md:text-4xl font-black">
            {lang === 'es' ? 'Reglamentos y Normativas' : 'Regulations & Norms'}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-3xl">
            {lang === 'es'
              ? 'Consulte y busque por palabras clave en los reglamentos oficiales de la UNEFA. Los textos provienen de los documentos institucionales originales.'
              : 'Browse and keyword-search the official UNEFA regulations. Texts come from the original institutional documents.'}
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'es' ? 'Buscar por palabra clave (ej: uniforme, faltas, sanciones)…' : 'Search by keyword…'}
            className="pl-12 h-14 border-2 border-foreground rounded-none text-base shadow-[6px_6px_0_0_hsl(var(--military-green))]"
          />
          {isSearching && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              {hits.length} {lang === 'es' ? 'resultados' : 'results'}
            </p>
          )}
        </div>

        {isSearching ? (
          <div className="space-y-3">
            {hits.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">
                {lang === 'es' ? 'No se encontraron coincidencias.' : 'No matches found.'}
              </p>
            ) : (
              hits.map((hit, i) => (
                <motion.button
                  key={`${hit.regulation.id}-${hit.article.id}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => { setActiveReg(hit.regulation.id); setQuery(''); setTimeout(() => document.getElementById(hit.article.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); }}
                  className="w-full text-left border-2 border-foreground p-4 bg-background hover:bg-military-green/5 transition-colors block"
                >
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-black bg-military-green text-white px-2 py-0.5">
                      {hit.regulation.shortTitle}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{hit.article.number}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{hit.chapter.title}</p>
                  <p className="text-sm leading-relaxed">{highlight(hit.snippet, query)}</p>
                </motion.button>
              ))
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="space-y-2">
              {regulations.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveReg(r.id)}
                  className={`w-full text-left border-2 p-3 flex items-start gap-3 transition-all ${
                    activeReg === r.id
                      ? 'border-foreground bg-military-green text-white shadow-[4px_4px_0_0_hsl(0_0%_5%)]'
                      : 'border-foreground/30 hover:border-foreground bg-background'
                  }`}
                >
                  <div className="mt-0.5">{icons[r.id]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm leading-tight">{r.shortTitle}</p>
                    <p className={`text-[10px] uppercase tracking-widest mt-1 ${activeReg === r.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {r.year}
                    </p>
                  </div>
                </button>
              ))}
            </aside>

            {/* Content */}
            <article className="border-2 border-foreground bg-background p-6 md:p-8">
              <div className="border-b-2 border-foreground pb-4 mb-6">
                <h2 className="text-2xl font-black mb-2">{current.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{current.description}</p>
                {current.pdfUrl && (
                  <a
                    href={current.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-military-green text-white px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-military-green/90 shadow-[4px_4px_0_0_hsl(0_0%_5%)] transition-transform hover:-translate-y-0.5"
                  >
                    <FileDown className="h-4 w-4" />
                    {lang === 'es' ? 'Ver / Descargar PDF oficial' : 'View / Download official PDF'}
                  </a>
                )}
              </div>
              <div className="space-y-8">
                {current.chapters.map((ch) => (
                  <section key={ch.id}>
                    <h3 className="font-black text-base mb-4 uppercase tracking-wide border-l-4 border-military-green pl-3">
                      {ch.title}
                    </h3>
                    <div className="space-y-4">
                      {ch.articles.map((art) => (
                        <div key={art.id} id={art.id} className="border-l-2 border-foreground/20 pl-4 scroll-mt-24">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-military-green font-black mb-1">
                            {art.number}
                          </p>
                          <p className="text-sm leading-relaxed">{art.text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Regulations;

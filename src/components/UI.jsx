import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { pages } from "../bookPages";
import { pageAtom } from "../pageState";

const marqueeItems = [
  "Three Years",
  "Our Story",
  "Favorite Days",
  "Little Moments",
  "Big Adventures",
  "More To Come",
  "Together",
  "Memories",
];

const getPageLabel = (index) => {
  if (index === 0) {
    return "Cover";
  }

  if (index === pages.length) {
    return "Back Cover";
  }

  return `Page ${index}`;
};

const getPageButtonClassName = (isActive) =>
  [
    "shrink-0 rounded-full border px-4 py-3 text-lg uppercase transition-all duration-300",
    "border-transparent hover:border-white focus-visible:outline focus-visible:outline-2",
    "focus-visible:outline-offset-2 focus-visible:outline-white",
    isActive ? "bg-white/90 text-black" : "bg-black/30 text-white",
  ].join(" ");

const MarqueeRow = ({ className }) => (
  <div className={`flex w-max items-center gap-8 bg-white/0 px-8 ${className}`}>
    {marqueeItems.map((item, index) => (
      <span
        key={`${item}-${index}`}
        className={[
          "shrink-0 font-bold text-white",
          index % 3 === 0 ? "text-10xl font-black" : "",
          index % 3 === 1 ? "text-9xl font-light italic" : "",
          index % 3 === 2 ? "text-12xl text-transparent outline-text" : "",
        ].join(" ")}
      >
        {item}
      </span>
    ))}
  </div>
);

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const hasInteractedRef = useRef(false);

  const handleSetPage = useCallback(
    (nextPage) => {
      hasInteractedRef.current = true;
      setPage(nextPage);
    },
    [setPage],
  );

  useEffect(() => {
    if (!hasInteractedRef.current) {
      return;
    }

    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play().catch(() => undefined);
  }, [page]);

  return (
    <>
      <main className="pointer-events-none fixed inset-0 z-10 flex select-none flex-col justify-between">
        <a
          className="pointer-events-auto ml-10 mt-10 w-fit rounded-full bg-black/30 px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href="/"
          aria-label="Open the 3 Year Book home page"
        >
          3 Year Book
        </a>
        <nav
          className="pointer-events-auto flex w-full justify-center overflow-auto"
          aria-label="Book pages"
        >
          <div className="flex max-w-full items-center gap-4 overflow-auto p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={getPageButtonClassName(index === page)}
                type="button"
                aria-current={index === page ? "page" : undefined}
                aria-label={`Open ${getPageLabel(index)}`}
                onClick={() => handleSetPage(index)}
              >
                {getPageLabel(index)}
              </button>
            ))}
            <button
              className={getPageButtonClassName(page === pages.length)}
              type="button"
              aria-current={page === pages.length ? "page" : undefined}
              aria-label="Open Back Cover"
              onClick={() => handleSetPage(pages.length)}
            >
              {getPageLabel(pages.length)}
            </button>
          </div>
        </nav>
      </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <MarqueeRow className="animate-horizontal-scroll" />
          <MarqueeRow className="absolute left-0 top-0 animate-horizontal-scroll-2" />
        </div>
      </div>
    </>
  );
};

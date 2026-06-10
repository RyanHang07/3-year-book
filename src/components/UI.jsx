import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { pages } from "../bookPages";
import { isPageTurningAtom, pageAtom } from "../pageState";
import { MemoryModal } from "./MemoryModal";

const marqueeItems = [
  "Happy Three Years Baby",
  "Our Story Together",
  "I Love You So Much",
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

const clampPage = (pageNumber) =>
  Math.min(Math.max(pageNumber, 0), pages.length);

const getInputValue = (page) => {
  if (page === 0 || page === pages.length) {
    return "";
  }

  return String(page);
};

const getVisibleMonthLabels = (page) => {
  if (page === 0 || page === pages.length) {
    return null;
  }

  return {
    left: {
      image: pages[page - 1]?.back,
      label: pages[page - 1]?.backLabel,
      shortLabel: pages[page - 1]?.backShortLabel,
      side: "Left",
    },
    right: {
      image: pages[page]?.front,
      label: pages[page]?.frontLabel,
      shortLabel: pages[page]?.frontShortLabel,
      side: "Right",
    },
  };
};

const MonthBadge = ({ memory, onClick }) => (
  <button
    className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-full bg-white/10 px-4 py-2 text-left transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    type="button"
    aria-label={`Open ${memory.label} memory from the ${memory.side.toLowerCase()} page`}
    onClick={() => onClick(memory)}
  >
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
      {memory.side}
    </span>
    <span className="truncate text-lg font-black text-white">
      {memory.shortLabel}
    </span>
  </button>
);

const DateTooltip = ({ onDismiss }) => {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, 10000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onDismiss]);

  return (
    <button
      className="pointer-events-auto absolute left-3 top-[calc(100%+0.75rem)] z-10 w-[calc((100%-2.25rem)/2)] animate-tooltip-float rounded-full border border-white/15 bg-white/95 px-4 py-2 text-sm font-semibold text-black shadow-2xl transition before:absolute before:-top-2 before:left-1/2 before:size-4 before:-translate-x-1/2 before:rotate-45 before:border-l before:border-t before:border-white/15 before:bg-white/95 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      type="button"
      aria-label="Dismiss date click tip"
      onClick={onDismiss}
    >
      The dates are clickable
    </button>
  );
};

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
  const [isPageTurning] = useAtom(isPageTurningAtom);
  const [pageInput, setPageInput] = useState(() => ({
    page,
    value: getInputValue(page),
  }));
  const [hasDismissedDateTooltip, setHasDismissedDateTooltip] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const hasInteractedRef = useRef(false);
  const totalPageCount = pages.length - 1;
  const displayedPageInput =
    pageInput.page === page ? pageInput.value : getInputValue(page);
  const visibleMonthLabels = getVisibleMonthLabels(page);

  const handleSetPage = useCallback(
    (nextPage) => {
      if (isPageTurning) {
        return;
      }

      hasInteractedRef.current = true;
      setPage(clampPage(nextPage));
    },
    [isPageTurning, setPage],
  );

  const handlePreviousPage = () => {
    handleSetPage(page - 1);
  };

  const handleNextPage = () => {
    handleSetPage(page + 1);
  };

  const handleOpenMemory = (memory) => {
    setHasDismissedDateTooltip(true);
    setSelectedMemory(memory);
  };

  const handlePageInputChange = (event) => {
    setPageInput({
      page,
      value: event.target.value.replace(/\D/g, ""),
    });
  };

  const handlePageInputSubmit = () => {
    const requestedPage = Number.parseInt(displayedPageInput, 10);

    if (Number.isNaN(requestedPage)) {
      setPageInput({
        page,
        value: getInputValue(page),
      });
      return;
    }

    if (isPageTurning) {
      return;
    }

    handleSetPage(Math.min(Math.max(requestedPage, 1), totalPageCount));
  };

  const handlePageInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePageInputSubmit();
      return;
    }

    if (event.key === "Escape") {
      setPageInput({
        page,
        value: getInputValue(page),
      });
    }
  };

  useEffect(() => {
    if (!hasInteractedRef.current) {
      return;
    }

    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => undefined);
  }, [page]);

  return (
    <>
      <main className="pointer-events-none fixed inset-0 z-10 flex select-none flex-col justify-between">
        <div className="relative flex w-full items-start px-4 pt-8">
          {visibleMonthLabels ? (
            <aside
              className="pointer-events-auto absolute left-1/2 top-8 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-white shadow-2xl backdrop-blur-md"
              aria-label="Visible month labels"
            >
              <MonthBadge
                memory={visibleMonthLabels.left}
                onClick={handleOpenMemory}
              />
              <MonthBadge
                memory={visibleMonthLabels.right}
                onClick={handleOpenMemory}
              />
              {!hasDismissedDateTooltip ? (
                <DateTooltip
                  onDismiss={() => setHasDismissedDateTooltip(true)}
                />
              ) : null}
            </aside>
          ) : null}
        </div>
        <nav
          className="pointer-events-auto flex w-full justify-center px-4 pb-8"
          aria-label="Book pages"
        >
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-white/15 bg-black/35 px-3 py-2 text-white shadow-2xl backdrop-blur-md">
            <button
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              type="button"
              aria-label="Go to previous page"
              disabled={page === 0 || isPageTurning}
              onClick={handlePreviousPage}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                {getPageLabel(page)}
              </p>
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <span>Page</span>
                <input
                  className="h-9 w-16 rounded-full border border-white/15 bg-white/90 text-center text-base font-bold text-black outline-none transition focus:border-white focus:ring-2 focus:ring-white/50"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={displayedPageInput}
                  placeholder={page === 0 ? "Cover" : "Back"}
                  aria-label={`Enter a page number from 1 to ${totalPageCount}`}
                  disabled={isPageTurning}
                  onBlur={handlePageInputSubmit}
                  onChange={handlePageInputChange}
                  onKeyDown={handlePageInputKeyDown}
                />
                <span>of {totalPageCount}</span>
              </label>
            </div>
            <button
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl leading-none transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              type="button"
              aria-label="Go to next page"
              disabled={page === pages.length || isPageTurning}
              onClick={handleNextPage}
            >
              <span aria-hidden="true">&rarr;</span>
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
      <MemoryModal
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </>
  );
};

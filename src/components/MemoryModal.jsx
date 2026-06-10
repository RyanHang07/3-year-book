import { useEffect } from "react";
import { bookDescriptions } from "../bookDescriptions";

const getMemoryDescription = (memory) =>
  bookDescriptions[memory.image] ??
  `A full-size look at the ${memory.side.toLowerCase()} page memory from ${memory.label}.`;

export const MemoryModal = ({ memory, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!memory) {
    return null;
  }

  return (
    <div
      className="memory-modal pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="memory-modal-title"
      onClick={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-4xl border border-white/15 bg-zinc-950/95 p-4 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <img
            className="max-h-[72vh] w-full rounded-3xl object-contain lg:max-h-[78vh]"
            src={`/textures/${memory.image}.jpg`}
            alt={`${memory.label} memory`}
          />
          <div className="flex flex-col justify-between gap-8 p-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                  {memory.side} page
                </p>
                <h2 id="memory-modal-title" className="text-3xl font-black">
                  {memory.label}
                </h2>
              </div>
              <button
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl leading-none transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                type="button"
                aria-label="Close memory details"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                Description
              </p>
              <p className="mt-3 text-base leading-7 text-white/75">
                {getMemoryDescription(memory)}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
              <div>
                <dt className="text-white/45">Image</dt>
                <dd className="font-semibold text-white">{memory.image}.jpg</dd>
              </div>
              <div>
                <dt className="text-white/45">Month</dt>
                <dd className="font-semibold text-white">
                  {memory.shortLabel}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};

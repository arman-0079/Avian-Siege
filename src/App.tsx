/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const iframeSrc = useMemo(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    return `./game.html${search}`;
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoaded(true);
    iframeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const childWin = iframeRef.current?.contentWindow;

      if (event.origin === window.location.origin && event.data && event.data.type === 'AVIAN_TOGGLE_FULLSCREEN') {
        const doc = document as Document & {
          webkitFullscreenElement?: Element;
          webkitExitFullscreen?: () => Promise<void>;
        };
        const fsEl = document.fullscreenElement || doc.webkitFullscreenElement;
        if (fsEl) {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
          else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen().catch(() => {});
        } else if (mainRef.current) {
          const el = mainRef.current as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
          };
          if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
          else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
        }
        return;
      }

      // Bridge CrazyGames GameFrame postMessages transparently between parent and game iframe
      if (window.parent !== window) {
        if (childWin && event.source === childWin) {
          try { window.parent.postMessage(event.data, '*'); } catch {}
        } else if (childWin && event.source === window.parent) {
          try { childWin.postMessage(event.data, window.location.origin); } catch {}
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <main ref={mainRef} className="relative w-full h-[100dvh] overflow-hidden bg-[#090d16]">
      {!loaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#090d16] text-slate-200 z-10"
          aria-live="polite"
        >
          <div className="w-9 h-9 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
          <p className="text-sm font-medium tracking-wide text-slate-300">
            Loading Avian Siege...
          </p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Avian Siege Physics Game"
        onLoad={handleIframeLoad}
        className="w-full h-full border-0 block"
        allow="autoplay; fullscreen; clipboard-write; gamepad"
      />
    </main>
  );
}

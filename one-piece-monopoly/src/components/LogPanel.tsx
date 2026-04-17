import React, { useEffect, useRef, useState } from 'react';

export function LogPanel({ log }: { log: string[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [log, commentary]);

  useEffect(() => {
    if (log.length === 0) return;
    
    // Only fetch commentary every few logs or on important events
    // For now, let's fetch it when the log updates, but debounce it
    const timer = setTimeout(async () => {
      setIsTyping(true);
      try {
        const res = await fetch('/api/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logs: log })
        });
        const data = await res.json();
        if (data.commentary) {
          setCommentary(data.commentary);
        }
      } catch (e) {
        console.error("Failed to fetch commentary", e);
      } finally {
        setIsTyping(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [log]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-2 border-amber-800 flex flex-col h-64">
      <h3 className="font-bold text-gray-800 border-b pb-2 mb-2 flex justify-between items-center">
        <span>Adventure Log</span>
        {isTyping && <span className="text-xs text-amber-600 animate-pulse">Pirate Narrator is thinking...</span>}
      </h3>
      
      {commentary && (
        <div className="mb-3 p-3 bg-amber-100 border border-amber-300 rounded-lg text-sm italic text-amber-900 shadow-inner relative">
          <span className="absolute -top-2 -left-2 text-xl">🦜</span>
          "{commentary}"
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto text-sm font-mono text-gray-700 flex flex-col gap-1 scroll-smooth"
      >
        {log.map((msg, i) => (
          <div key={i} className="border-b border-gray-100 pb-1">
            <span className="text-gray-400 mr-2">[{i + 1}]</span>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

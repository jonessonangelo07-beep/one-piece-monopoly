import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border-4 border-amber-900 shadow-2xl max-w-3xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-amber-900 hover:bg-amber-200 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl md:text-4xl font-black text-amber-900 mb-6 text-center tracking-wider uppercase border-b-4 border-amber-900 pb-4">
          Pirate's Guide to Monopoly
        </h2>

        <div className="space-y-6 text-amber-950 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
          
          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🏴‍☠️</span> The Grand Fleet (Objective)
            </h3>
            <p className="leading-relaxed">
              Become the wealthiest pirate on the Grand Line! Buy islands, build houses and hotels to increase rent, and bankrupt your rivals. The last pirate standing wins the game.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🎲</span> Setting Sail (On Your Turn)
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Roll the dice to move your token around the board.</li>
              <li>If you roll doubles, you get another turn! But beware, rolling doubles 3 times in a row sends you straight to Impel Down (Jail).</li>
              <li>When you land on an unowned island, you can buy it. If you choose not to, it goes to auction.</li>
              <li>If you land on an island owned by another pirate, you must pay them rent.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🏝️</span> Territories & Monopolies
            </h3>
            <p className="leading-relaxed mb-2">
              Collect all islands of the same color to form a monopoly. This doubles the base rent of those islands and allows you to build houses and hotels.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Houses:</strong> You must build evenly across your monopoly.</li>
              <li><strong>Hotels:</strong> Once you have 4 houses on an island, you can upgrade to a hotel for maximum rent.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🧭</span> Log Pose & Bounty Posters
            </h3>
            <p className="leading-relaxed">
              Landing on these spaces means drawing a card. <strong>Log Pose</strong> (Chance) cards often move you around the board, while <strong>Bounty Posters</strong> (Community Chest) usually affect your wealth.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>⛓️</span> Impel Down (Jail)
            </h3>
            <p className="leading-relaxed mb-2">
              You can be sent to Impel Down by landing on the "Captured by Marines" space, drawing a specific card, or rolling doubles 3 times.
            </p>
            <p className="font-semibold mb-1">To escape, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Pay a ฿50 fine before rolling.</li>
              <li>Use a "Get Out of Impel Down Free" card.</li>
              <li>Roll doubles on your turn. If you fail 3 times, you must pay the ฿50 fine and then move.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>🤝</span> Alliances (Trading)
            </h3>
            <p className="leading-relaxed">
              You can trade properties, money, and "Get Out of Jail Free" cards with other pirates at any time during your turn. Use this to complete your monopolies!
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <span>💀</span> Bankruptcy
            </h3>
            <p className="leading-relaxed">
              If you owe more money than you can pay, you must declare bankruptcy.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>If you owe another pirate, they get all your money and properties.</li>
              <li>If you owe the Bank, your properties are returned to the Bank and can be bought by others.</li>
            </ul>
          </section>

        </div>

        <div className="mt-8 text-center pt-4 border-t-4 border-amber-900">
          <button
            onClick={onClose}
            className="px-10 py-3 bg-amber-700 hover:bg-amber-800 text-white font-black text-xl rounded-xl transition-colors shadow-lg border-2 border-amber-900"
          >
            UNDERSTOOD!
          </button>
        </div>
      </div>
    </div>
  );
}

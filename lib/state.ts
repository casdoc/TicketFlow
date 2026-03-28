// Module-level singletons — persist across requests within the same Node.js process.

let availableTickets = 500;

export const getAvailableTickets = (): number => availableTickets;

export function reserveTickets(qty: number): boolean {
  if (availableTickets < qty) return false;
  availableTickets -= qty;
  return true;
}

export const resetTickets = (): void => {
  availableTickets = 500;
};

// Module-level singletons — persist across requests within the same Node.js process.

let chaosMode = false;
let availableTickets = 500;

export const getChaosMode = (): boolean => chaosMode;
export const setChaosMode = (v: boolean): void => {
  chaosMode = v;
};

export const getAvailableTickets = (): number => availableTickets;

export function reserveTickets(qty: number): boolean {
  if (availableTickets < qty) return false;
  availableTickets -= qty;
  return true;
}

export const resetTickets = (): void => {
  availableTickets = 500;
};

import { createContext, useContext } from "react";
import type { Destination } from "../data/destinations";

export type DestinationsState = {
  destinations: Destination[];
  loading: boolean;
  error: boolean;
};

export const DESTINATIONS_DEFAULT: DestinationsState = {
  destinations: [],
  loading: true,
  error: false,
};

export const DestinationsContext =
  createContext<DestinationsState>(DESTINATIONS_DEFAULT);

/** Live, admin-managed holiday deals fetched once from /api/destinations. */
export function useDestinations(): DestinationsState {
  return useContext(DestinationsContext);
}

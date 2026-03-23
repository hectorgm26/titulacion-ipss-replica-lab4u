import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = "YOUR_MIXPANEL_TOKEN";

const trackAutomaticEvents = false;
const useNative = false;

export const mixpanel = new Mixpanel(
  MIXPANEL_TOKEN,
  trackAutomaticEvents,
  useNative,
);

export async function initAnalytics() {
  await mixpanel.init();
}

export function track(event: string, props?: Record<string, any>) {
  mixpanel.track(event, props);
}

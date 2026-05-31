import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = "0e4d19cac852261b5e055f7b0e97e0a8";

const trackAutomaticEvents = false;
const useNative = false;

export const mixpanel = new Mixpanel(
  MIXPANEL_TOKEN,
  trackAutomaticEvents,
  useNative,
);

let isReady = false;

export async function initAnalytics() {
  await mixpanel.init();
  isReady = true;

  setInterval(() => {
    mixpanel.flush();
  }, 1000);
}

export function track(event: string, props?: Record<string, any>) {
  if (!isReady) return; // evita perder eventos o crashes en cold start
  mixpanel.track(event, props);
}

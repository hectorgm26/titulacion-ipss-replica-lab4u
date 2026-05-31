import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadUserProfile } from "./userProfile";

const LAST_TOPIC_KEY = "fcm_last_topic";
const LANGUAGE = "es";

// Conditional import — works in Expo Go (no crash) and dev build (full FCM)
// Equivalent to #if QA guards in iOS Swift code
let firebaseMessaging: any = null;
try {
  firebaseMessaging = require("@react-native-firebase/messaging").default;
} catch {
  console.log(
    "FCM: native module unavailable (Expo Go) — topic logic will be simulated",
  );
}

const isNativeAvailable = (): boolean => firebaseMessaging !== null;

// Equivalent to FCMTopicManager.swift
class FCMTopicManagerClass {
  private static instance: FCMTopicManagerClass;

  static get shared(): FCMTopicManagerClass {
    if (!FCMTopicManagerClass.instance) {
      FCMTopicManagerClass.instance = new FCMTopicManagerClass();
    }
    return FCMTopicManagerClass.instance;
  }

  private constructor() {}

  // Equivalent to updateSubscriptionsForCurrentUser()
  // Builds: "usergroup_PLAN_usertype_TYPE_lang_es"
  async updateSubscriptionsForCurrentUser(): Promise<void> {
    const profile = await loadUserProfile();
    if (!profile) {
      console.log("FCM: No user profile loaded");
      return;
    }

    const plan = profile.plan.toUpperCase(); // FREE | PREMIUM
    const userType = profile.userType.toUpperCase(); // STUDENT | TEACHER

    const newTopic = `usergroup_${plan}_usertype_${userType}_lang_${LANGUAGE}`;

    const lastTopic = await AsyncStorage.getItem(LAST_TOPIC_KEY);

    // If the topic is the same, no need to unsubscribe/subscribe again
    if (newTopic === lastTopic) {
      console.log("FCM: already subscribed to", newTopic);
      return;
    }

    // Unsubscribe old topic if exists
    if (lastTopic) {
      await this.unsubscribe([lastTopic]);
    }

    // Subscribe new topic
    await this.subscribe([newTopic]);

    // Persist last topic — saved even in Expo Go so UI shows the topic string
    await AsyncStorage.setItem(LAST_TOPIC_KEY, newTopic);

    console.log("FCM: subscribed to topic:", newTopic);
  }

  // Returns the current active topic string (for display in UI)
  async getCurrentTopic(): Promise<string | null> {
    return AsyncStorage.getItem(LAST_TOPIC_KEY);
  }

  // Request permission — uses native SDK in dev build, expo-notifications in Expo Go
  async requestPermission(): Promise<boolean> {
    if (isNativeAvailable()) {
      const status = await firebaseMessaging().requestPermission();
      return (
        status === 1 || // AUTHORIZED
        status === 3 // PROVISIONAL
      );
    }

    // Expo Go fallback — use expo-notifications for local permission
    try {
      const Notifications = await import("expo-notifications");
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch {
      console.log("FCM: expo-notifications not available either");
      return false;
    }
  }

  // Check current permission status
  async hasPermission(): Promise<boolean> {
    if (isNativeAvailable()) {
      const status = await firebaseMessaging().hasPermission();
      return status === 1 || status === 3;
    }

    try {
      const Notifications = await import("expo-notifications");
      const { status } = await Notifications.getPermissionsAsync();
      return status === "granted";
    } catch {
      return false;
    }
  }

  // Listen to foreground messages — no-op in Expo Go
  onMessage(callback: (message: any) => void): () => void {
    if (!isNativeAvailable()) {
      console.log("FCM: onMessage not available in Expo Go");
      return () => {};
    }
    return firebaseMessaging().onMessage(callback);
  }

  // Equivalent to subscribe(to:)
  private async subscribe(topics: string[]): Promise<void> {
    if (!isNativeAvailable()) {
      console.log("FCM (simulated): would subscribe to", topics);
      return;
    }
    for (const topic of topics) {
      try {
        await firebaseMessaging().subscribeToTopic(topic);
        console.log("FCM subscribed to:", topic);
      } catch (e) {
        console.warn("FCM subscribe error:", topic, e);
      }
    }
  }

  // Equivalent to unsubscribe(from:)
  private async unsubscribe(topics: string[]): Promise<void> {
    if (!isNativeAvailable()) {
      console.log("FCM (simulated): would unsubscribe from", topics);
      return;
    }
    for (const topic of topics) {
      try {
        await firebaseMessaging().unsubscribeFromTopic(topic);
        console.log("FCM unsubscribed from:", topic);
      } catch (e) {
        console.warn("FCM unsubscribe error:", topic, e);
      }
    }
  }

  // Equivalent to fullFCMCleanupOnLogout()
  async fullFCMCleanupOnLogout(): Promise<void> {
    const lastTopic = await AsyncStorage.getItem(LAST_TOPIC_KEY);
    if (lastTopic) {
      await this.unsubscribe([lastTopic]);
    }

    if (isNativeAvailable()) {
      try {
        await firebaseMessaging().deleteToken();
        console.log("FCM token deleted successfully");
      } catch (e) {
        console.warn("FCM token delete error:", e);
      }
    }

    await AsyncStorage.removeItem(LAST_TOPIC_KEY);
    console.log("FCM: cleanup completed");
  }
}

export const FCMTopicManager = FCMTopicManagerClass.shared;

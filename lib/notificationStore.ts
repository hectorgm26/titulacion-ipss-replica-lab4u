import AsyncStorage from "@react-native-async-storage/async-storage";

// React hook — equivalent to @ObservedObject in SwiftUI
import { useEffect, useState } from "react";

// Equivalent to NotificationItem.swift
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: number; // timestamp ms (Date.now()) — iOS uses Date, here we use number
}

// Equivalent to NotificationStore.swift (singleton + persistence)
const STORAGE_KEY = "lab4u_notification_history_v1";
const MAX_ITEMS = 200;

type Listener = (notifications: NotificationItem[]) => void;

class NotificationStoreClass {
  private static instance: NotificationStoreClass;
  private _notifications: NotificationItem[] = [];
  private _listeners: Set<Listener> = new Set();
  private _loaded = false;

  static get shared(): NotificationStoreClass {
    if (!NotificationStoreClass.instance) {
      NotificationStoreClass.instance = new NotificationStoreClass();
    }
    return NotificationStoreClass.instance;
  }

  private constructor() {}

  // Subscribe to changes — returns unsubscribe function
  subscribe(listener: Listener): () => void {
    this._listeners.add(listener);
    // Immediately emit current state
    listener([...this._notifications]);
    return () => this._listeners.delete(listener);
  }

  private emit() {
    const copy = [...this._notifications];
    this._listeners.forEach((l) => l(copy));
  }

  get notifications(): NotificationItem[] {
    return [...this._notifications];
  }

  // Equivalent to addIfNew(_:)
  addIfNew(item: NotificationItem) {
    if (this._notifications.some((n) => n.id === item.id)) return;
    this._notifications.unshift(item);
    if (this._notifications.length > MAX_ITEMS) {
      this._notifications = this._notifications.slice(0, MAX_ITEMS);
    }
    this.persist();
    this.emit();
  }

  remove(id: string) {
    this._notifications = this._notifications.filter((n) => n.id !== id);
    this.persist();
    this.emit();
  }

  clear() {
    this._notifications = [];
    this.persist();
    this.emit();
  }

  // Equivalent to persist()
  private async persist() {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(this._notifications),
      );
    } catch (e) {
      console.warn("NotificationStore persist error:", e);
    }
  }

  // Equivalent to load() — call once on app start
  async load(): Promise<void> {
    if (this._loaded) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        this._notifications = JSON.parse(raw) as NotificationItem[];
      }
    } catch (e) {
      console.warn("NotificationStore load error:", e);
    }
    this._loaded = true;
    this.emit();
  }
}

export const NotificationStore = NotificationStoreClass.shared;

export function useNotifications(): NotificationItem[] {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    NotificationStore.notifications,
  );

  useEffect(() => {
    // Load from storage on first mount
    NotificationStore.load();
    // Subscribe to live updates
    const unsubscribe = NotificationStore.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return notifications;
}

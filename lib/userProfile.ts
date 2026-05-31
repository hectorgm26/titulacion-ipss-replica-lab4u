import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";

export type UserType = "student" | "teacher";
export type UserPlan = "free" | "premium";

export interface UserProfile {
  userType: UserType;
  plan: UserPlan;
}

// Key is scoped per Firebase uid — different users never share the same profile
function storageKey(): string {
  const uid = getAuth().currentUser?.uid ?? "guest";
  return `app_user_profile_${uid}`;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(storageKey(), JSON.stringify(profile));
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(storageKey());
  if (!raw) return null;
  return JSON.parse(raw) as UserProfile;
}

export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.removeItem(storageKey());
}

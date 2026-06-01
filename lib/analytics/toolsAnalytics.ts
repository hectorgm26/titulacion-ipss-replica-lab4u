import { track } from "../../services/analytics";
import { getToolUuid } from "../toolConfig";
import { TOOL_EVENTS } from "./toolsEvents";

// Equivalent to toolDictionary.first { $0.value == Tools.X.rawValue }?.key in iOS
// Converts the internal string id ("accelerometer") to the real Lab4U UUID
function toolId(id: string): string {
  return getToolUuid(id);
}

function baseProps() {
  return {
    source_name: "LAB4UAPP",
    feature_name: "Tools",
  };
}

export const ToolsAnalytics = {
  goToToolList() {
    track(TOOL_EVENTS.GO_TO_TOOL_LIST, {
      ...baseProps(),
      view_name: "Home",
      event_version: 1,
      event_id: 447,
      event_type: "Click",
    });
  },

  openTool(id: string) {
    track(TOOL_EVENTS.OPEN_A_TOOL, {
      ...baseProps(),
      view_name: "Home",
      event_version: 1,
      event_id: 44,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  startMeasurementClick(id: string) {
    track(TOOL_EVENTS.START_MEASUREMENT_CLICK, {
      ...baseProps(),
      view_name: "Tool Profile",
      event_version: 1,
      event_id: 58,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  startMeasurementSuccess(id: string) {
    track(TOOL_EVENTS.START_MEASUREMENT_SUCCESS, {
      ...baseProps(),
      view_name: "Tool Measurement",
      event_version: 1,
      event_id: 441,
      event_type: "Success",
      tool_id: toolId(id),
    });
  },

  endMeasurement(id: string) {
    track(TOOL_EVENTS.END_A_MEASUREMENT, {
      ...baseProps(),
      view_name: "Tool Measurement",
      event_version: 1,
      event_id: 118,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  goToSavedMeasurementList(id: string) {
    track(TOOL_EVENTS.GO_TO_THE_SAVED_MEASUREMENT_LIST, {
      ...baseProps(),
      view_name: "Tool Profile",
      event_version: 1,
      event_id: 59,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  openSavedMeasurement(id: string) {
    track(TOOL_EVENTS.OPEN_A_SAVED_MEASUREMENT, {
      ...baseProps(),
      view_name: "Tool Measurement List",
      event_version: 1,
      event_id: 62,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  exportMeasurement(id: string, exportType: "PDF" | "EXCEL") {
    track(TOOL_EVENTS.EXPORT_A_MEASUREMENT, {
      ...baseProps(),
      view_name: "Tool Results",
      event_version: 1,
      event_id: 61,
      event_type: "Click",
      tool_id: toolId(id),
      export_type: exportType,
    });
  },

  retryMeasurement(id: string) {
    track(TOOL_EVENTS.RETRY_A_MEASUREMENT, {
      ...baseProps(),
      view_name: "Tool Results",
      event_version: 1,
      event_id: 63,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },

  goToRegisterView() {
    track(TOOL_EVENTS.GO_TO_REGISTER_VIEW, {
      source_name: "LAB4UAPP",
      feature_name: "Account",
      view_name: "Register Screen",
      event_version: 1,
      event_id: 500,
      event_type: "Click",
    });
  },

  goToLoginView() {
    track(TOOL_EVENTS.GO_TO_LOGIN_VIEW, {
      source_name: "LAB4UAPP",
      feature_name: "Account",
      view_name: "Login Screen",
      event_version: 1,
      event_id: 501,
      event_type: "Click",
    });
  },

  goToDealView() {
    track(TOOL_EVENTS.GO_TO_DEALS_VIEW, {
      source_name: "LAB4UAPP",
      feature_name: "Deals",
      view_name: "Deals Screen",
      event_version: 1,
      event_id: 502,
      event_type: "View",
    });
  },

  goToNotificationsView() {
    track(TOOL_EVENTS.GO_TO_NOTIFICATIONS_VIEW, {
      source_name: "LAB4UAPP",
      feature_name: "Notifications",
      view_name: "Notifications Screen",
      event_version: 1,
      event_id: 503,
      event_type: "View",
    });
  },

  buyPremium(userType: string) {
    track(TOOL_EVENTS.BUY_PREMIUM, {
      source_name: "LAB4UAPP",
      feature_name: "Deals",
      view_name: "Deals Screen",
      event_version: 1,
      event_id: 504,
      event_type: "Click",
      user_type: userType,
    });
  },

  logout() {
    track(TOOL_EVENTS.LOGOUT_SUCCESS, {
      source_name: "LAB4UAPP",
      feature_name: "Account",
      view_name: "Account Screen",
      event_version: 1,
      event_id: 506,
      event_type: "Success",
    });
  },
  loginSuccess() {
    track(TOOL_EVENTS.LOGIN_SUCCESS, {
      source_name: "LAB4UAPP",
      feature_name: "Account",
      view_name: "Login Screen",
      event_version: 1,
      event_id: 507,
      event_type: "Success",
    });
  },

  registerSuccess() {
    track(TOOL_EVENTS.REGISTER_SUCCESS, {
      source_name: "LAB4UAPP",
      feature_name: "Account",
      view_name: "Register Screen",
      event_version: 1,
      event_id: 508,
      event_type: "Success",
    });
  },

  saveMeasurement(id: string) {
    track(TOOL_EVENTS.SAVE_A_MEASUREMENT, {
      ...baseProps(),
      view_name: "Tool Results",
      event_version: 1,
      event_id: 505,
      event_type: "Click",
      tool_id: toolId(id),
    });
  },
};

/** Topic buckets for the React Native programming hub stats line. */

export type ReactNativeTopicOutline = {
  id: string;
  title: string;
  bullets: string[];
};

export const REACT_NATIVE_TOPIC_OUTLINE: ReactNativeTopicOutline[] = [
  {
    id: "foundation",
    title: "Foundation & tooling",
    bullets: ["course intro & Expo", "Metro / simulators / devices", "logging & debug", "core components"],
  },
  {
    id: "ui",
    title: "Layout · styling · lists · forms",
    bullets: ["Flexbox & layouts", "StyleSheet & icons", "FlatList gestures", "Formik · Yup inputs"],
  },
  {
    id: "data",
    title: "Native · navigation · APIs",
    bullets: ["ImagePicker · permissions", "stack & tab navigators", "ApiSauce · uploads", "offline cache · auth JWT"],
  },
  {
    id: "ship",
    title: "Push · stores · OTA",
    bullets: ["FCM/APNs hooks", "EAS Submit", "crash reporting maps", "EAS Update / OTA rules"],
  },
];

export function reactNativeOutlineTopicCount(outline: ReactNativeTopicOutline[]): number {
  return outline.length;
}

export function reactNativeOutlineBulletCount(outline: ReactNativeTopicOutline[]): number {
  return outline.reduce((n, m) => n + m.bullets.length, 0);
}

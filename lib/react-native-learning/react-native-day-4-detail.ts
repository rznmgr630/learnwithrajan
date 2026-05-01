import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 4 — simulators · emulators · physical devices. */
export const REACT_NATIVE_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Running on iOS Simulator**, **Android Emulator**, **Real Device** workflows—matching the trilogy of platform runs from classic courses.",
      np: "तीन फरक डिभाइस।",
      jp: "**iOS シミュレータ / Android エミュ / 実機** の三套。",
    },
  ],
  sections: [
    {
      title: {
        en: "Running on an iOS Simulator",
        np: "iOS सिमुलेटर",
        jp: "iOS シミュレータで実行",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Open Xcode → Devices/Simulators** to install missing runtimes.**`npx expo start` → press `i`** boots the default simulated iPhone.",
              np: "Xcode र `i` टिप।",
              jp: "**Xcode** でランタイムを入れたうえ **`i`**。",
            },
            {
              en: "**Simulate location / slow network / dark mode** from Features menu for realism.",
              np: "लोकेसन र डार्क ध simulation।",
              jp: "位置情報・低速ネットワーク・ダークモードをシミュレータメニューで。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Running on an Android Emulator",
        np: "Android इमुलेटर",
        jp: "Android エミュレータで実行",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**AVD Manager** selects API level aligned with RN release notes—cold boot emulator before `press a` saves debugging time.",
              np: "AVD खोलिएपछि `a`।",
              jp: "**AVD** を冷起動してから **`a`**。",
            },
            {
              en: "**Hardware acceleration**: Apple Silicon arm64 images preferred; Hyper-V quirks on Windows need nested virtualization tuning.",
              np: "त्वरण हार्डवेयर ध्यान।",
              jp: "**仮想化 / arm64** の設定が速さに効きます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Running on a Device",
        np: "वास्तविक फोन",
        jp: "実機で実行",
      },
      blocks: [
        {
          type: "code",
          title: { en: "LAN dev URL", np: "LAN", jp: "同一 LAN で" },
          code: `# Same Wi-Fi; tunnel if corporate DNS blocks LAN
EXPO_TUNNEL=true npx expo start`,
        },
        {
          type: "paragraph",
          text: {
            en: "**iOS signing**: Xcode account + provisioning for release builds—not needed for simulator-only coursework.**Android USB debugging**: accept RSA fingerprint dialogs once.",
                            np: "साइनिङ्ग र डिबग।",
                            jp: "リリース用は **証明書**。**Android** は開発者モード・USB を一度許可。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Metro cannot reach physical phone?",
        np: "फोन पुग्दैन?",
        jp: "実機が Metro に届かない",
      },
      answer: {
        en: "Try **tunnel mode**, toggle **Firewall**, ensure phone on **same VLAN**, or adb reverse **`adb reverse tcp:8081 tcp:8081`** patterns for Android wired debug.",
                            np: "टनेल/adb रिभर्स।",
                            jp: "**トンネル**、同一セグメント、**adb reverse** などを順に確認。",
      },
    },
  ],
};

import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 16 — Device media: expo-image-picker, permissions, reusable ImageRow, image upload. */
export const REACT_NATIVE_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Images are the most common native capability beginners reach for first. This day covers the full arc: **requesting media-library and camera permissions** with a graceful denial UX, using **`expo-image-picker`** to pick or capture photos, building a reusable **`ImageRow`** component, and **uploading images to a backend** with `FormData` and `multipart/form-data`. You will also learn to handle large images with compression and aspect-ratio cropping so your app never sends a 12 MB HEIC file to a server that expects a 200 KB JPEG.",
      np: "इमेज पिकर, अनुमति, ImageRow घटक, र अपलोड।",
      jp: "権限取得から**画像ピッカー**・**ImageRow コンポーネント**・**アップロード**まで、画像操作の全工程を学びます。",
    },
  ],
  sections: [
    {
      title: { en: "How expo-image-picker Works Under the Hood", np: "expo-image-picker भित्री काम", jp: "expo-image-picker の仕組み" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`expo-image-picker` wraps **`UIImagePickerController`** (iOS) and **`Intent.ACTION_GET_CONTENT`** / CameraX (Android) behind a single JS API. Calling `launchImageLibraryAsync` or `launchCameraAsync` crosses the **native bridge** once, suspends the JS side while the native picker UI is visible, then returns a result object when the user confirms or cancels. The `assets` array in the result gives you `uri`, `width`, `height`, `mimeType`, `fileSize`, and `base64` (if requested).",
            np: "नेटिभ ब्रिज पार गर्छ र नतिजा फर्काउँछ।",
            jp: "`launchImageLibraryAsync` はブリッジを一度越えてネイティブUI を表示し、確定または取消でresult オブジェクトを返します。",
          },
        },
        { type: "diagram", id: "react-native-bridge-architecture" },
        {
          type: "code",
          title: { en: "`expo-image-picker` — library and camera launchers", np: "पिकर कोड", jp: "ライブラリ・カメラ起動" },
          code: `import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

/**
 * Pick one image from the device library.
 * Returns the local URI string, or null if the user cancelled.
 */
export async function pickFromLibrary(): Promise<string | null> {
  const { status, canAskAgain } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    if (!canAskAgain) {
      // Permanently denied — send user to Settings
      Alert.alert(
        'Permission Required',
        'Please enable Photo Library access in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],       // crop to 4:3 before returning
    quality: 0.8,          // 0 = max compression, 1 = original
  });

  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}

/**
 * Capture a new photo from the device camera.
 */
export async function captureFromCamera(): Promise<string | null> {
  const { status, canAskAgain } =
    await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    if (!canAskAgain) {
      Alert.alert('Camera access blocked', 'Enable it in Settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
    }
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.75,
  });

  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}`,
        },
      ],
    },
    {
      title: { en: "Permission Request Pattern with usePermissions Hook", np: "अनुमति हुक", jp: "usePermissions フックによる権限管理" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The **`usePermissions`** hook (from `expo-media-library` and `expo-camera`) gives you reactive access to the current permission status without the boilerplate of calling `requestXxxPermissionsAsync` inside a `useEffect`. The hook returns `[permission, requestPermission]`: `permission.status` is `'granted'`, `'denied'`, or `'undetermined'`, and `permission.canAskAgain` tells you whether the OS will show the system dialog or silently deny.",
            np: "`usePermissions` हुकले स्थिति र अनुरोध दुवै दिन्छ।",
            jp: "**`usePermissions`** フックは現在の権限状態をリアクティブに返し、`requestPermission` 呼び出しで再要求できます。",
          },
        },
        {
          type: "code",
          title: { en: "`usePermissions` hook — reactive permission state", np: "अनुमति हुक कोड", jp: "usePermissions の例" },
          code: `import { useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking } from 'react-native';

/**
 * Custom hook that returns whether the media-library permission is granted,
 * and a function to request it (with Settings redirect on permanent denial).
 */
export function useMediaPermission() {
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  const askPermission = async () => {
    if (permission?.status === 'granted') return true;

    if (permission?.canAskAgain === false) {
      Alert.alert(
        'Photos permission blocked',
        'Go to Settings → Privacy → Photos and allow access.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }

    const result = await requestPermission();
    return result.granted;
  };

  return { granted: permission?.granted ?? false, askPermission };
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`permission.status === 'undetermined'`** — the user has never been asked; it is safe to call the system dialog.",
              np: "अनिश्चित — पहिलो पटक सोध्न सकिन्छ।",
              jp: "**`undetermined`** なら初回ダイアログを出せます。",
            },
            {
              en: "**`permission.canAskAgain === false`** — the OS will never show the dialog again. Your only option is to redirect to the Settings app with `Linking.openSettings()`.",
              np: "स्थायी अस्विकार — Settings मा पठाउनुस्।",
              jp: "**`canAskAgain === false`** のときは `Linking.openSettings()` しか手段がありません。",
            },
            {
              en: "On **iOS 14+**, the user can grant **limited photo access** — `permission.accessPrivileges` will be `'limited'` instead of `'all'`. Handle this by showing a `PHPickerViewController`-style limited picker.",
              np: "iOS 14+ मा सीमित पहुँच पनि सम्भव।",
              jp: "**iOS 14+** では「一部のみ許可」もあります。`accessPrivileges === 'limited'` を確認しましょう。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Building a Reusable ImageRow Component", np: "ImageRow घटक निर्माण", jp: "再利用可能な ImageRow コンポーネント" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An **`ImageRow`** component takes a `uri` prop and an `onPress` callback. When `uri` is `null`, it renders a dashed placeholder with a camera icon. When `uri` is set, it renders the thumbnail with a remove button overlay. The `onPress` prop is wired to `pickFromLibrary` or `captureFromCamera` depending on context — keeping the picker logic out of the rendering component.",
            np: "ImageRow — uri भए तस्बिर, नभए placeholder।",
            jp: "**`ImageRow`** は `uri` があればサムネイル、なければ破線プレースホルダーを表示します。",
          },
        },
        {
          type: "code",
          title: { en: "ImageRow component — thumbnail with remove overlay", np: "ImageRow कोड", jp: "ImageRow の実装" },
          code: `import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  uri: string | null;
  onPress: () => void;
  onRemove?: () => void;
  size?: number;
}

export function ImageRow({ uri, onPress, onRemove, size = 80 }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: size, height: size }]}
      activeOpacity={0.8}
    >
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.image} />
          {onRemove && (
            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
              <MaterialCommunityIcons name="close-circle" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View style={styles.placeholder}>
          <MaterialCommunityIcons name="camera" size={32} color="#9CA3AF" />
          <Text style={styles.label}>Add Photo</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: 8, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10,
  },
  placeholder: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: { fontSize: 11, color: '#9CA3AF' },
});`,
        },
      ],
    },
    {
      title: { en: "Uploading Images with FormData and fetch", np: "इमेज अपलोड", jp: "FormData で画像をアップロード" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "React Native's `fetch` supports `multipart/form-data` bodies via the **`FormData`** class. You append the file by passing an object with `uri`, `name`, and `type` fields — this is a React Native extension to the standard `File` interface. The `uri` is the local file path returned by `launchImageLibraryAsync`. Set the `Content-Type` header to `multipart/form-data` (or omit it and let `fetch` set the boundary automatically).",
            np: "FormData मा uri, name, type थप्नुस्।",
            jp: "**`FormData`** に `{ uri, name, type }` を `append` して `fetch` で送ります。Content-Type は自動で設定されます。",
          },
        },
        {
          type: "code",
          title: { en: "Uploading an image with FormData + fetch", np: "अपलोड कोड", jp: "FormData アップロード" },
          code: `interface UploadResult {
  url: string;
  id: string;
}

/**
 * Upload a local image URI to the server.
 * @param localUri - file:// URI from expo-image-picker
 * @param fieldName - multipart field name the backend expects (e.g. 'photo')
 */
export async function uploadImage(
  localUri: string,
  fieldName = 'photo',
): Promise<UploadResult> {
  const fileName = localUri.split('/').pop() ?? 'upload.jpg';
  const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const body = new FormData();
  // React Native's FormData accepts this object shape for file fields:
  body.append(fieldName, {
    uri: localUri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  const response = await fetch('https://api.example.com/images', {
    method: 'POST',
    body,
    // Do NOT set Content-Type manually — let fetch set it with the boundary
    headers: {
      Accept: 'application/json',
      // Authorization: 'Bearer ' + token,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(\`Upload failed (\${response.status}): \${text}\`);
  }

  return response.json() as Promise<UploadResult>;
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Never set `Content-Type: multipart/form-data` manually** — doing so omits the `boundary` parameter and the server cannot parse the body. Let `fetch` build the header.",
              np: "Content-Type म्यानुअल नगर्नुस्।",
              jp: "**Content-Type を手動で設定しない**こと。boundary が欠けてサーバが解析できなくなります。",
            },
            {
              en: "For large batches, upload sequentially with `for...of` rather than `Promise.all` to avoid saturating the user's connection.",
              np: "ठूलो ब्याच — एक एक अपलोड।",
              jp: "大量アップロードは **`Promise.all`** ではなく `for...of` で順番に送りましょう。",
            },
            {
              en: "Use **`expo-file-system`** `getInfoAsync` before upload to confirm the file exists and check its size.",
              np: "अपलोड अघि फाइल जाँच गर्नुस्।",
              jp: "アップロード前に **`expo-file-system.getInfoAsync`** でファイルの存在とサイズを確認しましょう。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Handling Large Images — Compression & Aspect Ratio", np: "ठूलो इमेज ह्यान्डलिंग", jp: "大きな画像の圧縮とアスペクト比" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Modern smartphones shoot 12–50 MP photos. Sending a raw HEIC or RAW file to a backend is wasteful and slow. **`expo-image-picker`** handles both in the launcher options: `quality` compresses JPEG (0 = max compression, 1 = lossless), `allowsEditing: true` + `aspect` crops the image in the native UI before returning. For further resizing, use **`expo-image-manipulator`** (`resize`, `rotate`, `flip`, `compress`) as a post-processing step.",
            np: "quality र allowsEditing — नेटिभ ले कम्प्रेस र क्रप गर्छ।",
            jp: "`quality` と `allowsEditing + aspect` でネイティブ側が圧縮・クロップします。追加加工は **`expo-image-manipulator`** を使います。",
          },
        },
        {
          type: "code",
          title: { en: "`expo-image-manipulator` — post-process resize + compress", np: "म्यानिपुलेटर", jp: "画像の後処理" },
          code: `import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Resize and compress a local image to a max dimension of 1024px
 * and JPEG quality 0.7. Returns the new local URI.
 */
export async function resizeImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1024 } }],   // height auto-calculated to preserve ratio
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );
  return result.uri;
}

// Usage before upload:
// const compressedUri = await resizeImage(rawUri);
// await uploadImage(compressedUri);`,
        },
      ],
    },
    {
      title: { en: "Building ImageInput — Layout and Touches", np: "ImageInput घटक निर्माण", jp: "ImageInput コンポーネントの構築" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The **`ImageInput`** component combines the image picker logic with an interactive display area. It uses **`TouchableWithoutFeedback`** so the entire surface — including the rendered image itself — responds to taps. When no image is selected it calls the picker; when an image is already present it prompts the user to delete it via an `Alert`. This keeps all pick/remove decisions in one self-contained component.",
            np: "`TouchableWithoutFeedback` ले सम्पूर्ण क्षेत्रलाई ट्याप-योग्य बनाउँछ। इमेज छ भने मेट्ने विकल्प, नभए पिकर खोल्छ।",
            jp: "**`TouchableWithoutFeedback`** で画像を含むエリア全体をタップ可能にします。画像がある場合は削除アラート、ない場合はピッカーを起動します。",
          },
        },
        {
          type: "code",
          title: { en: "ImageInput component — tap to pick, tap to remove", np: "ImageInput कोड", jp: "ImageInput の実装" },
          code: `// components/ImageInput.tsx
import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native';

interface Props {
  imageUri?: string;
  onChangeImage: (uri?: string) => void;
}

export function ImageInput({ imageUri, onChangeImage }: Props) {
  const handlePress = () => {
    if (!imageUri) return requestImage();
    Alert.alert('Delete', 'Delete this image?', [
      { text: 'Yes', onPress: () => onChangeImage(undefined) },
      { text: 'No' },
    ]);
  };

  const requestImage = async () => {
    const uri = await pickFromLibrary();
    if (uri) onChangeImage(uri);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <MaterialCommunityIcons name="camera" size={40} color="#999" />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`TouchableWithoutFeedback`** is the right wrapper here because you want tap detection over the image without any visual ripple or opacity change on the image itself.",
              np: "`TouchableWithoutFeedback` — छवि माथि भिजुअल इफेक्ट बिना ट्याप पत्ता लगाउँछ।",
              jp: "**`TouchableWithoutFeedback`** は画像上でビジュアル変化なしにタップを検知するのに最適です。",
            },
            {
              en: "`overflow: 'hidden'` on the container clips the image to the rounded corners without needing a separate `borderRadius` on the `<Image>` itself.",
              np: "`overflow: 'hidden'` — गोलाई कोनामा छवि काट्छ।",
              jp: "`overflow: 'hidden'` でコンテナの角丸に画像をクリップします。`<Image>` に個別に `borderRadius` は不要です。",
            },
            {
              en: "The `onChangeImage(undefined)` call signals removal — the parent component nullifies the URI in its state.",
              np: "`onChangeImage(undefined)` — अभिभावकलाई URI हटाउन सङ्केत गर्छ।",
              jp: "`onChangeImage(undefined)` で親に削除を通知し、親の状態のURIをnullにします。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Building ImageInputList — Basics and Scrolling", np: "ImageInputList — क्षैतिज स्क्रोल", jp: "ImageInputList の構築とスクロール" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`ImageInputList`** renders a **horizontal `ScrollView`** of `ImageInput` cells — one per existing URI — plus a blank `ImageInput` at the end that acts as the add-new button. When the user removes a cell, `onRemoveImage` is called with that URI; when the blank cell is tapped, `onAddImage` receives the newly picked URI. This gives a photo-strip UX similar to iOS Messages or WhatsApp.",
            np: "क्षैतिज ScrollView मा ImageInput सेलहरू — पछिल्लो blank ले नयाँ थप्न दिन्छ।",
            jp: "水平 **`ScrollView`** で `ImageInput` を並べ、末尾の空セルが追加ボタンになります。iMessage 風のフォトストリップ UX です。",
          },
        },
        {
          type: "code",
          title: { en: "ImageInputList — horizontal photo strip", np: "ImageInputList कोड", jp: "ImageInputList の実装" },
          code: `import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { ImageInput } from './ImageInput';

interface Props {
  imageUris: string[];
  onAddImage: (uri: string) => void;
  onRemoveImage: (uri: string) => void;
}

export function ImageInputList({ imageUris, onAddImage, onRemoveImage }: Props) {
  return (
    <View>
      <ScrollView horizontal>
        {imageUris.map((uri) => (
          <View key={uri} style={styles.item}>
            <ImageInput
              imageUri={uri}
              onChangeImage={(newUri) => {
                if (!newUri) onRemoveImage(uri);
              }}
            />
          </View>
        ))}
        <ImageInput onChangeImage={(uri) => uri && onAddImage(uri)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { marginRight: 10 },
});`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Using the `uri` itself as the React `key` is convenient, but if duplicate URIs are possible (e.g. the same photo added twice) use a UUID or index instead.",
              np: "key को रूपमा uri — डुप्लिकेट भए UUID प्रयोग गर्नुस्।",
              jp: "`uri` を `key` にするのは便利ですが、重複がある場合は UUID やインデックスを使いましょう。",
            },
            {
              en: "`horizontal` on `ScrollView` enables horizontal paging. Add `showsHorizontalScrollIndicator={false}` to hide the scroll bar for a cleaner look.",
              np: "`horizontal` — क्षैतिज स्क्रोल; स्क्रोल बार लुकाउन `showsHorizontalScrollIndicator={false}`।",
              jp: "`horizontal` で横スクロールになります。`showsHorizontalScrollIndicator={false}` でスクロールバーを非表示にできます。",
            },
            {
              en: "The trailing `<ImageInput onChangeImage={...} />` with no `imageUri` always renders as the blank add-more slot, automatically moving to the right as items are added.",
              np: "अन्तिम blank ImageInput सधैं नयाँ थप्ने ठाउँ हो।",
              jp: "末尾の `imageUri` なし `<ImageInput>` が常に「追加」スロットとして右端に表示されます。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Building FormImagePicker — Wiring into Formik", np: "FormImagePicker — Formik संग जोड्ने", jp: "FormImagePicker — Formik への接続" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`FormImagePicker`** bridges `ImageInputList` with a Formik form by using the **`useFormikContext`** hook. The hook returns `values` and `setFieldValue` directly from the enclosing `<Formik>` context — no prop-drilling of `values` or `onChange` handlers needed. The `name` prop maps to a string-array field in the form's initial values (e.g. `images: []`).",
            np: "`useFormikContext` ले Formik context बाट `values` र `setFieldValue` सिधा लिन्छ — prop-drilling आवश्यक छैन।",
            jp: "**`useFormikContext`** で親の `<Formik>` から `values` と `setFieldValue` を直接取得します。prop のバケツリレーが不要になります。",
          },
        },
        {
          type: "code",
          title: { en: "FormImagePicker — Formik-aware image list field", np: "FormImagePicker कोड", jp: "FormImagePicker の実装" },
          code: `import React from 'react';
import { useFormikContext } from 'formik';
import { ImageInputList } from './ImageInputList';

interface Props {
  name: string;
}

export function FormImagePicker({ name }: Props) {
  const { values, setFieldValue } = useFormikContext<Record<string, string[]>>();
  const imageUris: string[] = values[name] ?? [];

  return (
    <ImageInputList
      imageUris={imageUris}
      onAddImage={(uri) => setFieldValue(name, [...imageUris, uri])}
      onRemoveImage={(uri) => setFieldValue(name, imageUris.filter((i) => i !== uri))}
    />
  );
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`useFormikContext`** throws if called outside a `<Formik>` ancestor, providing a clear error instead of a silent bug.",
              np: "`useFormikContext` — Formik ancestor बाहिर भए error फेंक्छ।",
              jp: "**`useFormikContext`** は `<Formik>` の外で呼ぶとエラーを投げるため、バグが即座に発見できます。",
            },
            {
              en: "The `Record<string, string[]>` generic keeps TypeScript happy when the form type is not known at compile time. Replace it with your actual form-values interface for stricter typing.",
              np: "`Record<string, string[]>` — कम्पाइल-टाइम type थाहा नभए प्रयोग गर्नुस्।",
              jp: "`Record<string, string[]>` はフォームの型が不定のときの汎用型。実際の型があれば差し替えると型安全になります。",
            },
            {
              en: "On form submission, `values[name]` is an array of local `file://` URIs. Upload each URI to your backend before saving the form data.",
              np: "सबमिटमा `values[name]` — local URI array। सर्भरमा अपलोड गर्नुस् पहिले।",
              jp: "送信時の `values[name]` はローカル `file://` URI の配列。バックエンドへアップロードしてから保存します。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Building Custom Hooks — useImagePicker", np: "कस्टम हुक — useImagePicker", jp: "カスタムフック — useImagePicker" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Extracting the picker and permission logic into a **`useImagePicker`** custom hook keeps components clean and makes the behaviour testable in isolation. The hook manages its own `images` state array and exposes `pickImage` (wrapped in `useCallback` to prevent stale closures) and `removeImage`. Any component that needs a photo list just calls `const { images, pickImage, removeImage } = useImagePicker()`.",
            np: "कस्टम हुकले picker र permission logic component बाट अलग राख्छ — test र reuse गर्न सजिलो।",
            jp: "カスタムフックにpickerとpermissionのロジックを切り出すことで、コンポーネントをシンプルに保ちつつ、ロジックを独立してテストできます。",
          },
        },
        {
          type: "code",
          title: { en: "useImagePicker — reusable image state hook", np: "useImagePicker कोड", jp: "useImagePicker の実装" },
          code: `import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useImagePicker() {
  const [images, setImages] = useState<string[]>([]);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  }, []);

  const removeImage = useCallback((uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri));
  }, []);

  return { images, pickImage, removeImage };
}`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`useCallback`** on `pickImage` and `removeImage` ensures the function references are stable across re-renders, so passing them as props does not cause unnecessary child re-renders.",
              np: "`useCallback` — stable reference, अनावश्यक re-render रोक्छ।",
              jp: "**`useCallback`** で関数参照を安定させ、子コンポーネントの不要な再レンダーを防ぎます。",
            },
            {
              en: "The functional `setImages((prev) => [...prev, uri])` form prevents stale-closure bugs when `pickImage` is called rapidly in succession.",
              np: "functional `setImages` — rapid call मा stale-closure bug रोक्छ।",
              jp: "関数形式の `setImages((prev) => ...)` で連続呼び出し時の古いクロージャのバグを防ぎます。",
            },
            {
              en: "To extend the hook, accept an optional `maxImages` parameter and guard inside `pickImage` with an early return when `images.length >= maxImages`.",
              np: "`maxImages` parameter थपेर hook extend गर्न सकिन्छ।",
              jp: "オプションの `maxImages` を受け取り、`images.length >= maxImages` のとき早期リターンすることでフックを拡張できます。",
            },
          ],
        },
        {
          type: "table",
          caption: {
            en: "Summary — component and hook responsibilities",
            np: "घटक र हुक जिम्मेवारी सारांश",
            jp: "コンポーネント・フック責務まとめ",
          },
          headers: [
            { en: "Unit", np: "एकाइ", jp: "ユニット" },
            { en: "Responsibility", np: "जिम्मेवारी", jp: "責務" },
          ],
          rows: [
            [
              { en: "ImageInput", np: "ImageInput", jp: "ImageInput" },
              { en: "Single slot — tap to pick or delete one image", np: "एक स्लट — ट्याप गरेर एक इमेज छान्ने वा मेट्ने", jp: "1スロット — タップで1枚選択または削除" },
            ],
            [
              { en: "ImageInputList", np: "ImageInputList", jp: "ImageInputList" },
              { en: "Horizontal strip of ImageInput slots + add-new slot", np: "क्षैतिज ImageInput पट्टी + नयाँ थप्ने स्लट", jp: "ImageInputの横並びストリップ＋追加スロット" },
            ],
            [
              { en: "FormImagePicker", np: "FormImagePicker", jp: "FormImagePicker" },
              { en: "Formik field adapter — reads/writes images array in form context", np: "Formik field adapter — form context मा इमेज array पढ्ने/लेख्ने", jp: "Formikフィールドアダプタ — フォームコンテキストの画像配列を読み書き" },
            ],
            [
              { en: "useImagePicker", np: "useImagePicker", jp: "useImagePicker" },
              { en: "Stateful hook — manages images array, picker call, and remove logic", np: "Stateful hook — images array, picker call, र remove logic", jp: "ステートフルフック — 画像配列・picker呼び出し・削除ロジックを管理" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "The camera shows a black screen on the iOS simulator — what is wrong?",
        np: "सिम्युलेटरमा क्यामेरा कालो?",
        jp: "iOS シミュレーターでカメラが黒い？",
      },
      answer: {
        en: "The iOS simulator **does not have a camera** — it returns a blank/black feed by design. Use `launchImageLibraryAsync` to test picking from the simulated photo library, and test actual camera capture on a **physical device**. For CI or screenshot automation, mock the `expo-image-picker` module with a static URI.",
        np: "सिम्युलेटरमा क्यामेरा हुँदैन — भौतिक डिभाइस प्रयोग गर्नुस्।",
        jp: "iOS シミュレーターにはカメラがありません。**実機**でテストするか、ライブラリ選択でテストしましょう。",
      },
    },
    {
      question: {
        en: "Why does the app show the permission dialog every time on Android during development?",
        np: "Android मा हर पटक अनुमति?",
        jp: "Android で毎回権限ダイアログが出る？",
      },
      answer: {
        en: "During development (`expo run:android`), permissions are sometimes **reset between fast-reload sessions** because the app package changes with debug builds. This will not happen in a production APK. Also check that you have declared the correct `<uses-permission>` entries in your `AndroidManifest.xml` — missing entries cause silent permission failures on some API levels.",
        np: "डिबग बिल्डमा रिसेट हुन सक्छ — प्रोडक्सनमा हुँदैन।",
        jp: "デバッグビルドではパッケージが変わるため権限がリセットされることがあります。本番 APK では起きません。",
      },
    },
    {
      question: {
        en: "What is the difference between `requestMediaLibraryPermissionsAsync` and `usePermissions`?",
        np: "requestAsync र usePermissions फरक?",
        jp: "`requestMediaLibraryPermissionsAsync` と `usePermissions` の違いは？",
      },
      answer: {
        en: "`requestMediaLibraryPermissionsAsync` is a **one-shot async function** you call imperatively. `usePermissions` is a **React hook** that keeps permission status in component state and re-renders when it changes. Use the hook inside components so the UI reactively updates when the user grants or denies access. Use the async function in service modules (outside React trees) where hooks are not allowed.",
        np: "घटकभित्र usePermissions; बाहिर async function।",
        jp: "コンポーネント内では **`usePermissions`** フック、サービスモジュールなどReact外では非同期関数を使います。",
      },
    },
    {
      question: {
        en: "How should I handle the iOS 14+ 'limited' photo access mode?",
        np: "iOS 14+ सीमित पहुँच कसरी ह्यान्डल गर्ने?",
        jp: "iOS 14+ の「一部のみ許可」はどう扱いますか？",
      },
      answer: {
        en: "When `permission.accessPrivileges === 'limited'`, the user has allowed access to only a subset of photos. `launchImageLibraryAsync` will still work — it opens a picker restricted to the allowed subset. You can prompt the user to expand access by calling `MediaLibrary.presentPermissionsPickerAsync()`, which opens the iOS system photo selection sheet so they can add more photos without leaving your app.",
        np: "`presentPermissionsPickerAsync()` ले थप फोटो थप्न दिन्छ।",
        jp: "`accessPrivileges === 'limited'` のときは `MediaLibrary.presentPermissionsPickerAsync()` で追加選択を促せます。",
      },
    },
    {
      question: {
        en: "Why might my server reject the uploaded image even when fetch succeeds?",
        np: "अपलोड सफल भयो तर सर्भरले अस्वीकार गर्यो?",
        jp: "fetch は成功したのにサーバが拒否する？",
      },
      answer: {
        en: "The most common causes: (1) **wrong field name** — check what `Content-Disposition: form-data; name=` value your backend expects; (2) **MIME type mismatch** — pass the correct `type` (`'image/jpeg'` or `'image/png'`) in the FormData entry; (3) **file size over limit** — add server-side logging to confirm whether the body reaches the controller; (4) **CORS / auth header missing** — add the `Authorization` header if the endpoint requires authentication.",
        np: "फिल्ड नाम, MIME टाइप, साइज सीमा, वा Auth हेडर जाँच्नुस्।",
        jp: "よくある原因：①フィールド名の不一致、②MIMEタイプ不正、③ファイルサイズ超過、④Authヘッダー欠落。",
      },
    },
  ],
};

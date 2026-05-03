import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

export type PickedImage = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

type PickOptions = {
  aspect?: [number, number];
  quality?: number;
};

const DEFAULT: Required<PickOptions> = {
  aspect: [1, 1],
  quality: 0.8,
};

// Android 13+ uses the system photo picker which silently hangs when
// `allowsEditing: true` is passed alongside the new MediaType API. Cropping
// is iOS-only here; on Android we accept the image as-is and rely on
// `contentFit: "cover"` in consumer UIs to do the visual crop.
const ALLOW_EDITING = Platform.OS === "ios";

function toPicked(asset: ImagePicker.ImagePickerAsset): PickedImage {
  return {
    uri: asset.uri,
    mimeType: asset.mimeType,
    fileName: asset.fileName ?? undefined,
  };
}

export async function pickFromCamera(
  options?: PickOptions,
): Promise<PickedImage | null> {
  const opt = { ...DEFAULT, ...options };
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    throw new Error(
      perm.canAskAgain
        ? "კამერაზე წვდომა აკრძალულია"
        : "ჩართე კამერაზე წვდომა პარამეტრებში",
    );
  }
  const res = await ImagePicker.launchCameraAsync({
    quality: opt.quality,
    allowsEditing: ALLOW_EDITING,
    ...(ALLOW_EDITING ? { aspect: opt.aspect } : {}),
  });
  if (res.canceled || !res.assets[0]) return null;
  return toPicked(res.assets[0]);
}

export async function pickFromLibrary(
  options?: PickOptions,
): Promise<PickedImage | null> {
  const opt = { ...DEFAULT, ...options };
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error(
      perm.canAskAgain
        ? "გალერეაზე წვდომა აკრძალულია"
        : "ჩართე გალერეაზე წვდომა პარამეტრებში",
    );
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: opt.quality,
    allowsEditing: ALLOW_EDITING,
    ...(ALLOW_EDITING ? { aspect: opt.aspect } : {}),
  });
  if (res.canceled || !res.assets[0]) return null;
  return toPicked(res.assets[0]);
}

import {
  Activity,
  Footprints,
  Heart,
  LucideIcon,
  Mountain,
  Utensils,
  Watch,
} from "lucide-react-native";

export type DataType = {
  key: string;
  label: string;
};

export type Integration = {
  id: string;
  name: string;
  Icon: LucideIcon;
  color: string;
  tint: string;
  tintDark: string;
  description: string;
  dataTypes: DataType[];
  category: "ჯანმრთელობა" | "ფიტნესი" | "კვება";
  defaultConnected?: boolean;
};

export const INTEGRATIONS: Integration[] = [
  {
    id: "apple-health",
    name: "Apple Health",
    Icon: Heart,
    color: "#FF3B5C",
    tint: "#FFE4E9",
    tintDark: "#3A1018",
    description: "iOS-ის სტანდარტული ჯანმრთელობის აპი",
    category: "ჯანმრთელობა",
    defaultConnected: true,
    dataTypes: [
      { key: "steps", label: "ნაბიჯები" },
      { key: "weight", label: "წონა" },
      { key: "workouts", label: "ვარჯიში" },
      { key: "heart-rate", label: "გულისცემა" },
      { key: "sleep", label: "ძილი" },
      { key: "active-energy", label: "აქტიური კალორია" },
    ],
  },
  {
    id: "google-fit",
    name: "Google Fit",
    Icon: Activity,
    color: "#34A867",
    tint: "#E6F6EA",
    tintDark: "#1F3A28",
    description: "Android-ის ჯანმრთელობის პლატფორმა",
    category: "ჯანმრთელობა",
    dataTypes: [
      { key: "steps", label: "ნაბიჯები" },
      { key: "weight", label: "წონა" },
      { key: "workouts", label: "ვარჯიში" },
      { key: "heart-rate", label: "გულისცემა" },
    ],
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    Icon: Watch,
    color: "#1D6BE8",
    tint: "#E1ECFD",
    tintDark: "#102240",
    description: "Garmin საათები და ფიტნეს მოწყობილობები",
    category: "ფიტნესი",
    dataTypes: [
      { key: "workouts", label: "ვარჯიში" },
      { key: "heart-rate", label: "გულისცემა" },
      { key: "vo2", label: "VO2 max" },
      { key: "recovery", label: "აღდგენა" },
    ],
  },
  {
    id: "fitbit",
    name: "Fitbit",
    Icon: Footprints,
    color: "#00B0B9",
    tint: "#DDF5F5",
    tintDark: "#0B2C2E",
    description: "Fitbit მოწყობილობები და აპი",
    category: "ფიტნესი",
    dataTypes: [
      { key: "steps", label: "ნაბიჯები" },
      { key: "sleep", label: "ძილი" },
      { key: "heart-rate", label: "გულისცემა" },
    ],
  },
  {
    id: "strava",
    name: "Strava",
    Icon: Mountain,
    color: "#FC4C02",
    tint: "#FEE3D7",
    tintDark: "#3A1408",
    description: "სირბილი, ველოსიპედი, აქტივობები",
    category: "ფიტნესი",
    dataTypes: [
      { key: "workouts", label: "აქტივობები" },
      { key: "distance", label: "მანძილი" },
      { key: "elevation", label: "სიმაღლე" },
    ],
  },
  {
    id: "myfitnesspal",
    name: "MyFitnessPal",
    Icon: Utensils,
    color: "#0072C6",
    tint: "#DCEFFB",
    tintDark: "#0A1F3A",
    description: "ცნობილი კვების ბაზა",
    category: "კვება",
    dataTypes: [
      { key: "foods", label: "საკვები ბაზა" },
      { key: "barcode", label: "ბარკოდი" },
    ],
  },
];

export const APPLE_HEALTH_CONNECTED = true;
export const LAST_SYNC_LABEL = "ახლახან";

export const getIntegration = (id: string) =>
  INTEGRATIONS.find((i) => i.id === id);

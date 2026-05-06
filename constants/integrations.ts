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
  labelKey: string;
};

export type IntegrationCategory = "health" | "fitness" | "nutrition";

export type Integration = {
  id: string;
  name: string;
  Icon: LucideIcon;
  color: string;
  tint: string;
  tintDark: string;
  descriptionKey: string;
  dataTypes: DataType[];
  category: IntegrationCategory;
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
    descriptionKey: "integrations.descriptions.appleHealth",
    category: "health",
    defaultConnected: true,
    dataTypes: [
      { key: "steps", labelKey: "integrations.dataTypes.steps" },
      { key: "weight", labelKey: "integrations.dataTypes.weight" },
      { key: "workouts", labelKey: "integrations.dataTypes.workouts" },
      { key: "heart-rate", labelKey: "integrations.dataTypes.heartRate" },
      { key: "sleep", labelKey: "integrations.dataTypes.sleep" },
      { key: "active-energy", labelKey: "integrations.dataTypes.activeEnergy" },
    ],
  },
  {
    id: "google-fit",
    name: "Google Fit",
    Icon: Activity,
    color: "#34A867",
    tint: "#E6F6EA",
    tintDark: "#1F3A28",
    descriptionKey: "integrations.descriptions.googleFit",
    category: "health",
    dataTypes: [
      { key: "steps", labelKey: "integrations.dataTypes.steps" },
      { key: "weight", labelKey: "integrations.dataTypes.weight" },
      { key: "workouts", labelKey: "integrations.dataTypes.workouts" },
      { key: "heart-rate", labelKey: "integrations.dataTypes.heartRate" },
    ],
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    Icon: Watch,
    color: "#1D6BE8",
    tint: "#E1ECFD",
    tintDark: "#102240",
    descriptionKey: "integrations.descriptions.garmin",
    category: "fitness",
    dataTypes: [
      { key: "workouts", labelKey: "integrations.dataTypes.workouts" },
      { key: "heart-rate", labelKey: "integrations.dataTypes.heartRate" },
      { key: "vo2", labelKey: "integrations.dataTypes.vo2" },
      { key: "recovery", labelKey: "integrations.dataTypes.recovery" },
    ],
  },
  {
    id: "fitbit",
    name: "Fitbit",
    Icon: Footprints,
    color: "#00B0B9",
    tint: "#DDF5F5",
    tintDark: "#0B2C2E",
    descriptionKey: "integrations.descriptions.fitbit",
    category: "fitness",
    dataTypes: [
      { key: "steps", labelKey: "integrations.dataTypes.steps" },
      { key: "sleep", labelKey: "integrations.dataTypes.sleep" },
      { key: "heart-rate", labelKey: "integrations.dataTypes.heartRate" },
    ],
  },
  {
    id: "strava",
    name: "Strava",
    Icon: Mountain,
    color: "#FC4C02",
    tint: "#FEE3D7",
    tintDark: "#3A1408",
    descriptionKey: "integrations.descriptions.strava",
    category: "fitness",
    dataTypes: [
      { key: "workouts", labelKey: "integrations.dataTypes.activities" },
      { key: "distance", labelKey: "integrations.dataTypes.distance" },
      { key: "elevation", labelKey: "integrations.dataTypes.elevation" },
    ],
  },
  {
    id: "myfitnesspal",
    name: "MyFitnessPal",
    Icon: Utensils,
    color: "#0072C6",
    tint: "#DCEFFB",
    tintDark: "#0A1F3A",
    descriptionKey: "integrations.descriptions.myfitnesspal",
    category: "nutrition",
    dataTypes: [
      { key: "foods", labelKey: "integrations.dataTypes.foods" },
      { key: "barcode", labelKey: "integrations.dataTypes.barcode" },
    ],
  },
];

export const APPLE_HEALTH_CONNECTED = true;

export const getIntegration = (id: string) =>
  INTEGRATIONS.find((i) => i.id === id);

import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { CheckCircle2, Info, X, XCircle } from "lucide-react-native";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastVariant = "success" | "error" | "info";

export type ToastOptions = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastItem = Required<Pick<ToastOptions, "message" | "variant">> & {
  id: string;
  title?: string;
  duration: number;
};

type ToastApi = {
  show: (options: ToastOptions) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  info: (message: string, title?: string) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION = 3500;

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const show = useCallback((options: ToastOptions) => {
    const id = makeId();
    const item: ToastItem = {
      id,
      title: options.title,
      message: options.message,
      variant: options.variant ?? "info",
      duration: options.duration ?? DEFAULT_DURATION,
    };
    setToasts((prev) => [...prev, item]);
    return id;
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, title) => show({ message, title, variant: "success" }),
      error: (message, title) => show({ message, title, variant: "error" }),
      info: (message, title) => show({ message, title, variant: "info" }),
      dismiss,
      clear,
    }),
    [show, dismiss, clear],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={[styles.viewport, { paddingTop: insets.top + Spacing.sm }]}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </View>
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const translate = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dismissedRef = useRef(false);

  const close = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    Animated.parallel([
      Animated.timing(translate, {
        toValue: -24,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(item.id));
  }, [translate, opacity, onDismiss, item.id]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translate, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(close, item.duration);
    return () => clearTimeout(timer);
  }, [translate, opacity, item.duration, close]);

  const palette = paletteFor(item.variant, theme);
  const Icon = iconFor(item.variant);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          shadowColor: theme.shadow,
          opacity,
          transform: [{ translateY: translate }],
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.iconBg }]}>
        <Icon size={18} color={palette.icon} strokeWidth={2.4} />
      </View>
      <View style={styles.body}>
        {item.title ? (
          <Text style={[styles.title, { color: palette.title }]} numberOfLines={2}>
            {item.title}
          </Text>
        ) : null}
        <Text
          style={[styles.message, { color: palette.message }]}
          numberOfLines={4}
        >
          {item.message}
        </Text>
      </View>
      <Pressable
        onPress={close}
        hitSlop={10}
        style={({ pressed }) => [styles.close, pressed && { opacity: 0.5 }]}
      >
        <X size={16} color={palette.message} strokeWidth={2.2} />
      </Pressable>
    </Animated.View>
  );
}

function iconFor(variant: ToastVariant) {
  if (variant === "success") return CheckCircle2;
  if (variant === "error") return XCircle;
  return Info;
}

function paletteFor(
  variant: ToastVariant,
  theme: (typeof Colors)["light"] | (typeof Colors)["dark"],
) {
  const base = {
    title: theme.text,
    message: theme.textSecondary,
    bg: theme.card,
  };
  if (variant === "success") {
    return {
      ...base,
      icon: theme.textOnBrand,
      iconBg: theme.success,
      border: theme.success,
    };
  }
  if (variant === "error") {
    return {
      ...base,
      icon: theme.textOnBrand,
      iconBg: theme.error,
      border: theme.error,
    };
  }
  return {
    ...base,
    icon: theme.textOnBrand,
    iconBg: theme.brand,
    border: theme.brand,
  };
}

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    zIndex: 9999,
    elevation: 9999,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderLeftWidth: 4,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  message: {
    fontSize: Type.sm,
    lineHeight: 18,
  },
  close: {
    padding: Spacing.xs,
    marginTop: -2,
  },
});

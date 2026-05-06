import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const MAX_ITEM_LEN = 60;

type Props = {
  items: string[];
  onAdd: (raw: string) => void;
  onRemove: (name: string) => void;
  placeholder: string;
  addLabel: string;
};

// Owns its own draft state so the parent doesn't have to. Caller passes the
// list and add/remove handlers; ChipInput handles the input → submit → clear flow.
export default function ChipInput({
  items,
  onAdd,
  onRemove,
  placeholder,
  addLabel,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [draft, setDraft] = useState("");
  const canAdd = draft.trim().length > 0;

  const submit = () => {
    if (!canAdd) return;
    onAdd(draft);
    setDraft("");
  };

  return (
    <View style={{ gap: Spacing.sm }}>
      <View
        style={[
          styles.row,
          { backgroundColor: theme.background, borderColor: theme.border },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={submit}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          returnKeyType="done"
          maxLength={MAX_ITEM_LEN}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={submit}
          disabled={!canAdd}
          activeOpacity={0.7}
          style={[
            styles.addBtn,
            { backgroundColor: canAdd ? theme.brand : theme.borderLight },
          ]}
        >
          <ThemedText
            style={styles.addBtnText}
            color={canAdd ? theme.textOnBrand : theme.textSecondary}
          >
            {addLabel}
          </ThemedText>
        </TouchableOpacity>
      </View>
      {items.length > 0 ? (
        <View style={styles.chipsWrap}>
          {items.map((name) => (
            <TouchableOpacity
              key={name}
              onPress={() => onRemove(name)}
              activeOpacity={0.7}
              style={[styles.chip, { backgroundColor: theme.brandSoft }]}
            >
              <ThemedText style={styles.chipText} color={theme.brandDeep}>
                {name}
              </ThemedText>
              <X color={theme.brandDeep} size={12} />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.md,
    paddingRight: 4,
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  input: { flex: 1, height: "100%", fontSize: Type.base },
  addBtn: {
    paddingHorizontal: Spacing.md,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: Type.sm, fontWeight: "700" },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  chipText: { fontSize: Type.sm, fontWeight: "700" },
});

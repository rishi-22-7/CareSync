export const DOSAGE_SLOTS = [
  { key: "pre_breakfast", label: "Pre-Breakfast", defaultTime: "07:00", icon: "🌅" },
  { key: "morning",       label: "Morning",       defaultTime: "09:00", icon: "☀️" },
  { key: "afternoon",     label: "Afternoon",     defaultTime: "14:00", icon: "🌤️" },
  { key: "night",         label: "Night",         defaultTime: "21:00", icon: "🌙" },
];

export const makeInitialMedForm = () => ({
  name: "", type: "Pill", dosage_quantity: "", pill_image_url: "",
  slots: {
    pre_breakfast: { checked: false, time: "07:00", instruction: "Before Food" },
    morning:       { checked: false, time: "09:00", instruction: "After Food"  },
    afternoon:     { checked: false, time: "14:00", instruction: "After Food"  },
    night:         { checked: false, time: "21:00", instruction: "After Food"  },
  },
});

/** Strip whatsapp prefix and country code, return clean 10-digit number */
export const formatPhone = (raw = "") => {
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : raw;
};

/** Get dynamic dosage placeholder based on medication type */
export const getDosagePlaceholder = (type = "Pill") => {
  const placeholders = {
    "Pill": "e.g., 1 pill, 0.5 pill",
    "Capsule": "e.g., 1 pill, 0.5 pill",
    "Syrup": "e.g., 5ml, 10ml",
    "Drops": "e.g., 2 drops",
    "Cream": "e.g., Apply a thin layer",
    "Patch": "e.g., Apply a thin layer",
    "Injection": "e.g., 1 vial, 10mg",
  };
  return placeholders[type] || "e.g., specify quantity";
};

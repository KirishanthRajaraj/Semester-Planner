// localStorage only holds JSON, so Date objects are saved as ISO strings and come back as strings.
// This reviver turns those strings back into Date objects on load, so the app's date comparisons
// and .toLocaleDateString() calls keep working after a refresh.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export const reviveDates = (_key: string, value: unknown) =>
    typeof value === "string" && ISO_DATE.test(value) ? new Date(value) : value;

import { parse, formatISO, isSameDay, getHours, format } from "date-fns";

export function convertToDateISO(dateString) {
  const date = parse(dateString, "dd/MM/yyyy", new Date());
  return formatISO(date);
}

export function generateHours(date) {
  const now = new Date();
  const openingHour = 10;
  const closingHour = 19;
  let startHour = openingHour;

  // Usar isSameDay de date-fns para comparar fechas
  if (isSameDay(date, now)) {
    startHour = Math.max(openingHour, getHours(now) + 1);
  }

  return Array.from(
    { length: closingHour - startHour + 1 },
    (_, i) => `${startHour + i}:00`
  );

}

export function convertToDDMMYYYY(isoDate) {
 const newDate = new Date(isoDate);
  const formattedDate = format(newDate, "dd/MM/yyyy");
  return formattedDate;
}

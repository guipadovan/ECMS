export function dateFormat(inputDate, format) {
  const date = new Date(inputDate);

  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  format = format.replace("mm", minute.toString().padStart(2, "0"));
  format = format.replace("hh", hour.toString().padStart(2, "0"));

  format = format.replace("MM", month.toString().padStart(2, "0"));

  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substring(2, 2));
  }

  format = format.replace("dd", day.toString().padStart(2, "0"));

  return format;
}
export default function dateNow() {
  const date = new Date();
  date.setHours(date.getHours() + 1);

  return date.toISOString().replace("T", " ").substring(0, 19);
}

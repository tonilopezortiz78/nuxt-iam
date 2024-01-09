// This plugin returns today's date
import dayjs from "dayjs";

const now = dayjs();
const today = now.format("dddd, DD MMMM, YYYY, HH:mm:ss"); // Format as desired

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.today = today;
});

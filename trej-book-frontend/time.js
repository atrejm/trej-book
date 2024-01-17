import { DateTime } from 'luxon'

const time = DateTime.fromISO("2024-01-17T21:15:18.418Z").toLocaleString(DateTime.DATETIME_FULL);
console.log(time);
// const { DateTime } = require('luxon');
import { DateTime } from 'luxon';

export default function formatDate(unformattedDate: string) {
    console.log("unformatted date: ", unformattedDate);
    return DateTime.fromISO(unformattedDate).toLocaleString(DateTime.DATETIME_MED)
}
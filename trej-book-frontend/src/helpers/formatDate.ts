// const { DateTime } = require('luxon');
import { DateTime } from 'luxon';

export default function formatDate(unformattedDate: string) {
    return DateTime.fromISO(unformattedDate).toLocaleString(DateTime.DATETIME_MED)
}
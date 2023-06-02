import dayjs from 'dayjs'

export function strToTimeStamp(str) {
	return dayjs(str).valueOf()
}
// returns all days of the input week
export function getDays({ startDate, endDate }: { startDate: Date; endDate: Date }): Date[] {
    const days: Date[] = [];
    const d = new Date(startDate);
    while (d <= endDate) {
        days.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    return days;
}

export function getWeeks(start: Date, end: Date) {
    const weeks: { startDate: Date; endDate: Date }[] = [];
    let weekStart = new Date(start);
    while (weekStart < end) {
        // Sunday
        const weekEnd = new Date(weekStart);
        let startDay = weekStart.getDay(); // 0=Sun - 6=Sat
        const weekdayIndex = (startDay + 6) % 7; // konvertieren zu, Mon=0 - Sun=6, damit es einfacher ist zum rechnen
        weekEnd.setHours(23, 59, 59, 999);

        const daysToSunday = 6 - weekdayIndex;
        weekEnd.setDate(weekStart.getDate() + daysToSunday);
        weeks.push({ startDate: weekStart, endDate: weekEnd < end ? weekEnd : end });
        weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() + 1);
        weekStart.setHours(0, 0, 0, 0);
    }
    return weeks;
}
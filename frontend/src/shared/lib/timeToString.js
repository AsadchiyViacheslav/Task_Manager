export function timeToString(deadline = null) {
    const now = new Date();
    // console.log(deadline)
    let target;
    if (deadline) {
        const [y, m, d] = deadline.split("-").map(Number);
        target = new Date(y, m - 1, d);
    } else {
        target = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    let diff = target - now;
    if (diff <= 0) return "Истекло";

    const minute = 60000;
    const hour   = 60 * minute;
    const day    = 24 * hour;
    const month  = 30 * day;
    const year   = 365 * day;

    const years = Math.floor(diff / year);
    diff -= years * year;

    const months = Math.floor(diff / month);
    diff -= months * month;

    const days = Math.floor(diff / day);
    diff -= days * day;

    const hours = Math.floor(diff / hour);
    diff -= hours * hour;

    const minutes = Math.floor(diff / minute);

    if (years > 0) return years === 1 ? "1 год" : years < 5 ? `${years} года` : `${years} лет`;
    if (months > 0) return months === 1 ? "1 месяц" : months < 5 ? `${months} месяца` : `${months} месяцев`;
    if (days > 0) return days === 1 ? "1 день" : days < 5 ? `${days} дня` : `${days} дней`;
    if (hours > 0) return `${hours} ч ${minutes} мин`;
    return `${minutes} мин`;
}

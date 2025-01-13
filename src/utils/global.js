export const formatDate = (internalDate) => {
    const now = new Date();
    const givenDate = new Date(internalDate);

    const diffInMs = now - givenDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    // If the date is today, show the time
    if (diffInDays === 0) {
        return givenDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the date is within the past week
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays <= 6) return `${diffInDays} days ago`;

    // If the date is within the past few weeks
    if (diffInWeeks === 1) return "1 week ago";
    if (diffInWeeks <= 4) return `${diffInWeeks} weeks ago`;

    // If the date is within the past few months
    if (diffInMonths === 1) return "1 month ago";
    if (diffInMonths > 1) return `${diffInMonths} months ago`;

    // If the date is older than a year
    const diffInYears = Math.floor(diffInDays / 365);
    if (diffInYears === 1) return "1 year ago";
    return `${diffInYears} years ago`;
}
export function getRandomDarkBackgroundColor() {
    // Generate random values for red, green, and blue with an emphasis on dark shades
    const baseColors = [
        { r: 50, g: 0, b: 0 },   // Dark red
        { r: 0, g: 50, b: 0 },   // Dark green
        { r: 0, g: 0, b: 50 },   // Dark blue
        { r: 25, g: 25, b: 25 }, // Dark gray/blackish
    ];

    // Pick a random base color
    const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];

    // Randomly adjust the intensity slightly
    const r = Math.min(255, baseColor.r + Math.floor(Math.random() * 50));
    const g = Math.min(255, baseColor.g + Math.floor(Math.random() * 50));
    const b = Math.min(255, baseColor.b + Math.floor(Math.random() * 50));

    // Return as RGB string
    return `rgb(${r}, ${g}, ${b})`;
}
export function reorderObjectByInternalDateDesc(items) {
    const sortedEntries = Object.entries(items)
        .sort(([, a], [, b]) => {
            const dateA = new Date(a['internal_date']);
            const dateB = new Date(b['internal_date']);
            return dateB - dateA; // Descending order
        });
    return Object.fromEntries(sortedEntries);
}
export function formatScheduleTime(date) {
    const inputDate = new Date(date);
    const now = new Date();

    // Format time to "11:20 AM"
    const formatTime = (d) =>
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    // Calculate the difference in time
    const diffTime = now - inputDate; // Difference in milliseconds
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Formatting logic
    if (diffDays === 0 && now.getDate() === inputDate.getDate()) {
        // Today
        return `Today ${formatTime(inputDate)}`;
    } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== inputDate.getDate())) {
        // Yesterday
        return `Yesterday ${formatTime(inputDate)}`;
    } else if (diffDays < 7) {
        // Within a week
        return `${diffDays} days ago ${formatTime(inputDate)}`;
    } else {
        const monthsAgo = Math.floor(diffDays / 30); // Approximation
        if (monthsAgo >= 1) {
            return `${monthsAgo} months ago ${formatTime(inputDate)}`;
        } else {
            const weeksAgo = Math.floor(diffDays / 7);
            return `${weeksAgo} weeks ago ${formatTime(inputDate)}`;
        }
    }
}
export function checkDateState(date) {
    const inputDate = new Date(date);
    const now = new Date();

    // Remove the time part for accurate comparison by only considering the date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    if (inputDay.getTime() < today.getTime()) {
        return "Past";
    } else {
        return "New";
    }
}

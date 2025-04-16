/**
 * Determines the status of a contest based on its start time, duration, and draft status
 * @param {Object} contest - The contest object
 * @returns {string} - The status of the contest: "draft", "upcoming", "ongoing", or "past"
 */
export const determineContestStatus = (contest) => {
    console.log("Determining status for contest:", {
        title: contest.title,
        saveAsDraft: contest.saveAsDraft,
        startDate: contest.startDate,
        startTime: contest.startTime,
    })

    // If contest is saved as draft, return "draft" status
    if (contest.saveAsDraft) {
        return "draft"
    }

    const now = new Date()

    // Parse start date and time
    const startDateTime = parseContestDateTime(contest.startDate, contest.startTime)

    // If start time is invalid, return "upcoming" as default
    if (!startDateTime) {
        return "upcoming"
    }

    // Parse duration to get end time
    const endDateTime = getContestEndTime(startDateTime, contest.duration)

    // Determine status based on current time relative to start and end times
    if (now < startDateTime) {
        return "upcoming"
    } else if (now >= startDateTime && now <= endDateTime) {
        return "ongoing"
    } else {
        return "past"
    }
}

/**
 * Parses contest date and time strings into a Date object
 * @param {string} dateStr - Date string in format YYYY-MM-DD
 * @param {string} timeStr - Time string in format HH:MM
 * @returns {Date|null} - Date object representing the contest start time, or null if invalid
 */
export const parseContestDateTime = (dateStr, timeStr) => {
    try {
        // Handle different time formats
        let hours = 0
        let minutes = 0

        if (timeStr && timeStr.includes(":")) {
            const [hoursStr, minutesStr] = timeStr.split(":")
            hours = Number.parseInt(hoursStr, 10)
            minutes = Number.parseInt(minutesStr, 10)
        }

        // Create date object
        const date = new Date(dateStr)
        date.setHours(hours, minutes, 0, 0)

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return null
        }

        return date
    } catch (error) {
        console.error("Error parsing contest date/time:", error)
        return null
    }
}

/**
 * Calculates the end time of a contest based on start time and duration
 * @param {Date} startDateTime - The contest start date and time
 * @param {string} durationStr - Duration string (e.g., "3 hours")
 * @returns {Date} - Date object representing the contest end time
 */
export const getContestEndTime = (startDateTime, durationStr) => {
    try {
        // Clone the start date to avoid modifying it
        const endDateTime = new Date(startDateTime.getTime())

        // Parse duration string
        const hours = Number.parseInt(durationStr)

        // Add duration to start time
        endDateTime.setHours(endDateTime.getHours() + hours)

        return endDateTime
    } catch (error) {
        console.error("Error calculating contest end time:", error)
        // Return a default of 3 hours if there's an error
        const defaultEnd = new Date(startDateTime.getTime())
        defaultEnd.setHours(defaultEnd.getHours() + 3)
        return defaultEnd
    }
}

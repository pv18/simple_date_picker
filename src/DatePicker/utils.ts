export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const VISIBLE_CELLS_AMOUNT = 7 * 6

const sundayWeekToMondayWeekMap: Record<number, number> = {
    0: 6,
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5
}

export interface DateCellItem {
    date: number
    month: number
    year: number

}

// Определить кол-во дней в месяце ^
export const getDaysAmountInMonth = (year: number, month: number) => {
    const nextMonthDate = new Date(year, month + 1, 1)
    // мутирует объект даты
    nextMonthDate.setMinutes(-1)
    return nextMonthDate.getDate()
}


const getDayOfTheWeek = (date: Date) => {
    const day = date.getDay()

    return sundayWeekToMondayWeekMap[day]
}

// Получить предыдущий месяц ^
export const getPreviousMonthDays = (year: number, month: number) => {
    const currentMonthFirstDay = new Date(year, month, 1)
    const prevMonthCellAmount = getDayOfTheWeek(currentMonthFirstDay)

    const daysAmountInPrevMonth = getDaysAmountInMonth(year, month - 1)

    const dateCells: DateCellItem[] = []

    const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1]

    for (let i = prevMonthCellAmount - 1; i >= 0; i--) {
        dateCells.push({
            year: cellYear,
            month: cellMonth,
            date: daysAmountInPrevMonth - i
        })
    }
    return dateCells
}

// Получить следующий месяц
export const getNextMonthDays = (year: number, month: number) => {
    const currentMonthFirstDay = new Date(year, month, 1)
    const prevMonthCellAmount = getDayOfTheWeek(currentMonthFirstDay)

    const daysAmount = getDaysAmountInMonth(year, month)

    const nextMonthDays = VISIBLE_CELLS_AMOUNT - daysAmount - prevMonthCellAmount

    const [cellYear, cellMonth] = month === 11 ? [year + 1, 0] : [year, month + 1]

    const dateCells: DateCellItem[] = []

    for (let i = 1; i <= nextMonthDays; i++) {
        dateCells.push({
            year: cellYear,
            month: cellMonth,
            date: i,
        })
    }

    return dateCells
}

// Получить текущий месяц
export const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
    const dateCells: DateCellItem[] = []

    for (let i = 1; i <= numberOfDays; i++) {
        dateCells.push({
            year,
            month,
            date: i
        })
    }

    return dateCells
}
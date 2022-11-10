import React, {useMemo, useState} from 'react';

interface DatePickerProps {
    value: Date
    onChange: (value: Date) => void
    min?: Date
    max?: Date
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface DateCellItem {
    date: number
    month: number
    year: number

    // ???
    isToday?: boolean
    isSelected?: boolean
}

// Определить кол-во дней в месяце ^
const getDaysAmountInMonth = (year: number, month: number) => {
    const nextMonthDate = new Date(year, month + 1, 1)
    // мутирует объект даты
    nextMonthDate.setMinutes(-1)
    return nextMonthDate.getDate()
}
// Получить предыдущий месяц ^
const getPreviousMonthDays = (year: number, month: number) => {
    const currentMonthFirstDay = new Date(year, month, 1)
    const dayOfTheWeek = currentMonthFirstDay.getDay()
    const prevMonthCellAmount = dayOfTheWeek - 1

    const daysAmountInPrevMonth = getDaysAmountInMonth(year, month - 1)

    const dateCells: DateCellItem[] = []

    const [cellYear, cellMonth] = month === 0 ? [year - 1, 11] : [year, month - 1]

    for (let i = 0; i < prevMonthCellAmount; i++) {
        // TODO negative month?
        dateCells.push({
            year: cellYear,
            month: cellMonth,
            date: daysAmountInPrevMonth - i
        })
    }
    return dateCells
}

const VISIBLE_CELLS_AMOUNT = 7 * 6
// Получить следующий месяц
const getNextMonthDays = (year: number, month: number) => {
    // TODO copy paste
    const currentMonthFirstDay = new Date(year, month, 1)
    const dayOfTheWeek = currentMonthFirstDay.getDay()
    const prevMonthCellAmount = dayOfTheWeek - 1
    // TODO end copy paste

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
const getCurrentMonthDays = (year: number, month: number, numberOfDays: number) => {
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

export const DatePicker = ({value, onChange, min, max}: DatePickerProps) => {
    const [panelYear, setYear] = useState(() => value.getFullYear())
    const [panelMonth, setMonth] = useState(() => value.getMonth())


    const [year, month, day] = useMemo(() => {
        const currentYear = value.getFullYear()
        const currentDay = value.getDate()
        const currentMonth = months[value.getMonth()]

        return [currentYear, currentDay, currentMonth]
    }, [value])

    const dateCells = useMemo(() => {
        // дней в месяце:
        const daysInAMonth = getDaysAmountInMonth(panelYear, panelMonth)
        // массив объектов со всеми датами месяца ^
        const currentMonthDays = getCurrentMonthDays(panelYear, panelMonth, daysInAMonth)

        const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
        const nextMonthDays = getNextMonthDays(panelYear, panelMonth)

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
    }, [panelYear, panelMonth])

    const onDateSelect = () => {
    }

    const nextYear = () => {

    }

    const prevYear = () => {

    }

    const nextMonth = () => {

    }

    const prevMonth = () => {

    }

    return (
        <div>
            Date:
            <div>{day} {month} {year}</div>
            <div></div>
            <div className={'CalendarPanel'}>
                {daysOfTheWeek.map(weekDay => <div className={'CalendarPanelItem'}>{weekDay}</div>)}
                {dateCells.map(cell => <div className={'CalendarPanelItem'}>{cell.date}</div>)}
                <div></div>
            </div>
        </div>
    );
};


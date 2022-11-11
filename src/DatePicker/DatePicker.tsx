import React, {FocusEvent, useEffect, useMemo, useRef, useState} from 'react';
import {
    DateCellItem,
    daysOfTheWeek,
    getCurrentMonthDays,
    getDaysAmountInMonth,
    getNextMonthDays,
    getPreviousMonthDays, months
} from './utils';

interface DatePickerProps {
    value: Date
    onChange: (value: Date) => void
    min?: Date
    max?: Date
}

export const DatePicker = ({value, onChange, min, max}: DatePickerProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null)

    const inputValue = useMemo(() => {
        const date = value.getDate()
        const monthValue = value.getMonth()
        const month = monthValue > 9 ? monthValue : '0' + monthValue
        const year = value.getFullYear()

        return `${date}-${month}-${year}`
    }, [value])

    // Попробовать заменить на onBlur
    useEffect(() => {
        const element = elementRef.current

        if (!element) return

        const onDocumentClick = (e: MouseEvent) => {
            const target = e.target

            if (!(target instanceof Node)) {
                return
            }

            if (element.contains(target)) {
                return
            }

            setShowPopup(false)
        }

        document.addEventListener('click', onDocumentClick)

        return () => {
            document.removeEventListener('click', onDocumentClick)
        }
    },[])

    const onInputFocus = (event: FocusEvent<HTMLInputElement>) => {
        setShowPopup(true)
    }

    return (
        <div ref={elementRef} style={{position: 'relative', display: 'inline-block'}}>
            <input value={inputValue} type="text" onFocus={onInputFocus}/>
            {showPopup && (
                <div style={{position: 'absolute', top: '100%', left: 0}}>
                    <DatePickerPopupContent value={value} onChange={onChange} min={min} max={max}/>
                </div>
            )}
        </div>
    )
}

const DatePickerPopupContent = ({value, onChange, min, max}: DatePickerProps) => {
    const [panelYear, setPanelYear] = useState(() => value.getFullYear())
    const [panelMonth, setPanelMonth] = useState(() => value.getMonth())
    const [chosenDate, setChosenDate] = useState<DateCellItem | null>(null)

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

    const onDateSelect = (item: DateCellItem) => {
        onChange(new Date(item.year, item.month, item.date))
        setChosenDate(item)
    }

    const nextYear = () => {
        setPanelYear(panelYear + 1)
    }

    const prevYear = () => {
        setPanelYear(panelYear - 1)
    }

    const nextMonth = () => {
        if (panelMonth === 11) {
            setPanelMonth(0)
            setPanelYear(panelYear + 1)
        } else {
            setPanelMonth(panelMonth + 1)
        }
    }

    const prevMonth = () => {
        if (panelMonth === 0) {
            setPanelMonth(11)
            setPanelYear(panelYear - 1)
        } else {
            setPanelMonth(panelMonth - 1)
        }
    }

    return (
        <div style={{padding: 12}}>
            <div>{months[panelMonth]} {panelYear}</div>
            <div style={{display: 'flex', margin: '12 0', gap: 8}}>
                <button onClick={prevYear}>Prev Year</button>
                <button onClick={prevMonth}>Prev Month</button>
                <button onClick={nextMonth}>Next Month</button>
                <button onClick={nextYear}>Next Year</button>
            </div>
            <div className={'CalendarPanel'}>
                {daysOfTheWeek.map(weekDay => <div key={weekDay} className={'CalendarPanelItem'}>{weekDay}</div>)}
                {dateCells.map(cell => {
                    const date = new Date()
                    const isCurrentDate = `${cell.year}${cell.month}${cell.date}` === `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
                    const selectedDate = cell === chosenDate
                    return <div
                        key={`${cell.year}-${cell.month}-${cell.date}`}
                        className={
                            'CalendarPanelItem' +
                            (isCurrentDate ? ' CalendarPanelItem--current' : '') +
                            (selectedDate ? ' CalendarPanelItem--selected' : '')
                        }
                        onClick={() => onDateSelect(cell)}
                    >
                        {cell.date}
                    </div>
                })}
                <div></div>
            </div>
        </div>
    );
};


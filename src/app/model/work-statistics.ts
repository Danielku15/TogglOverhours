import { DateTime, Duration } from 'luxon';
import { TimeTrackingPeriod, WorkspaceProject } from './database';

export class TrackingPeriodStatistics {
  public hoursWorked!: Duration;
  public hoursNeeded!: Duration;

  public holidaysTaken!: Duration;
  public holidaysTotal!: Duration;
  public holidaysBooked!: Duration;

  public bridgeDaysUntilNow!: Duration;
  public bridgeDaysUpcoming!: Duration;
  public bridgeDaysTotal!: Duration;

  public overHoursUntilNow!: Duration;
  public overHoursIfWorkingNormally!: Duration;

  public perProjectDurations: Map<WorkspaceProject, Duration> = new Map();

  public months: MonthStatistics[] = [];

  public constructor(private period: TimeTrackingPeriod) {
    this.fillFrom()
  }

  fillFrom() {
    // 'round' dates to the right month/week representation as we want to have it visually
    let currentDay = this.period.start;
    let lastDay = this.period.end;

    for (let month = currentDay; month.toISODate() <= lastDay.toISODate(); month = month.plus({ months: 1 })) {
      this.buildMonth(month);
    }
  }

  private buildMonth(startOfMonth: DateTime) {
    const month = new MonthStatistics();
    month.startOfMonth = startOfMonth;
    this.months.push(month);

    let startWeek = startOfMonth.startOf('week');
    let endWeek = startOfMonth.endOf('month');

    for (let week = startWeek; week.weekNumber <= endWeek.weekNumber; week = week.plus({ weeks: 1 })) {
      this.buildWeek(month, week);
    }
  }

  buildWeek(month: MonthStatistics, startOfWeek: DateTime) {
    const week = new WeekStatistics();
    week.weekNumber = startOfWeek.weekNumber;
    month.weeks.push(week);

    let endWeek = startOfWeek.endOf('week');
    for (let day = startOfWeek; day.ordinal <= endWeek.ordinal; day = day.plus({ days: 1 })) {
      this.buildDay(month, week, day)
    }
  }

  buildDay(month: MonthStatistics, week: WeekStatistics, startOfDay: DateTime) {
    const day = new DayStatistics();
    day.date = startOfDay;
    week.days.push(day);

    if (startOfDay.month !== month.startOfMonth.month) {
      day.placeholder = true;
    } else {
      day.hoursNeeded = this.period.workingHours.getByWeekDay(day.date.weekday);
      day.hoursWorked = Duration.fromMillis(0);
    }
  }
}

export class MonthStatistics {
  public startOfMonth!: DateTime;

  public hoursWorked!: Duration;
  public hoursNeeded!: Duration;

  public overHoursUntilNow!: Duration;
  public overHoursIfWorkingNormally!: Duration;

  public perProjectDurations: Map<WorkspaceProject, Duration> = new Map();

  public weeks: WeekStatistics[] = [];
}

export class WeekStatistics {
  public weekNumber!: number;
  public days: DayStatistics[] = [];
}

export class DayStatistics {
  public date!: DateTime;
  public hoursWorked!: Duration;
  public hoursNeeded!: Duration;

  public placeholder!: boolean;
}
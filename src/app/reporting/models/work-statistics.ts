import {
  WorkspaceProject,
  TimeTrackingPeriod,
  TimeTrackingEntry,
} from '@app/core/models/database';
import { DateTime, Duration } from 'luxon';

export class TrackingPeriodStatistics {
  public hoursWorked: Duration = Duration.fromMillis(0);
  public hoursNeeded: Duration = Duration.fromMillis(0);

  public holidaysTaken: Duration = Duration.fromMillis(0);
  public holidaysTotal: Duration = Duration.fromMillis(0);
  public holidaysBooked: Duration = Duration.fromMillis(0);

  public bridgeDaysUntilNow: Duration = Duration.fromMillis(0);
  public bridgeDaysTotal: Duration = Duration.fromMillis(0);

  public overHoursWorked: Duration = Duration.fromMillis(0);
  public overHoursWithBridgeDays: Duration = Duration.fromMillis(0);

  public perProjectDurations: Map<WorkspaceProject, Duration> = new Map();

  public months: MonthStatistics[] = [];

  private _now = DateTime.now();

  public constructor(public period: TimeTrackingPeriod) {
    this.refresh();
  }

  reset() {
    this.hoursWorked = Duration.fromMillis(0);
    this.hoursNeeded = Duration.fromMillis(0);

    this.holidaysTaken = Duration.fromMillis(0);
    this.holidaysTotal = this.period.totalHolidaysAtStart;
    this.holidaysBooked = Duration.fromMillis(0);

    this.bridgeDaysUntilNow = Duration.fromMillis(0);
    this.bridgeDaysTotal = Duration.fromMillis(0);

    this.overHoursWorked = this.period.totalOverhoursAtStart;
    this.overHoursWithBridgeDays = this.period.totalOverhoursAtStart;

    this.perProjectDurations = new Map();

    this.months = [];
  }

  refresh() {
    this.reset();

    const timeEntryLookup = new Map<string, TimeTrackingEntry[]>();
    for (const entry of this.period.timeEntries.values()) {
      const date = entry.start.toISODate();
      let day = timeEntryLookup.get(date);
      if (!day) {
        day = [];
        timeEntryLookup.set(date, day);
      }

      day.push(entry);
    }

    for (const v of timeEntryLookup.values()) {
      v.sort((a, b) => a.start.toMillis() - b.start.toMillis());
    }

    // 'round' dates to the right month/week representation as we want to have it visually
    let currentDay = this.period.start;
    let lastDay = this.period.end;
    console.log('Showing ', this.period);

    for (const p of this.period.database.projects.values()) {
      this.perProjectDurations.set(p, Duration.fromMillis(0));
    }

    for (
      let month = currentDay;
      month.toISODate() <= lastDay.toISODate();
      month = month.plus({ months: 1 })
    ) {
      this.buildMonth(timeEntryLookup, month);
    }
  }

  private buildMonth(
    timeEntryLookup: Map<string, TimeTrackingEntry[]>,
    startOfMonth: DateTime
  ) {
    const month = new MonthStatistics(startOfMonth);
    this.months.push(month);

    if (startOfMonth.month === this.period.start.month) {
      month.overHoursWorked = this.period.totalOverhoursAtStart;
    }

    let startWeek = startOfMonth.startOf('week');
    let endWeek = startOfMonth.endOf('month');

    for (
      let week = startWeek;
      week.toISODate() <= endWeek.toISODate();
      week = week.plus({ weeks: 1 })
    ) {
      this.buildWeek(timeEntryLookup, month, week);
    }
  }

  buildWeek(
    timeEntryLookup: Map<string, TimeTrackingEntry[]>,
    month: MonthStatistics,
    startOfWeek: DateTime
  ) {
    const week = new WeekStatistics(startOfWeek.weekNumber);
    month.weeks.push(week);

    let endWeek = startOfWeek.endOf('week');
    for (
      let day = startOfWeek;
      day.toISODate() <= endWeek.toISODate();
      day = day.plus({ days: 1 })
    ) {
      this.buildDay(timeEntryLookup, month, week, day);
    }
  }

  buildDay(
    timeEntryLookup: Map<string, TimeTrackingEntry[]>,
    month: MonthStatistics,
    week: WeekStatistics,
    startOfDay: DateTime
  ) {
    const day = new DayStatistics(startOfDay);
    week.days.push(day);

    day.isFuture = startOfDay > this._now;

    let dayBridgeDays = Duration.fromMillis(0);
    if (startOfDay.month !== month.startOfMonth.month) {
      day.placeholder = true;
    } else {
      day.hoursNeeded = this.period.workingHours.getByWeekDay(day.date.weekday);
      day.hoursWorked = Duration.fromMillis(0);

      const entries = timeEntryLookup.get(startOfDay.toISODate());
      if (entries) {
        for (const entry of entries) {
          const project = entry.projectId
            ? this.period.database.projects.get(entry.projectId)
            : undefined;
          const projectHours = this.period.getProjectHours(entry.projectId);
          const todayPercentage =
            projectHours.countRatio.getByWeekDay(day.date.weekday) / 100.0;

          day.hoursWorked = day.hoursWorked.plus(
            Duration.fromMillis(
              Math.floor(entry.duration.toMillis() * todayPercentage)
            )
          );

          day.entries.push(
            new TimeEntryDetails(entry, project, todayPercentage)
          );

          if (project) {
            let monthProjectHours = month.perProjectDurations.get(project);
            if (monthProjectHours) {
              monthProjectHours = monthProjectHours!.plus(entry.duration);
            } else {
              monthProjectHours = entry.duration;
            }
            month.perProjectDurations.set(project, monthProjectHours);

            let periodProjectHours = this.perProjectDurations.get(project);
            if (periodProjectHours) {
              periodProjectHours = periodProjectHours!.plus(entry.duration);
            } else {
              periodProjectHours = entry.duration;
            }
            this.perProjectDurations.set(project, periodProjectHours);
          }

          if (entry.projectId === this.period.bridgedaysProject) {
            this.bridgeDaysTotal = this.bridgeDaysTotal.plus(entry.duration);
            dayBridgeDays = dayBridgeDays.plus(entry.duration);

            if (!day.isFuture) {
              this.bridgeDaysUntilNow = this.bridgeDaysUntilNow.plus(
                entry.duration
              );
            }
          }

          if (entry.projectId === this.period.holidayProject) {
            this.holidaysBooked = this.holidaysBooked.plus(entry.duration);
            if (!day.isFuture) {
              this.holidaysTaken = this.holidaysTaken.plus(entry.duration);
            }
          }
        }
      }

      day.hoursDiff = day.hoursNeeded.minus(day.hoursWorked).negate();

      month.hoursNeeded = month.hoursNeeded.plus(day.hoursNeeded);
      month.hoursWorked = month.hoursWorked.plus(day.hoursWorked);
      if (!day.isFuture) {
        month.overHoursWorked = month.overHoursWorked.plus(day.hoursDiff);
        this.overHoursWorked = this.overHoursWorked.plus(day.hoursDiff);
        this.overHoursWithBridgeDays = this.overHoursWithBridgeDays.plus(day.hoursDiff);
      } else {
      }

      this.overHoursWithBridgeDays = this.overHoursWithBridgeDays.minus(dayBridgeDays);

      this.hoursNeeded = this.hoursNeeded.plus(day.hoursNeeded);
      this.hoursWorked = this.hoursWorked.plus(day.hoursWorked);

      if (day.hoursNeeded.toMillis() === 0) {
        day.noWorkDay = true;
      }
    }
  }
}

export class MonthStatistics {
  public constructor(public startOfMonth: DateTime) {}

  public hoursWorked: Duration = Duration.fromMillis(0);
  public hoursNeeded: Duration = Duration.fromMillis(0);

  public overHoursWorked: Duration = Duration.fromMillis(0);

  public perProjectDurations: Map<WorkspaceProject, Duration> = new Map();

  public weeks: WeekStatistics[] = [];
}

export class WeekStatistics {
  public constructor(public weekNumber: number) {}
  public days: DayStatistics[] = [];
}

export class DayStatistics {
  public constructor(public date: DateTime) {}

  public hoursWorked: Duration = Duration.fromMillis(0);
  public hoursNeeded: Duration = Duration.fromMillis(0);

  public hoursDiff: Duration = Duration.fromMillis(0);

  public placeholder: boolean = false;
  public noWorkDay: boolean = false;
  public isFuture: boolean = false;

  public entries: TimeEntryDetails[] = [];
}

export class TimeEntryDetails {
  public constructor(
    public entry: TimeTrackingEntry,
    public project: WorkspaceProject | undefined,
    public percentage: number
  ) {}
}

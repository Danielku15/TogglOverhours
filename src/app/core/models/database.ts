import { AES, enc as CryptoEnc } from 'crypto-js';
import { DateTime, Duration, WeekdayNumbers } from 'luxon';
import { IFileSystemFileHandle } from '../services/file-system.service';

export interface JsonSerializationContext {
  encryptData(text: string): string;
  decryptData(text: string): string;
}

export class NonEncryptingJsonSerializationContext
  implements JsonSerializationContext {
  encryptData(text: string): string {
    return text;
  }
  decryptData(text: string): string {
    return text;
  }
}

export class PasswordEncryptingJsonSerializationContext
  implements JsonSerializationContext {
  static readonly prefix = 'PrefixForDetectingValidPassword_';

  public constructor(private password: string) { }
  encryptData(text: string): string {
    return AES.encrypt(
      PasswordEncryptingJsonSerializationContext.prefix + text,
      this.password
    ).toString();
  }
  decryptData(text: string): string {
    try {
      const decrypted = AES.decrypt(text, this.password).toString(
        CryptoEnc.Utf8
      );
      if (
        !decrypted.startsWith(PasswordEncryptingJsonSerializationContext.prefix)
      ) {
        throw new Error('Password maybe wrong?');
      }
      return decrypted.substring(
        PasswordEncryptingJsonSerializationContext.prefix.length
      );
    } catch (e) {
      throw new Error(`Decryption failed! ${e}`);
    }
  }
}

export interface JsonSerializable {
  toJSON(context: JsonSerializationContext): any;
  fromJSON(json: any, context: JsonSerializationContext): void;
}

export class WorkspaceProject implements JsonSerializable {
  id: number = 0;
  color: string = '';
  active: boolean = true;
  deleted: boolean = false;
  name: string = '';

  public toJSON() {
    return {
      id: this.id,
      color: this.color,
      active: this.active,
      name: this.name,
      deleted: this.deleted,
    };
  }

  public fromJSON(json: any): WorkspaceProject {
    this.id = json.id;
    this.color = json.color;
    this.active = json.active;
    this.name = json.name;
    this.deleted = json.deleted;
    return this;
  }
}

export abstract class WeekdaySettings<T> implements JsonSerializable {
  monday!: T;
  tuesday!: T;
  wednesday!: T;
  thursday!: T;
  friday!: T;
  saturday!: T;
  sunday!: T;

  abstract toJSON(): any;
  abstract fromJSON(json: any): void;



  public getByWeekDay(weekday: WeekdayNumbers): T {
    switch (weekday) {
      case 1: return this.monday;
      case 2: return this.tuesday;
      case 3: return this.wednesday;
      case 4: return this.thursday;
      case 5: return this.friday;
      case 6: return this.saturday;
      case 7: return this.sunday;
    }
  }
}

export class WeekdayPercentage extends WeekdaySettings<number> {
  public constructor() {
    super();
    this.monday = 100;
    this.tuesday = 100;
    this.wednesday = 100;
    this.thursday = 100;
    this.friday = 100;
    this.saturday = 100;
    this.sunday = 100;
  }

  override toJSON(): any {
    return {
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday,
    };
  }
  override fromJSON(json: any): void {
    this.monday = json.monday;
    this.tuesday = json.tuesday;
    this.wednesday = json.wednesday;
    this.thursday = json.thursday;
    this.friday = json.friday;
    this.saturday = json.saturday;
    this.sunday = json.sunday;
  }
}

export class WeekdayDuration extends WeekdaySettings<Duration> {
  public constructor() {
    super();
    this.monday = Duration.fromObject({ hours: 8 });
    this.tuesday = Duration.fromObject({ hours: 8 });
    this.wednesday = Duration.fromObject({ hours: 8 });
    this.thursday = Duration.fromObject({ hours: 8 });
    this.friday = Duration.fromObject({ hours: 8 });
    this.saturday = Duration.fromMillis(0);
    this.sunday = Duration.fromMillis(0);
  }

  override toJSON(): any {
    return {
      monday: this.monday.toISO(),
      tuesday: this.tuesday.toISO(),
      wednesday: this.wednesday.toISO(),
      thursday: this.thursday.toISO(),
      friday: this.friday.toISO(),
      saturday: this.saturday.toISO(),
      sunday: this.sunday.toISO(),
    };
  }
  override fromJSON(json: any): void {
    this.monday = Duration.fromISO(json.monday);
    this.tuesday = Duration.fromISO(json.tuesday);
    this.wednesday = Duration.fromISO(json.wednesday);
    this.thursday = Duration.fromISO(json.thursday);
    this.friday = Duration.fromISO(json.friday);
    this.saturday = Duration.fromISO(json.saturday);
    this.sunday = Duration.fromISO(json.sunday);
  }
}

export class TimeTrackingEntry implements JsonSerializable {
  id: number = 0;
  projectId?: number;
  title: string = "";
  start: DateTime = DateTime.now();
  end: DateTime = DateTime.now();
  duration: Duration = Duration.fromMillis(0);

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      title: this.title,
      start: this.start.toISO(),
      end: this.end.toISO(),
      duration: this.duration.toISO(),
    };
  }

  fromJSON(json: any): TimeTrackingEntry {
    this.id = json.id;
    this.projectId = json.projectId;
    this.title = json.title ?? "";
    this.start = DateTime.fromISO(json.start);
    this.end = DateTime.fromISO(json.end);
    this.duration = Duration.fromISO(json.duration);
    return this;
  }
}

export class TimeTrackingPeriod implements JsonSerializable {
  id: string = crypto.randomUUID();

  start: DateTime = DateTime.now();
  end: DateTime = DateTime.now();

  totalHolidaysAtStart: Duration = Duration.fromMillis(0);
  totalOverhoursAtStart: Duration = Duration.fromMillis(0);

  holidayProject: number = 0;
  sickdaysProject: number = 0;
  bridgedaysProject: number = 0;

  workingHours: WeekdayDuration = new WeekdayDuration();

  noProjectHours: ProjectSettings = new ProjectSettings();

  projectHours: Map<number, ProjectSettings> = new Map<
    number,
    ProjectSettings
  >();

  timeEntries: Map<number, TimeTrackingEntry> = new Map<number, TimeTrackingEntry>()

  public constructor(public database: Database) { }

  
  public getProjectHours(projectId: number | undefined): ProjectSettings {
    return this.projectHours.get(projectId as number) ?? this.noProjectHours;
  }

  toJSON(): any {
    return {
      id: this.id,
      start: this.start.toISO(),
      end: this.end.toISO(),
      totalHolidaysAtStart: this.totalHolidaysAtStart.toISO(),
      totalOverhoursAtStart: this.totalOverhoursAtStart.toISO(),
      holidayProject: this.holidayProject,
      sickdaysProject: this.sickdaysProject,
      bridgedaysProject: this.bridgedaysProject,

      workingHours: this.workingHours.toJSON(),
      noProjectHours: this.noProjectHours.toJSON(),
      projectHours: Object.fromEntries(
        Array.from(this.projectHours.entries()).map((kvp) => [
          kvp[0],
          kvp[1].toJSON(),
        ])
      ),
      timeEntries: Object.fromEntries(
        Array.from(this.timeEntries.entries()).map((kvp) => [
          kvp[0],
          kvp[1].toJSON(),
        ])
      )
    };
  }
  fromJSON(json: any): void {
    this.id = json.id;
    this.start = DateTime.fromISO(json.start);
    this.end = DateTime.fromISO(json.end);
    this.totalHolidaysAtStart = Duration.fromISO(json.totalHolidaysAtStart);
    this.totalOverhoursAtStart = Duration.fromISO(json.totalOverhoursAtStart);
    this.holidayProject = json.holidayProject;
    this.sickdaysProject = json.sickdaysProject;
    this.bridgedaysProject = json.bridgedaysProject;
    this.workingHours.fromJSON(json.workingHours);
    this.noProjectHours.fromJSON(json.noProjectHours);
    this.projectHours = new Map<number, ProjectSettings>(
      Object.entries(json.projectHours).map((kvp) => [
        Number(kvp[0]),
        new ProjectSettings().fromJSON(kvp[1]),
      ])
    );

    const timeEntries = Object.entries(json.timeEntries).map((kvp) => [
      Number(kvp[0]),
      new TimeTrackingEntry().fromJSON(kvp[1]),
    ] as [number, TimeTrackingEntry]);
    timeEntries.sort((a, b) => {
      return a[1].start.toMillis() - b[1].start.toMillis()
    });
    this.timeEntries = new Map<number, TimeTrackingEntry>(
      timeEntries
    );
  }
}

export class ProjectSettings implements JsonSerializable {
  countRatio: WeekdayPercentage = new WeekdayPercentage();
  toJSON(): any {
    return {
      countRatio: this.countRatio.toJSON(),
    };
  }
  fromJSON(json: any): ProjectSettings {
    this.countRatio.fromJSON(json.countRatio);
    return this;
  }
}

export class Database implements JsonSerializable {
  public lastUpdate: DateTime = DateTime.now();
  public workspaceId: number = 0;
  public togglApiToken: string = '';
  public projects: Map<number, WorkspaceProject> = new Map();
  public trackingPeriods: TimeTrackingPeriod[] = [];  

  toJSON(context: JsonSerializationContext) {
    return {
      lastUpdate: this.lastUpdate.toISO(),
      togglApiToken: context.encryptData(this.togglApiToken),
      workspaceId: this.workspaceId,
      projects: Object.fromEntries(
        Array.from(this.projects.entries()).map((kvp) => [
          kvp[0],
          kvp[1].toJSON(),
        ])
      ),
      trackingPeriods: this.trackingPeriods.map((p) => p.toJSON()),
    };
  }
  fromJSON(json: any, context: JsonSerializationContext): void {
    this.lastUpdate = DateTime.fromISO(json.lastUpdate);
    this.togglApiToken = context.decryptData(json.togglApiToken);
    this.workspaceId = json.workspaceId;
    this.projects = new Map<number, WorkspaceProject>(
      Object.entries(json.projects).map((kvp) => [
        Number(kvp[0]),
        new WorkspaceProject().fromJSON(kvp[1]),
      ])
    );
    this.trackingPeriods = (json.trackingPeriods as any[]).map((o) => {
      const p = new TimeTrackingPeriod(this);
      p.fromJSON(o);
      return p;
    });
  }

  async writeToFile(
    handle: IFileSystemFileHandle,
    context: JsonSerializationContext
  ) {
    const json = JSON.stringify(this.toJSON(context), null, 2);
    await handle.writeText(json);
  }
}

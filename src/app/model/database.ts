import { AES, format as CryptoFormat, enc as CryptoEnc } from 'crypto-js';
import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { IFileSystemFileHandle } from '../file-system.service';

export interface JsonSerializationContext {
  encryptData(text: string): string;
  decryptData(text: string): string;
}

export class NonEncryptingJsonSerializationContext
  implements JsonSerializationContext
{
  encryptData(text: string): string {
    return text;
  }
  decryptData(text: string): string {
    return text;
  }
}

export class PasswordEncryptingJsonSerializationContext
  implements JsonSerializationContext
{
  static readonly prefix = 'PrefixForDetectingValidPassword_';

  public constructor(private password: string) {}
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

  public fromJSON(json: any): void {
    this.id = json.id;
    this.color = json.color;
    this.active = json.active;
    this.name = json.name;
    this.deleted = json.deleted;
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
}

export class WeekdayPercentage extends WeekdaySettings<number> {
  public constructor() {
    super();
    this.monday = 100;
    this.tuesday = 100;
    this.wednesday = 100;
    this.thursday = 100;
    this.friday = 100;
    this.saturday = 0;
    this.sunday = 0;
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

export class TimeTrackingPeriod implements JsonSerializable {
  id: string = uuidv4();

  start: DateTime = DateTime.now();
  end: DateTime = DateTime.now();

  totalHolidaysAtStart: Duration = Duration.fromMillis(0);
  totalOverhoursAtStart: Duration = Duration.fromMillis(0);

  holidayProject: number = 0;
  sickdaysProject: number = 0;
  bridgedaysProject: number = 0;

  workingHours: WeekdayDuration = new WeekdayDuration();

  noProjectHours: WeekdayPercentage = new WeekdayPercentage();

  projectHours: Map<number, ProjectSettings> = new Map<
    number,
    ProjectSettings
  >();

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
  public projects: WorkspaceProject[] = [];
  public trackingPeriods: TimeTrackingPeriod[] = [];

  toJSON(context: JsonSerializationContext) {
    return {
      lastUpdate: this.lastUpdate.toISO(),
      togglApiToken: context.encryptData(this.togglApiToken),
      workspaceId: this.workspaceId,
      projects: this.projects.map((p) => p.toJSON()),
      trackingPeriods: this.trackingPeriods.map((p) => p.toJSON()),
    };
  }
  fromJSON(json: any, context: JsonSerializationContext): void {
    this.lastUpdate = DateTime.fromISO(json.lastUpdate);
    this.togglApiToken = context.decryptData(json.togglApiToken);
    this.workspaceId = json.workspaceId;
    this.projects = (json.projects as any[]).map((o) => {
      const p = new WorkspaceProject();
      p.fromJSON(o);
      return p;
    });
    this.trackingPeriods = (json.trackingPeriods as any[]).map((o) => {
      const p = new TimeTrackingPeriod();
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

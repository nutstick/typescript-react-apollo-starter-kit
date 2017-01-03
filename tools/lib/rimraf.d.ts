import * as glob from 'glob';
import { unlink, chmod, stat, lstat, rmdir, readdir, unlinkSync, chmodSync, statSync, lstatSync, rmdirSync, readdirSync } from 'fs';

declare function rimraf (pattern: string, callback: (error: Error) => any): void;
declare function rimraf (pattern: string, options: rimraf.Options, callback: (error: Error) => any): void;

declare namespace rimraf {
  export interface Options {
    unlink?: typeof unlink;
    chmod?: typeof chmod;
    stat?: typeof stat;
    lstat?: typeof lstat;
    rmdir?: typeof rmdir;
    readdir?: typeof readdir;
    unlinkSync?: typeof unlinkSync;
    chmodSync?: typeof chmodSync;
    statSync?: typeof statSync;
    lstatSync?: typeof lstatSync;
    rmdirSync?: typeof rmdirSync;
    readdirSync?: typeof readdirSync;
    maxBusyTries: number;
    emfileWait: number;
    glob: boolean | glob.IOptions;
    disableGlob: boolean;
  }

  export function sync (pattern: string, options?: rimraf.Options): void;
}

export = rimraf;